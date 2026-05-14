import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Gogokoak() {
    return (
        <View style={styles.container}>
            <Text style={styles.texto}>Gogokoak</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    texto: { fontSize: 24, color: '#888' },
});

export default Gogokoak;
