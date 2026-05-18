import { Component } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Home from './HomeComponent';
import DetalleJai from './DetalleJaiComponent';
import Mapa from './MapaComponent';
import Egutegia from './EgutegiaComponent';
import Gogokoak from './GogokoenComponent';

import { colorJaiApp, colorJaiAppClaro } from '../comun/comun';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function BotonMenu(props) {
    return (
        <Pressable
            style={({ pressed }) => ({
                padding: 8,
                marginLeft: 4,
                opacity: pressed ? 0.6 : 1,
            })}
            onPress={props.onPress}
        >
            <MaterialCommunityIcons name="menu" size={28} color="white" />
        </Pressable>
    );
}

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.drawerHeader}>
                <View style={styles.drawerHeaderTextContainer}>
                    <Text style={styles.drawerHeaderText}>JaiApp</Text>
                    <Text style={styles.drawerHeaderSubtext}>Euskal Herriko Jaiak</Text>
                </View>
            </View>

            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

class Campobase extends Component {
    menuHeaderOptions = (title, navigation) => ({
        title,
        headerStyle: {
            backgroundColor: colorJaiApp,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
            color: 'white',
            fontWeight: 'bold',
        },
        headerLeft: () => (
            <BotonMenu
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            />
        ),
    });

    detalleOptions = ({ route }) => ({
        title: route.params?.jai?.city || 'Xehetasunak',
        headerBackTitle: 'Atzera',
        headerStyle: {
            backgroundColor: colorJaiApp,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
            color: 'white',
            fontWeight: 'bold',
        },
    });

    HasieraNavegador = () => (
        <Stack.Navigator>
            <Stack.Screen
                name="HasieraPantaila"
                component={Home}
                options={({ navigation }) =>
                    this.menuHeaderOptions('Hasiera', navigation)
                }
            />
            <Stack.Screen
                name="DetalleJai"
                component={DetalleJai}
                options={this.detalleOptions}
            />
        </Stack.Navigator>
    );

    MapaNavegador = () => (
        <Stack.Navigator>
            <Stack.Screen
                name="MapaPantaila"
                component={Mapa}
                options={({ navigation }) =>
                    this.menuHeaderOptions('Mapa', navigation)
                }
            />
        </Stack.Navigator>
    );

    EgutegiaNavegador = () => (
        <Stack.Navigator>
            <Stack.Screen
                name="EgutegiaPantaila"
                component={Egutegia}
                options={({ navigation }) =>
                    this.menuHeaderOptions('Egutegia', navigation)
                }
            />
            <Stack.Screen
                name="DetalleJai"
                component={DetalleJai}
                options={this.detalleOptions}
            />
        </Stack.Navigator>
    );

    GogokoenNavegador = () => (
        <Stack.Navigator>
            <Stack.Screen
                name="GogokoakPantaila"
                component={Gogokoak}
                options={({ navigation }) =>
                    this.menuHeaderOptions('Gogokoak', navigation)
                }
            />
            <Stack.Screen
                name="DetalleJai"
                component={DetalleJai}
                options={this.detalleOptions}
            />
        </Stack.Navigator>
    );

    DrawerNavegador = () => (
        <Drawer.Navigator
            initialRouteName="Hasiera"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: colorJaiAppClaro,
                },
                drawerActiveTintColor: colorJaiApp,
            }}
        >
            <Drawer.Screen
                name="Hasiera"
                component={this.HasieraNavegador}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Mapa"
                component={this.MapaNavegador}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="map-marker-radius"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name="Egutegia"
                component={this.EgutegiaNavegador}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="calendar-month"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name="Gogokoak"
                component={this.GogokoenNavegador}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="heart" size={size} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );

    render() {
        return (
            <View
                style={[
                    styles.container,
                    { paddingTop: Constants.statusBarHeight },
                ]}
            >
                <NavigationContainer>
                    <this.DrawerNavegador />
                </NavigationContainer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    drawerHeader: {
        backgroundColor: colorJaiApp,
        height: 100,
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    drawerHeaderTextContainer: {
        justifyContent: 'center',
    },
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