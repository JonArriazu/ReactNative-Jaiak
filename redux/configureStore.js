import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { favoritos } from './favoritos';

const guardarEstado = async (state) => {
  try {
    const favoritosGuardados = state.favoritos.favoritos;
    await AsyncStorage.setItem(
      'favoritos',
      JSON.stringify(favoritosGuardados)
    );
  } catch (error) {
    console.log('Error guardando favoritos:', error);
  }
};

export const ConfigureStore = () => {
  const store = configureStore({
    reducer: {
      favoritos: favoritos,
    },
  });

  store.subscribe(() => {
    guardarEstado(store.getState());
  });

  return store;
};