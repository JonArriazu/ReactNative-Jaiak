import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { jaiak } from '../comun/jaiakDatak';
import { formatBasqueDateRange } from '../comun/dateUtils';
import { COLORS, PROVINCE_COLORS, PROVINCE_LIGHT_COLORS } from '../comun/comun';

export default function Gogokoak({ navigation }) {
    const favoritosIds = useSelector(s => s.favoritos.favoritos);

    const gogokoak = jaiak
        .filter(j => favoritosIds.includes(j.id))
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    if (gogokoak.length === 0) {
        return (
            <View style={styles.vacio}>
                <MaterialCommunityIcons name="heart-outline" size={64} color="#ddd" />
                <Text style={styles.vacioTitulo}>Oraindik ez dago gogokoanik</Text>
                <Text style={styles.vacioSub}>
                    Sakatu bihotza edozein jairen fitxan gehitzeko.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            style={styles.container}
            data={gogokoak}
            keyExtractor={item => item.id}
            ListHeaderComponent={
                <View style={styles.header}>
                    <Text style={styles.title}>Gogokoak</Text>
                    <Text style={styles.subtitle}>{gogokoak.length} jai hautatuta</Text>
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
                        onPress={() => navigation.navigate('DetalleJai', { jai: item })}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <MaterialCommunityIcons name="heart" size={16} color={provColor} />
                                <View style={[styles.badge, { backgroundColor: provColor }]}>
                                    <Text style={styles.badgeTxt}>{item.province}</Text>
                                </View>
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
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 16 },

    header: { paddingTop: 12, paddingBottom: 8 },
    title:    { fontSize: 34, fontWeight: 'bold', color: COLORS.primary },
    subtitle: { fontSize: 16, marginBottom: 8, color: COLORS.muted },

    card: {
        padding: 16, marginBottom: 12,
        borderRadius: 16, borderWidth: 1,
        borderColor: COLORS.border, borderLeftWidth: 8,
    },
    cardPressed: { opacity: 0.75 },
    cardHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
    name:  { flex: 1, fontSize: 18, fontWeight: 'bold', color: COLORS.text },
    date:  { marginTop: 8, fontSize: 17, fontWeight: '700' },
    place: { marginTop: 6, fontSize: 15, color: COLORS.text },
    badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
    badgeTxt: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

    vacio: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        padding: 40, backgroundColor: COLORS.background, gap: 12,
    },
    vacioTitulo: { fontSize: 18, fontWeight: '600', color: '#aaa', textAlign: 'center' },
    vacioSub:    { fontSize: 14, color: '#bbb', textAlign: 'center', lineHeight: 20 },
});
