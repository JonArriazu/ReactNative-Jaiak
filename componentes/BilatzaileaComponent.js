import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    Pressable,
    TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { jaiak } from '../comun/jaiakDatak';
import { formatBasqueDateRange } from '../comun/dateUtils';
import {
    COLORS,
    PROVINCE_COLORS,
    PROVINCE_LIGHT_COLORS,
    PROVINCES,
    colorJaiApp,
} from '../comun/comun';

export default function Bilatzailea({ navigation, route }) {
    const provinciaInicial = route.params?.province || 'Denak';

    const [texto, setTexto] = useState('');
    const [provincia, setProvincia] = useState(provinciaInicial);

    const jaiakFiltradas = useMemo(() => {
        return jaiak
            .filter((jai) => {
                const coincideTexto =
                    jai.name.toLowerCase().includes(texto.toLowerCase()) ||
                    jai.city.toLowerCase().includes(texto.toLowerCase()) ||
                    jai.area.toLowerCase().includes(texto.toLowerCase());

                const coincideProvincia =
                    provincia === 'Denak' || jai.province === provincia;

                return coincideTexto && coincideProvincia;
            })
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }, [texto, provincia]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Bilatzailea</Text>
                <Text style={styles.subtitulo}>
                    Bilatu jaiak izenaren, herriaren edo probintziaren arabera.
                </Text>
            </View>

            <View style={styles.searchBox}>
                <MaterialCommunityIcons
                    name="magnify"
                    size={22}
                    color={COLORS.muted}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Bilatu jai bat..."
                    value={texto}
                    onChangeText={setTexto}
                    placeholderTextColor={COLORS.muted}
                />

                {texto.length > 0 && (
                    <Pressable onPress={() => setTexto('')}>
                        <MaterialCommunityIcons
                            name="close-circle"
                            size={20}
                            color={COLORS.muted}
                        />
                    </Pressable>
                )}
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtros}
            >
                {['Denak', ...PROVINCES].map((item) => {
                    const activo = provincia === item;
                    const color =
                        item === 'Denak'
                            ? colorJaiApp
                            : PROVINCE_COLORS[item] || colorJaiApp;

                    return (
                        <Pressable
                            key={item}
                            style={[
                                styles.filtro,
                                activo && { backgroundColor: color },
                            ]}
                            onPress={() => setProvincia(item)}
                        >
                            <Text
                                style={[
                                    styles.filtroTexto,
                                    activo && styles.filtroTextoActivo,
                                ]}
                            >
                                {item}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            <Text style={styles.resultadoTitulo}>
                {jaiakFiltradas.length} jai aurkitu dira
            </Text>

            {jaiakFiltradas.map((jai) => {
                const provColor = PROVINCE_COLORS[jai.province] || COLORS.primary;
                const cardColor = PROVINCE_LIGHT_COLORS[jai.province] || COLORS.card;

                return (
                    <Pressable
                        key={jai.id}
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
            })}
        </ScrollView>
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
    header: {
        marginBottom: 14,
    },
    titulo: {
        fontSize: 30,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    subtitulo: {
        fontSize: 15,
        color: COLORS.muted,
        marginTop: 4,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    filtros: {
        marginTop: 14,
        marginBottom: 16,
    },
    filtro: {
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 999,
        backgroundColor: COLORS.card,
        marginRight: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filtroTexto: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
    },
    filtroTextoActivo: {
        color: 'white',
    },
    resultadoTitulo: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
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
});