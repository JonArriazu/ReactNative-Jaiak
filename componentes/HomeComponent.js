import React, { useState, useMemo } from 'react';
import {
    FlatList,
    Text,
    View,
    StyleSheet,
    Pressable,
    TextInput,
    Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
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

const TODAS = 'Denak';
const FILTROS = [TODAS, ...PROVINCES];

export default function Home({ navigation }) {
    const favoritosIds = useSelector(s => s.favoritos.favoritos);

    const [texto, setTexto] = useState('');
    const [provincia, setProvincia] = useState(TODAS);

    const resultados = useMemo(() => {
        const q = texto.trim().toLowerCase();

        return jaiak
            .filter(j => {
                const coincideProv = provincia === TODAS || j.province === provincia;

                const coincideTexto =
                    !q ||
                    j.name.toLowerCase().includes(q) ||
                    j.city.toLowerCase().includes(q) ||
                    j.area.toLowerCase().includes(q);

                return coincideProv && coincideTexto;
            })
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }, [texto, provincia]);

    return (
        <View style={styles.container}>
            <FlatList
                data={resultados}
                keyExtractor={item => item.id}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.title}>JaiApp</Text>
                        <Text style={styles.subtitle}>Euskal Herriko jaiak</Text>

                        <View style={styles.searchBox}>
                            <MaterialCommunityIcons
                                name="magnify"
                                size={20}
                                color={COLORS.muted}
                                style={styles.searchIcono}
                            />

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
                                    <MaterialCommunityIcons
                                        name="close-circle"
                                        size={18}
                                        color={COLORS.muted}
                                    />
                                </Pressable>
                            )}
                        </View>

                        <View style={styles.filtros}>
                            {FILTROS.map(p => {
                                const activo = provincia === p;
                                const color =
                                    p === TODAS
                                        ? colorJaiApp
                                        : PROVINCE_COLORS[p] || colorJaiApp;

                                return (
                                    <Pressable
                                        key={p}
                                        style={[
                                            styles.chip,
                                            activo && {
                                                backgroundColor: color,
                                                borderColor: color,
                                            },
                                        ]}
                                        onPress={() => setProvincia(p)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipTxt,
                                                activo && styles.chipTxtActivo,
                                            ]}
                                        >
                                            {p}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Text style={styles.contador}>{resultados.length} emaitza</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.vacio}>
                        <MaterialCommunityIcons
                            name="calendar-search"
                            size={52}
                            color="#ddd"
                        />
                        <Text style={styles.vacioTxt}>Ez da emaitzarik aurkitu</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const provColor = PROVINCE_COLORS[item.province] || COLORS.primary;
                    const cardColor = PROVINCE_LIGHT_COLORS[item.province] || COLORS.card;
                    const esFav = favoritosIds.includes(item.id);

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
                            onPress={() => navigation.navigate('DetalleJai', { jai: item })}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.name} numberOfLines={2}>
                                    {item.name}
                                </Text>

                                <View style={styles.cardHeaderRight}>
                                    {esFav && (
                                        <MaterialCommunityIcons
                                            name="heart"
                                            size={18}
                                            color={provColor}
                                            style={styles.heartIcon}
                                        />
                                    )}

                                    <View
                                        style={[
                                            styles.provinceBadge,
                                            { backgroundColor: provColor },
                                        ]}
                                    >
                                        <Text style={styles.provinceBadgeText}>
                                            {item.province || 'Besteak'}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <Text style={[styles.date, { color: provColor }]}>
                                {formatBasqueDateRange(item.startDate, item.endDate)}
                            </Text>

                            <Text style={styles.place}>
                                {item.area} · {item.city}
                            </Text>

                            {item.description ? (
                                <Text style={styles.description} numberOfLines={2}>
                                    {item.description}
                                </Text>
                            ) : null}
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
    },
    header: {
        paddingTop: 12,
        paddingBottom: 8,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 14,
        color: COLORS.muted,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 10 : 4,
        marginBottom: 12,
    },
    searchIcono: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    filtros: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: 'white',
    },
    chipTxt: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.muted,
    },
    chipTxtActivo: {
        color: 'white',
    },
    contador: {
        fontSize: 12,
        color: COLORS.muted,
        marginBottom: 8,
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
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    cardHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0,
    },
    heartIcon: {
        marginRight: 2,
    },
    name: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    date: {
        marginTop: 8,
        fontSize: 17,
        fontWeight: '700',
    },
    place: {
        marginTop: 6,
        fontSize: 15,
        color: COLORS.text,
    },
    description: {
        marginTop: 8,
        fontSize: 14,
        color: COLORS.muted,
    },
    provinceBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        alignSelf: 'flex-start',
    },
    provinceBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    vacio: {
        alignItems: 'center',
        marginTop: 60,
        gap: 12,
    },
    vacioTxt: {
        fontSize: 16,
        color: '#bbb',
    },
});