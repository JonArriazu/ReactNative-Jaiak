import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View, Text, StyleSheet, ActivityIndicator,
    Pressable, Platform, FlatList, Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import { colorJaiApp, PROVINCE_COLORS } from '../comun/comun';
import { getCoordenadas } from '../comun/coordenadasHerria';
import { formatBasqueDateRange } from '../comun/dateUtils';

const { height: SCREEN_H } = Dimensions.get('window');

const REGION_EUSKAL_HERRIA = {
    latitude: 43.0, longitude: -1.9,
    latitudeDelta: 2.2, longitudeDelta: 2.2,
};

// ─── Clustering ───────────────────────────────────────────────────────────────
// Agrupa marcadores cercanos según el nivel de zoom actual.
// Devuelve array de { type:'single'|'cluster', coords, item?, items?, count? }
function computeClusters(markers, region) {
    const cellSize = Math.max(region.latitudeDelta / 10, 0.004);

    const cells = {};
    for (const m of markers) {
        const ci = Math.floor(m.coords.latitude  / cellSize);
        const cj = Math.floor(m.coords.longitude / cellSize);
        const key = `${ci},${cj}`;
        if (!cells[key]) cells[key] = [];
        cells[key].push(m);
    }

    return Object.values(cells).map(group => {
        if (group.length === 1) {
            return { type: 'single', coords: group[0].coords, item: group[0] };
        }
        const lat = group.reduce((s, m) => s + m.coords.latitude,  0) / group.length;
        const lng = group.reduce((s, m) => s + m.coords.longitude, 0) / group.length;
        // Color dominante = provincia más frecuente del grupo
        const freq = {};
        group.forEach(m => { freq[m.province] = (freq[m.province] || 0) + 1; });
        const prov = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
        return {
            type: 'cluster',
            coords: { latitude: lat, longitude: lng },
            items: group,
            count: group.length,
            color: PROVINCE_COLORS[prov] || colorJaiApp,
        };
    });
}

