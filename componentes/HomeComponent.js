import React from 'react';
import { SafeAreaView, FlatList, Text, View, StyleSheet } from 'react-native';
import { jaiak } from '../comun/jaiakDatak';
import { formatBasqueDateRange } from '../comun/dateUtils';
import { COLORS, PROVINCE_COLORS, PROVINCE_LIGHT_COLORS } from '../comun/comun';

function Home() {
    const sortedJaiak = [...jaiak].sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    return (
        <FlatList
            style={styles.container}
            data={sortedJaiak}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
                <View style={styles.header}>
                    <Text style={styles.title}>JaiApp</Text>
                    <Text style={styles.subtitle}>Euskal Herriko jaiak</Text>
                </View>
            }
            renderItem={({ item }) => {
                const provinceColor = PROVINCE_COLORS[item.province] || COLORS.primary;
                const cardColor = PROVINCE_LIGHT_COLORS[item.province] || COLORS.card;

                return (
                    <View style={[styles.card, { backgroundColor: cardColor, borderLeftColor: provinceColor }]}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.name}>{item.name}</Text>
                            <View style={[styles.provinceBadge, { backgroundColor: provinceColor }]}>
                                <Text style={styles.provinceBadgeText}>
                                    {item.province || 'Besteak'}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.date, { color: provinceColor }]}>
                            {formatBasqueDateRange(item.startDate, item.endDate)}
                        </Text>
                        <Text style={styles.place}>{item.area} · {item.city}</Text>
                        {item.description ? (
                            <Text style={styles.description}>{item.description}</Text>
                        ) : null}
                    </View>
                );
            }}
        />
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
        marginBottom: 8,
        color: COLORS.muted,
    },
    card: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderLeftWidth: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
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
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default Home;
