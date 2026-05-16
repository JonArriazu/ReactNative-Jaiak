import { Component } from 'react';
import { Platform, View, StyleSheet, Text, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Home from './HomeComponent';
import Buscador from './BuscadorComponent';
import Mapa from './MapaComponent';
import Egutegia from './EgutegiaComponent';
import Gogokoak from './GogokoenComponent';
import { colorJaiApp, colorJaiAppClaro } from '../comun/comun';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function BotonMenu(props) {
    return (
        <Pressable
            onPress={props.onPress}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            style={({ pressed }) => ({
                padding: 8,
                marginLeft: 4,
                opacity: pressed ? 0.6 : 1,
            })}
        >
            <MaterialCommunityIcons
                name="menu"
                size={32}
                color="white"
            />
        </Pressable>
    );
}

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
                <View style={styles.drawerHeader}>
                    <View style={styles.drawerHeaderTextContainer}>
                        <Text style={styles.drawerHeaderText}>JaiApp</Text>
                        <Text style={styles.drawerHeaderSubtext}>Euskal Herriko Jaiak</Text>
                    </View>
                </View>
                <DrawerItemList {...props} />
            </SafeAreaView>
        </DrawerContentScrollView>
    );
}

class Campobase extends Component {
    menuHeaderOptions = (title, navigation) => ({
        title,
        headerLeft: () => (
            <BotonMenu
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            />
        ),
    });

    HasieraNavegador = () => (
        <Stack.Navigator
            initialRouteName="HasieraScreen"
            screenOptions={{
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: colorJaiApp },
                headerTitleStyle: { color: '#fff' },
            }}
        >
            <Stack.Screen
                name="HasieraScreen"
                component={Home}
                options={({ navigation }) => this.menuHeaderOptions('JaiApp', navigation)}
            />
        </Stack.Navigator>
    );

    BuscadorNavegador = () => (
        <Stack.Navigator
            initialRouteName="BuscadorScreen"
            screenOptions={{
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: colorJaiApp },
                headerTitleStyle: { color: '#fff' },
            }}
        >
            <Stack.Screen
                name="BuscadorScreen"
                component={Buscador}
                options={({ navigation }) => this.menuHeaderOptions('Bilatzailea', navigation)}
            />
        </Stack.Navigator>
    );

    MapaNavegador = () => (
        <Stack.Navigator
            initialRouteName="MapaScreen"
            screenOptions={{
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: colorJaiApp },
                headerTitleStyle: { color: '#fff' },
            }}
        >
            <Stack.Screen
                name="MapaScreen"
                component={Mapa}
                options={({ navigation }) => this.menuHeaderOptions('Mapa', navigation)}
            />
        </Stack.Navigator>
    );

    EgutegiaNavegador = () => (
        <Stack.Navigator
            initialRouteName="EgutegiaScreen"
            screenOptions={{
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: colorJaiApp },
                headerTitleStyle: { color: '#fff' },
            }}
        >
            <Stack.Screen
                name="EgutegiaScreen"
                component={Egutegia}
                options={({ navigation }) => this.menuHeaderOptions('Egutegia', navigation)}
            />
        </Stack.Navigator>
    );

    GogokoenNavegador = () => (
        <Stack.Navigator
            initialRouteName="GogokoenScreen"
            screenOptions={{
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: colorJaiApp },
                headerTitleStyle: { color: '#fff' },
            }}
        >
            <Stack.Screen
                name="GogokoenScreen"
                component={Gogokoak}
                options={({ navigation }) => this.menuHeaderOptions('Gogokoak', navigation)}
            />
        </Stack.Navigator>
    );

    DrawerNavegador = () => (
        <Drawer.Navigator
            initialRouteName="Hasiera"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: { backgroundColor: colorJaiAppClaro },
            }}
        >
            <Drawer.Screen
                name="Hasiera"
                component={this.HasieraNavegador}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Bilatzailea"
                component={this.BuscadorNavegador}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="magnify" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Mapa"
                component={this.MapaNavegador}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="map-marker" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Egutegia"
                component={this.EgutegiaNavegador}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="calendar" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Gogokoak"
                component={this.GogokoenNavegador}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="heart" color={color} size={size} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );

    render() {
        return (
            <NavigationContainer>
                <View
                    style={{
                        flex: 1,
                        paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
                    }}
                >
                    <this.DrawerNavegador />
                </View>
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    drawerHeader: {
        backgroundColor: colorJaiApp,
        height: 100,
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    drawerHeaderTextContainer: { justifyContent: 'center' },
    drawerHeaderText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    drawerHeaderSubtext: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 2,
    },
});

export default Campobase;