// ─── Marker visual para clusters ──────────────────────────────────────────────
// Icono + número en un único Marker. Así evitamos que el pin y el texto se
// rendericen como dos marcadores independientes y se desplacen entre sí.
function ClusterMarker({ count, color }) {
    return (
        <View collapsable={false} style={styles.clusterMarker}>
            <MaterialCommunityIcons name="map-marker" size={44} color={color} />
            <Text allowFontScaling={false} style={styles.clusterCount}>
                {count}
            </Text>
        </View>
    );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function FiltroToggle({ valor, onChange }) {
    return (
        <View style={styles.toggleContainer}>
            <Pressable
                style={[styles.toggleBtn, valor === 'denak' && styles.toggleBtnActivo]}
                onPress={() => onChange('denak')}
            >
                <MaterialCommunityIcons name="map-marker-multiple" size={15}
                    color={valor === 'denak' ? 'white' : colorJaiApp} style={{ marginRight: 4 }} />
                <Text style={[styles.toggleTxt, valor === 'denak' && styles.toggleTxtActivo]}>Denak</Text>
            </Pressable>
            <Pressable
                style={[styles.toggleBtn, valor === 'gogokoak' && styles.toggleBtnActivo]}
                onPress={() => onChange('gogokoak')}
            >
                <MaterialCommunityIcons name="heart" size={15}
                    color={valor === 'gogokoak' ? 'white' : colorJaiApp} style={{ marginRight: 4 }} />
                <Text style={[styles.toggleTxt, valor === 'gogokoak' && styles.toggleTxtActivo]}>Gogokoak</Text>
            </Pressable>
        </View>
    );
}

// ─── Panel inferior (fiesta única) ───────────────────────────────────────────
function PanelUno({ item, onCerrar }) {
    if (!item) return null;
    const color = PROVINCE_COLORS[item.province] || colorJaiApp;
    return (
        <View style={[styles.panel, { borderLeftColor: color }]}>
            <View style={styles.panelHeader}>
                <Text style={styles.panelNombre} numberOfLines={2}>{item.name}</Text>
                <Pressable onPress={onCerrar} hitSlop={12}>
                    <MaterialCommunityIcons name="close" size={20} color="#888" />
                </Pressable>
            </View>
            <Text style={[styles.panelFecha, { color }]}>
                📅 {formatBasqueDateRange(item.startDate, item.endDate)}
            </Text>
            <Text style={styles.panelLeku}>📍 {item.area} · {item.city}</Text>
        </View>
    );
}

// ─── Panel inferior (lista de cluster) ───────────────────────────────────────
function PanelLista({ items, onCerrar }) {
    if (!items || items.length === 0) return null;
    return (
        <View style={styles.panel}>
            <View style={styles.panelHeader}>
                <Text style={styles.panelTitulo}>{items.length} jai hemen</Text>
                <Pressable onPress={onCerrar} hitSlop={12}>
                    <MaterialCommunityIcons name="close" size={20} color="#888" />
                </Pressable>
            </View>
            <FlatList
                data={items}
                keyExtractor={i => i.id}
                style={styles.lista}
                showsVerticalScrollIndicator={true}
                renderItem={({ item, index }) => {
                    const color = PROVINCE_COLORS[item.province] || colorJaiApp;
                    return (
                        <View style={[
                            styles.listaItem,
                            index < items.length - 1 && styles.listaItemBorder,
                        ]}>
                            <View style={[styles.listaBarrita, { backgroundColor: color }]} />
                            <View style={styles.listaTextos}>
                                <Text style={styles.listaNombre} numberOfLines={2}>{item.name}</Text>
                                <Text style={[styles.listaFecha, { color }]}>
                                    {formatBasqueDateRange(item.startDate, item.endDate)}
                                </Text>
                                <Text style={styles.listaLeku}>{item.area} · {item.city}</Text>
                            </View>
                        </View>
                    );
                }}
            />
        </View>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Mapa() {
    const mapRef = useRef(null);
    const [ubicacion, setUbicacion] = useState(null);
    const [cargando, setCargando]   = useState(true);
    const [filtro, setFiltro]       = useState('denak');
    const [seleccion, setSeleccion] = useState(null);

    const favoritosIds = useSelector(s => s.favoritos.favoritos);
    const jaiak = useSelector(s => s.jaiak.jaiak);

    // Preparar marcadores con coordenadas
    const markers = useMemo(() => {
        const base = filtro === 'gogokoak'
            ? jaiak.filter(j => favoritosIds.includes(j.id))
            : jaiak;
        return base.map(j => ({
            ...j,
            coords: getCoordenadas(j.area, j.city, j.province),
        }));
    }, [jaiak, filtro, favoritosIds]);

    useEffect(() => { solicitarUbicacion(); }, []);

    async function solicitarUbicacion() {
        setCargando(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            try {
                const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                setUbicacion(pos.coords);
            } catch { /* sin GPS */ }
        }
        setCargando(false);
    }

    function centrarEnMiPosicion() {
        if (ubicacion && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: ubicacion.latitude, longitude: ubicacion.longitude,
                latitudeDelta: 0.05, longitudeDelta: 0.05,
            }, 500);
        }
    }

    if (cargando) {
        return (
            <View style={styles.centrado}>
                <ActivityIndicator size="large" color={colorJaiApp} />
                <Text style={styles.textoInfo}>Kokapena lortzen…</Text>
            </View>
        );
    }

    const regionInicial = ubicacion
        ? { latitude: ubicacion.latitude, longitude: ubicacion.longitude, latitudeDelta: 0.3, longitudeDelta: 0.3 }
        : REGION_EUSKAL_HERRIA;

    const gpsBottom = seleccion ? 160 : (Platform.OS === 'ios' ? 40 : 24);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.mapa}
                provider={PROVIDER_DEFAULT}
                initialRegion={regionInicial}
                showsUserLocation={true}
                showsMyLocationButton={false}
                showsCompass={true}
                onPress={() => setSeleccion(null)}
            >
                {markers.map(j => (
                    <Marker
                        key={j.id}
                        coordinate={j.coords}
                        pinColor={PROVINCE_COLORS[j.province] || colorJaiApp}
                        onPress={e => { e.stopPropagation(); setSeleccion({ type: 'single', item: j }); }}
                    />
                ))}
            </MapView>

            {/* Toggle */}
            <FiltroToggle valor={filtro} onChange={v => { setFiltro(v); setSeleccion(null); }} />

            {/* Contador */}
            <View style={styles.contador}>
                <Text style={styles.contadorTxt}>
                    {markers.length} jai
                    {filtro === 'gogokoak' && favoritosIds.length === 0 ? ' — ez dago gogokoanik' : ''}
                </Text>
            </View>

            {/* Panel inferior */}
            {seleccion?.type === 'single' && (
                <View style={styles.panelWrapper}>
                    <PanelUno item={seleccion.item} onCerrar={() => setSeleccion(null)} />
                </View>
            )}
            {false && (
                <View style={styles.panelWrapper}>
                    <PanelLista items={[]} onCerrar={() => setSeleccion(null)} />
                </View>
            )}

            {/* Botón GPS */}
            {ubicacion && (
                <Pressable
                    style={[styles.botonGps, { bottom: gpsBottom }]}
                    onPress={centrarEnMiPosicion}
                >
                    <MaterialCommunityIcons name="crosshairs-gps" size={22} color="white" />
                </Pressable>
            )}
        </View>
    );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1 },
    mapa:      { flex: 1 },
    centrado:  { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    textoInfo: { fontSize: 16, color: '#555' },

    // Cluster: icono y número juntos en el mismo Marker.
    clusterMarker: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clusterCount: {
        position: 'absolute',
        top: 7,
        color: 'white',
        fontWeight: '900',
        fontSize: 13,
        includeFontPadding: false,
        textAlign: 'center',
        minWidth: 24,
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    // Toggle
    toggleContainer: {
        position: 'absolute', top: 12, alignSelf: 'center',
        flexDirection: 'row', backgroundColor: 'white',
        borderRadius: 24, borderWidth: 1.5, borderColor: colorJaiApp,
        overflow: 'hidden', elevation: 5,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, shadowRadius: 4,
    },
    toggleBtn:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 9 },
    toggleBtnActivo: { backgroundColor: colorJaiApp },
    toggleTxt:       { fontSize: 14, fontWeight: '600', color: colorJaiApp },
    toggleTxtActivo: { color: 'white' },

    // Contador
    contador: {
        position: 'absolute', top: 62, alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
    },
    contadorTxt: { color: 'white', fontSize: 12, fontWeight: '500' },

    // Panel inferior
    panelWrapper: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 12,
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        paddingTop: 6,
    },
    panel: {
        backgroundColor: 'white', borderRadius: 16, borderLeftWidth: 5,
        borderLeftColor: colorJaiApp, paddingHorizontal: 14, paddingVertical: 12,
        elevation: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15, shadowRadius: 6,
    },
    panelHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    panelTitulo:  { fontSize: 15, fontWeight: 'bold', color: '#333' },
    panelNombre:  { flex: 1, fontSize: 15, fontWeight: 'bold', color: '#1a1a1a', lineHeight: 20 },
    panelFecha:   { fontSize: 14, fontWeight: '700', marginBottom: 3 },
    panelLeku:    { fontSize: 13, color: '#555' },

    // Lista del cluster
    lista: { maxHeight: SCREEN_H * 0.35 },
    listaItem: { flexDirection: 'row', paddingVertical: 10, alignItems: 'flex-start' },
    listaItemBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
    listaBarrita: { width: 4, borderRadius: 2, alignSelf: 'stretch', marginRight: 10, minHeight: 36 },
    listaTextos:  { flex: 1 },
    listaNombre:  { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
    listaFecha:   { fontSize: 12, fontWeight: '700', marginBottom: 1 },
    listaLeku:    { fontSize: 11, color: '#777' },

    // Botón GPS
    botonGps: {
        position: 'absolute', right: 16,
        backgroundColor: colorJaiApp,
        width: 46, height: 46, borderRadius: 23,
        justifyContent: 'center', alignItems: 'center',
        elevation: 4,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, shadowRadius: 4,
    },
});
