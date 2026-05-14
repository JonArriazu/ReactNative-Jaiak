import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colorJaiApp } from '../comun/comun';

function Home() {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>JaiApp</Text>
            <Text style={styles.descripcion}>
                Euskal Herriko jaiak eskura.{'\n'}
                Bilatu, gorde eta ez galdu zure inguruko jairik.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 32,
    },
    titulo: {
        fontSize: 52,
        fontWeight: 'bold',
        color: colorJaiApp,
        marginBottom: 20,
        letterSpacing: 2,
    },
    descripcion: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        lineHeight: 26,
    },
});

export default Home;
