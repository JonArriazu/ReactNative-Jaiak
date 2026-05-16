import React, { useState, useMemo } from 'react';
import {
    View, Text, FlatList, StyleSheet, Pressable,
    TextInput, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { jaiak } from '../comun/jaiakDatak';
import { formatBasqueDateRange } from '../comun/dateUtils';
import { COLORS, PROVINCE_COLORS, PROVINCE_LIGHT_COLORS, PROVINCES, colorJaiApp } from '../comun/comun';

const TODAS = 'Denak';
const FILTROS = [TODAS, ...PROVINCES];

export default function Buscador({ navigation }) {
    const [texto, setTexto]         = useState('');
    const [provincia, setProvincia] = useState(TODAS);

    const resultados = useMemo(() => {
        const q = texto.trim().toLowerCase();
        return jaiak
            .filter(j => {
                const coincideProv  = provincia === TODAS || j.province === provincia;
                const coincideTexto = !q
                    || j.name.toLowerCase().includes(q)
                    || j.city.toLowerCase().includes(q)
                    || j.area.toLowerCase().includes(q);
                return coincideProv && coincideTexto;
            })
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }, [texto, provincia]);

    return (
        <View style={styles.container}>
            {/* Barra de búsqueda */}
            <View style={styles.searchBox}>
                <MaterialCommunityIcons name="magnify" size={20} color={COLORS.muted} style={styles.searchIcono} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Bilatu izena, herria…"
                    placeholderTextColor={COLORS.muted}
                    value={texto}
                    onChangeText={setTexto}
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                    autoCorrect={false}
                />
                {texto.length > 0 && Platform.OS === 'android' && (
                    <Pressable onPress={() => setTexto('')} hitSlop={8}>
                        <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.muted} />
                    </Pressable>
                )}
            </View>

            {/* Chips de provincia */}
            <View style={styles.filtros}>
                {FILTROS.map(p => {
                    const activo = provincia === p;
                    const color  = p === TODAS ? colorJaiApp : (PROVINCE_COLORS[p] || colorJaiApp);
                    return (
                        <Pressable
                            key={p}
                            style={[styles.chip, activo && { backgroundColor: color, borderColor: color }]}
                            onPress={() => setProvincia(p)}
                        >
                            <Text style={[styles.chipTxt, activo && styles.chipTxtActivo]}>{p}</Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* Contador de resultados */}
            <Text style={styles.contador}>{resultados.length} emaitza</Text>

            {/* Lista */}
            <FlatList
                data={resultados}
                keyExtractor={item => item.id}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    <View style={styles.vacio}>
                        <MaterialCommunityIcons name="calendar-search" size={52} color="#ddd" />
                        <Text style={styles.vacioTxt}>Ez da emaitzarik aurkitu</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const provColor = PROVINCE_COLORS[item.province] || COLORS.primary;
                    const cardColor = PROVINCE_LIGHT_COLORS[item.province] || COLORS.card;
                    return (
                        <Pressable
                            style={({ pressed }) => [
                                styles.card,
                                { backgroundColor: cardColor, borderLeftColor: provColor },
                                pressed && styles.cardPressed,
                            ]}
                            onPress={() => navigation.navigate('DetalleJaiBuscador', { jai: item })}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                                <View style={[styles.badge, { backgroundColor: provColor }]}>
                                    <Text style={styles.badgeTxt}>{item.province}</Text>
                                </View>
                            </View>
                            <Text style={[styles.date, { color: provColor }]}>
                                {formatBasqueDateRange(item.startDate, item.endDate)}
                            </Text>
                            <Text style={styles.place}>{item.area} · {item.city}</Text>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },

    searchBox: {
        flexDirection: 'row', alignItems: 'center',
        margin: 12, marginBottom: 8,
        backgroundColor: 'white',
        borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 10 : 4,
    },
    searchIcono:  { marginRight: 8 },
    searchInput:  { flex: 1, fontSize: 16, color: COLORS.text },

    filtros: {
        flexDirection: 'row', flexWrap: 'wrap',
        paddingHorizontal: 12, gap: 8, marginBottom: 4,
    },
    chip: {
        paddingHorizontal: 14, paddingVertical: 7,
        borderRadius: 999, borderWidth: 1.5, borderColor: COLORS.border,
        backgroundColor: 'white',
    },
    chipTxt:       { fontSize: 13, fontWeight: '600', color: COLORS.muted },
    chipTxtActivo: { color: 'white' },

    contador: { fontSize: 12, color: COLORS.muted, paddingHorizontal: 16, marginBottom: 4 },

    card: {
        marginHorizontal: 12, marginBottom: 10,
        padding: 14, borderRadius: 14,
        borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 7,
    },
    cardPressed: { opacity: 0.75 },
    cardHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
    name:  { flex: 1, fontSize: 16, fontWeight: 'bold', color: COLORS.text },
    date:  { marginTop: 6, fontSize: 15, fontWeight: '700' },
    place: { marginTop: 4, fontSize: 13, color: COLORS.text },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
    badgeTxt: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

    vacio:    { alignItems: 'center', marginTop: 60, gap: 12 },
    vacioTxt: { fontSize: 16, color: '#bbb' },
});
