import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import Campobase from './componentes/base_Draw_Nav';

const store = ConfigureStore();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PaperProvider>
          <View style={{ flex: 1 }}>
            <Campobase />
            <StatusBar style="auto" />
          </View>
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
