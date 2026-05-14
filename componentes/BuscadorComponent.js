import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Buscador() {
    return (
        <View style={styles.container}>
            <Text style={styles.texto}>Buscador</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    texto: { fontSize: 24, color: '#888' },
});

export default Buscador;
