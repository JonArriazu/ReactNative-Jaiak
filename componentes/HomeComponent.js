import React from 'react';
import { FlatList, Text, View, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { jaiak } from '../comun/jaiakDatak';
import { formatBasqueDateRange } from '../comun/dateUtils';
import { COLORS, PROVINCE_COLORS, PROVINCE_LIGHT_COLORS } from '../comun/comun';

export default function Home({ navigation }) {
    const favoritosIds = useSelector(s => s.favoritos.favoritos);

    const sortedJaiak = [...jaiak].sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    return (
        <FlatList
            style={styles.container}
            data={sortedJaiak}
            keyExtractor={item => item.id}
            ListHeaderComponent={
                <View style={styles.header}>
                    <Text style={styles.title}>JaiApp</Text>
                    <Text style={styles.subtitle}>Euskal Herriko jaiak</Text>
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
                            { backgroundColor: cardColor, borderLeftColor: provColor },
                            pressed && styles.cardPressed,
                        ]}
                        onPress={() => navigation.navigate('DetalleJai', { jai: item })}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                            <View style={styles.cardHeaderRight}>
                                {esFav && (
                                    <MaterialCommunityIcons
                                        name="heart"
                                        size={16}
                                        color={provColor}
                                        style={styles.heartIcon}
                                    />
                                )}
                                <View style={[styles.provinceBadge, { backgroundColor: provColor }]}>
                                    <Text style={styles.provinceBadgeText}>
                                        {item.province || 'Besteak'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Text style={[styles.date, { color: provColor }]}>
                            {formatBasqueDateRange(item.startDate, item.endDate)}
                        </Text>
                        <Text style={styles.place}>{item.area} · {item.city}</Text>
                        {item.description ? (
                            <Text style={styles.description} numberOfLines={2}>
                                {item.description}
                            </Text>
                        ) : null}
                    </Pressable>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 16 },

    header: { paddingTop: 12, paddingBottom: 8 },
    title:  { fontSize: 34, fontWeight: 'bold', color: COLORS.primary },
    subtitle: { fontSize: 16, marginBottom: 8, color: COLORS.muted },

    card: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderLeftWidth: 8,
    },
    cardPressed: { opacity: 0.75 },

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
    heartIcon: { marginRight: 2 },

    name: { flex: 1, fontSize: 18, fontWeight: 'bold', color: COLORS.text },
    date: { marginTop: 8, fontSize: 17, fontWeight: '700' },
    place: { marginTop: 6, fontSize: 15, color: COLORS.text },
    description: { marginTop: 8, fontSize: 14, color: COLORS.muted },

    provinceBadge: {
        paddingHorizontal: 10, paddingVertical: 5,
        borderRadius: 999, alignSelf: 'flex-start',
    },
    provinceBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
});
