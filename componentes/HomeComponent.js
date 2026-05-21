import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import { formatBasqueDateRange } from '../comun/dateUtils';
import {
    COLORS,
    PROVINCE_COLORS,
    PROVINCE_LIGHT_COLORS,
    PROVINCES,
    colorJaiApp,
} from '../comun/comun';

function obtenerHoyTexto() {
    return new Date().toISOString().split('T')[0];
}

function fiestaActivaEnFecha(jai, fechaTexto) {
    const fecha = new Date(fechaTexto);
    const inicio = new Date(jai.startDate);
    const fin = new Date(jai.endDate || jai.startDate);

    return inicio <= fecha && fin >= fecha;
}

function obtenerProximasJaiak(jaiak) {
    const hoy = obtenerHoyTexto();

    return jaiak
        .filter((jai) => jai.endDate >= hoy || jai.startDate >= hoy)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 5);
}

export default function Home({ navigation }) {
    const favoritosIds = useSelector((state) => state.favoritos.favoritos);
    const jaiak = useSelector((state) => state.jaiak.jaiak);

    const jaiakHoy = useMemo(() => {
        const hoy = obtenerHoyTexto();
        return jaiak.filter((jai) => fiestaActivaEnFecha(jai, hoy));
    }, [jaiak]);

    const proximasJaiak = useMemo(() => obtenerProximasJaiak(jaiak), [jaiak]);

    const abrirDrawer = (pantalla) => {
        navigation.getParent()?.navigate(pantalla);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.hero}>
                <Text style={styles.heroTitulo}>JaiApp</Text>
                <Text style={styles.heroSubtitulo}>
                    Euskal Herriko jaiak aurkitu, gorde eta antolatu.
                </Text>
            </View>

            <View style={styles.quickGrid}>
                <Pressable
                    style={styles.quickCard}
                    onPress={() => abrirDrawer('Egutegia')}
                >
                    <MaterialCommunityIcons
                        name="calendar-month"
                        size={30}
                        color={colorJaiApp}
                    />
                    <Text style={styles.quickTitle}>Egutegia</Text>
                    <Text style={styles.quickText}>Bilatu jaiak dataren arabera</Text>
                </Pressable>

                <Pressable
                    style={styles.quickCard}
                    onPress={() => abrirDrawer('Mapa')}
                >
                    <MaterialCommunityIcons
                        name="map-marker-radius"
                        size={30}
                        color={colorJaiApp}
                    />
                    <Text style={styles.quickTitle}>Mapa</Text>
                    <Text style={styles.quickText}>Ikusi jaiak mapan</Text>
                </Pressable>

                <Pressable
                    style={styles.quickCard}
                    onPress={() => abrirDrawer('Bilatzailea')}
                >
                    <MaterialCommunityIcons
                        name="magnify"
                        size={30}
                        color={colorJaiApp}
                    />
                    <Text style={styles.quickTitle}>Bilatzailea</Text>
                    <Text style={styles.quickText}>Bilatu izenez edo herriz</Text>
                </Pressable>

                <Pressable
                    style={styles.quickCard}
                    onPress={() => abrirDrawer('Gogokoak')}
                >
                    <MaterialCommunityIcons
                        name="heart"
                        size={30}
                        color="#8E44AD"
                    />
                    <Text style={styles.quickTitle}>Gogokoak</Text>
                    <Text style={styles.quickText}>
                        {favoritosIds.length} jai gordeta
                    </Text>
                </Pressable>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Gaurko jaiak</Text>
                    <Pressable onPress={() => abrirDrawer('Egutegia')}>
                        <Text style={styles.sectionLink}>Egutegia ireki</Text>
                    </Pressable>
                </View>

                {jaiakHoy.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <MaterialCommunityIcons
                            name="calendar-remove"
                            size={34}
                            color={COLORS.muted}
                        />
                        <Text style={styles.emptyText}>
                            Gaur ez dago jairik erregistratuta.
                        </Text>
                    </View>
                ) : (
                    jaiakHoy.slice(0, 3).map((jai) => (
                        <JaiCard
                            key={jai.id}
                            jai={jai}
                            navigation={navigation}
                        />
                    ))
                )}
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Hurrengo jaiak</Text>
                    <Pressable onPress={() => abrirDrawer('Bilatzailea')}>
                        <Text style={styles.sectionLink}>Denak ikusi</Text>
                    </Pressable>
                </View>

                {proximasJaiak.map((jai) => (
                    <JaiCard
                        key={jai.id}
                        jai={jai}
                        navigation={navigation}
                    />
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Probintziaren arabera</Text>

                <View style={styles.provinceGrid}>
                    {PROVINCES.map((province) => {
                        const color = PROVINCE_COLORS[province] || colorJaiApp;

                        return (
                            <Pressable
                                key={province}
                                style={[
                                    styles.provinceButton,
                                    { borderColor: color },
                                ]}
                                onPress={() =>
                                    navigation.getParent()?.navigate('Bilatzailea', {
                                        screen: 'BilatzaileaPantaila',
                                        params: { province },
                                    })
                                }
                            >
                                <View
                                    style={[
                                        styles.provinceDot,
                                        { backgroundColor: color },
                                    ]}
                                />
                                <Text style={styles.provinceText}>{province}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}

function JaiCard({ jai, navigation }) {
    const provColor = PROVINCE_COLORS[jai.province] || COLORS.primary;
    const cardColor = PROVINCE_LIGHT_COLORS[jai.province] || COLORS.card;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                {
                    backgroundColor: cardColor,
                    borderLeftColor: provColor,
                },
                pressed && styles.cardPressed,
            ]}
            onPress={() => navigation.navigate('DetalleJai', { jai })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.nombre}>{jai.name}</Text>

                <View style={[styles.badge, { backgroundColor: provColor }]}>
                    <Text style={styles.badgeTxt}>{jai.province}</Text>
                </View>
            </View>

            <Text style={[styles.fecha, { color: provColor }]}>
                {formatBasqueDateRange(jai.startDate, jai.endDate)}
            </Text>

            <Text style={styles.lugar}>
                {jai.area} · {jai.city}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    hero: {
        backgroundColor: colorJaiApp,
        borderRadius: 24,
        padding: 22,
        marginBottom: 18,
    },
    heroTitulo: {
        color: 'white',
        fontSize: 34,
        fontWeight: 'bold',
    },
    heroSubtitulo: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16,
        marginTop: 6,
        lineHeight: 22,
    },
    quickGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 22,
    },
    quickCard: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 18,
        padding: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    quickTitle: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    quickText: {
        marginTop: 3,
        fontSize: 13,
        color: COLORS.muted,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 21,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    sectionLink: {
        color: colorJaiApp,
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyBox: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        gap: 8,
    },
    emptyText: {
        color: COLORS.muted,
        textAlign: 'center',
        fontSize: 14,
    },
    card: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderLeftWidth: 8,
    },
    cardPressed: {
        opacity: 0.75,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
    },
    nombre: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
    },
    badgeTxt: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    fecha: {
        marginTop: 8,
        fontSize: 15,
        fontWeight: '700',
    },
    lugar: {
        marginTop: 5,
        fontSize: 14,
        color: COLORS.text,
    },
    provinceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    provinceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 999,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderWidth: 1.5,
        gap: 8,
    },
    provinceDot: {
        width: 10,
        height: 10,
        borderRadius: 99,
    },
    provinceText: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
    },
});