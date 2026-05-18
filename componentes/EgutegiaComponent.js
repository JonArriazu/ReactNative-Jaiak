import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import { jaiak } from '../comun/jaiakDatak';
import { formatBasqueDateRange } from '../comun/dateUtils';
import {
    COLORS,
    PROVINCE_COLORS,
    PROVINCE_LIGHT_COLORS,
    colorJaiApp,
} from '../comun/comun';

export default function Egutegia({ navigation }) {
    const [selectedDate, setSelectedDate] = useState(null);

    const favoritosIds = useSelector(s => s.favoritos.favoritos);

    const jaiakFavoritas = useMemo(() => {
        return jaiak.filter(jai => favoritosIds.includes(jai.id));
    }, [favoritosIds]);

    const jaiakPorFecha = useMemo(() => {
        const mapa = {};

        jaiakFavoritas.forEach((jai) => {
            const fechaInicio = new Date(jai.startDate);
            const fechaFin = new Date(jai.endDate || jai.startDate);

            const fechaActual = new Date(fechaInicio);

            while (fechaActual <= fechaFin) {
                const fechaTexto = fechaActual.toISOString().split('T')[0];

                if (!mapa[fechaTexto]) {
                    mapa[fechaTexto] = [];
                }

                mapa[fechaTexto].push(jai);

                fechaActual.setDate(fechaActual.getDate() + 1);
            }
        });

        return mapa;
    }, [jaiakFavoritas]);

    const markedDates = useMemo(() => {
        const marcas = {};

        Object.keys(jaiakPorFecha).forEach((fecha) => {
            marcas[fecha] = {
                selected: true,
                selectedColor: colorJaiApp,
                selectedTextColor: 'white',
            };
        });

        if (selectedDate) {
            marcas[selectedDate] = {
                selected: true,
                selectedColor: '#4B0082',
                selectedTextColor: 'white',
            };
        }

        return marcas;
    }, [jaiakPorFecha, selectedDate]);

    const jaiakDelDia = selectedDate ? jaiakPorFecha[selectedDate] || [] : [];

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.titulo}>Egutegia</Text>
                <Text style={styles.subtitulo}>
                    Zure gogoko jaiak egutegian ikus ditzakezu
                </Text>
            </View>

            <View style={styles.calendarContainer}>
                <Calendar
                    firstDay={1}
                    markedDates={markedDates}
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    theme={{
                        todayTextColor: colorJaiApp,
                        arrowColor: colorJaiApp,
                        monthTextColor: COLORS.text,
                        textMonthFontWeight: 'bold',
                        textDayFontWeight: '500',
                        selectedDayBackgroundColor: colorJaiApp,
                    }}
                />
            </View>

            <View style={styles.resultados}>
                {jaiakFavoritas.length === 0 ? (
                    <View style={styles.vacio}>
                        <MaterialCommunityIcons
                            name="heart-outline"
                            size={48}
                            color="#ccc"
                        />
                        <Text style={styles.vacioTxt}>
                            Oraindik ez duzu jairik gorde gogokoetan.
                        </Text>
                    </View>
                ) : !selectedDate ? (
                    <View style={styles.vacio}>
                        <MaterialCommunityIcons
                            name="calendar-search"
                            size={48}
                            color="#ccc"
                        />
                        <Text style={styles.vacioTxt}>
                            Sakatu morez markatutako egun bat.
                        </Text>
                    </View>
                ) : jaiakDelDia.length === 0 ? (
                    <View style={styles.vacio}>
                        <MaterialCommunityIcons
                            name="calendar-remove"
                            size={48}
                            color="#ccc"
                        />
                        <Text style={styles.vacioTxt}>
                            Egun honetan ez duzu gogoko jairik.
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.fechaSeleccionada}>
                            {selectedDate}
                        </Text>

                        {jaiakDelDia.map((jai) => {
                            const provColor =
                                PROVINCE_COLORS[jai.province] || COLORS.primary;
                            const cardColor =
                                PROVINCE_LIGHT_COLORS[jai.province] || COLORS.card;

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
                                    onPress={() =>
                                        navigation.navigate('DetalleJai', { jai })
                                    }
                                >
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.nombre} numberOfLines={2}>
                                            {jai.name}
                                        </Text>

                                        <View
                                            style={[
                                                styles.badge,
                                                { backgroundColor: provColor },
                                            ]}
                                        >
                                            <Text style={styles.badgeTxt}>
                                                {jai.province}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={[styles.fecha, { color: provColor }]}>
                                        {formatBasqueDateRange(
                                            jai.startDate,
                                            jai.endDate
                                        )}
                                    </Text>

                                    <Text style={styles.lugar}>
                                        {jai.area} · {jai.city}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </>
                )}
            </View>
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
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    resultados: {
        marginTop: 20,
    },
    fechaSeleccionada: {
        fontSize: 18,
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
    vacio: {
        alignItems: 'center',
        marginTop: 35,
        gap: 10,
    },
    vacioTxt: {
        fontSize: 15,
        color: COLORS.muted,
        textAlign: 'center',
    },
});