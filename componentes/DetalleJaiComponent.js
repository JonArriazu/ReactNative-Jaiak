import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    Share,
    Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addFavorito, removeFavorito } from '../redux/ActionCreators';
import { formatBasqueDateRange } from '../comun/dateUtils';
import { COLORS, PROVINCE_COLORS, PROVINCE_LIGHT_COLORS } from '../comun/comun';
import { addJaiToCalendar } from '../comun/calendarService';

export default function DetalleJai({ route }) {
    const { jai } = route.params;
    const dispatch = useDispatch();
    const favoritosIds = useSelector(s => s.favoritos.favoritos);
    const esFavorito = favoritosIds.includes(jai.id);

    const provColor = PROVINCE_COLORS[jai.province] || COLORS.primary;
    const provLight = PROVINCE_LIGHT_COLORS[jai.province] || COLORS.card;

    function toggleFavorito() {
        if (esFavorito) {
            dispatch(removeFavorito(jai.id));
        } else {
            dispatch(addFavorito(jai.id));
        }
    }

    async function compartir() {
        try {
            await Share.share({
                message: `${jai.name}\n📅 ${formatBasqueDateRange(jai.startDate, jai.endDate)}\n📍 ${jai.area} · ${jai.city}`,
            });
        } catch {
            // Ez dugu ezer egingo errorea badago
        }
    }

    async function gehituEgutegira() {
        try {
            await addJaiToCalendar(jai);
            Alert.alert('Egutegia', 'Jaia zure egutegian gehitu da.');
        } catch (error) {
            Alert.alert('Errorea', error.message);
        }
    }

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* Probintziaren koloreko goiburua */}
            <View style={[styles.cabecera, { backgroundColor: provLight, borderBottomColor: provColor }]}>
                <View style={[styles.badge, { backgroundColor: provColor }]}>
                    <Text style={styles.badgeTxt}>{jai.province}</Text>
                </View>
                <Text style={styles.nombre}>{jai.name}</Text>
            </View>

            {/* Datu nagusiak */}
            <View style={styles.seccion}>
                <FilaInfo
                    icono="calendar-range"
                    color={provColor}
                    texto={formatBasqueDateRange(jai.startDate, jai.endDate)}
                    grande
                />
                <FilaInfo
                    icono="map-marker"
                    color={provColor}
                    texto={`${jai.area} · ${jai.city}`}
                />
            </View>

            {/* Deskribapena */}
            {!!jai.description && (
                <View style={styles.seccion}>
                    <Text style={styles.seccionTitulo}>Deskribapena</Text>
                    <Text style={styles.descripcion}>{jai.description}</Text>
                </View>
            )}

            {/* Ekintza botoiak */}
            <View style={styles.botones}>
                <Pressable
                    style={({ pressed }) => [
                        styles.botonFav,
                        esFavorito && { backgroundColor: provColor },
                        pressed && styles.botonPress,
                    ]}
                    onPress={toggleFavorito}
                >
                    <MaterialCommunityIcons
                        name={esFavorito ? 'heart' : 'heart-outline'}
                        size={24}
                        color={esFavorito ? 'white' : provColor}
                    />
                    <Text style={[styles.botonFavTxt, esFavorito && { color: 'white' }]}>
                        {esFavorito ? 'Gogokoa ✓' : 'Gogokoa gehitu'}
                    </Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [styles.botonCompartir, pressed && styles.botonPress]}
                    onPress={compartir}
                >
                    <MaterialCommunityIcons name="share-variant" size={22} color={COLORS.muted} />
                </Pressable>
            </View>

            {/* Egutegira gehitzeko botoia */}
            <Pressable
                style={({ pressed }) => [
                    styles.botonEgutegia,
                    { backgroundColor: provColor },
                    pressed && styles.botonPress,
                ]}
                onPress={gehituEgutegira}
            >
                <MaterialCommunityIcons name="calendar-plus" size={22} color="white" />
                <Text style={styles.botonEgutegiaTxt}>Gehitu nire egutegira</Text>
            </Pressable>
        </ScrollView>
    );
}

function FilaInfo({ icono, color, texto, grande }) {
    return (
        <View style={styles.fila}>
            <MaterialCommunityIcons
                name={icono}
                size={grande ? 22 : 18}
                color={color}
                style={styles.filaIcono}
            />
            <Text style={[styles.filaTxt, grande && styles.filaTxtGrande]}>{texto}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: COLORS.background },
    content: { paddingBottom: 40 },

    cabecera: {
        padding: 20,
        paddingTop: 24,
        borderBottomWidth: 3,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        marginBottom: 12,
    },
    badgeTxt: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,
    },
    nombre: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        lineHeight: 30,
    },

    seccion: {
        marginHorizontal: 16,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    seccionTitulo: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.muted,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    descripcion: {
        fontSize: 15,
        color: COLORS.text,
        lineHeight: 22,
    },

    fila: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },
    filaIcono: {
        marginRight: 10,
    },
    filaTxt: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text,
    },
    filaTxtGrande: {
        fontSize: 17,
        fontWeight: '700',
    },

    botones: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 24,
        gap: 12,
    },
    botonFav: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    botonFavTxt: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.primary,
    },
    botonCompartir: {
        width: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: 'white',
    },
    botonEgutegia: {
        marginHorizontal: 16,
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
    },
    botonEgutegiaTxt: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
    },
    botonPress: {
        opacity: 0.75,
    },
});