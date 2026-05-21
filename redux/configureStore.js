import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { favoritos } from './favoritos';
import { jaiak } from './jaiak';

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
      jaiak: jaiak,
    },
  });

  // Persistencia local de los favoritos.
  // (En el commit de Firebase, si se mueven los favoritos a la nube,
  //  este subscribe se puede sustituir o complementar con un set en Firestore.)
  store.subscribe(() => {
    guardarEstado(store.getState());
  });

  return store;
};
