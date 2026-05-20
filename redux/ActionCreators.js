import * as ActionTypes from './ActionTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const addFavorito = (jaiId) => ({
    type: ActionTypes.ADD_FAVORITO,
    payload: jaiId,
});

export const removeFavorito = (jaiId) => ({
    type: ActionTypes.REMOVE_FAVORITO,
    payload: jaiId,
});

export const loadFavoritos = () => async (dispatch) => {
  try {
    const favoritosGuardados = await AsyncStorage.getItem('favoritos');

    if (favoritosGuardados !== null) {
      dispatch({
        type: ActionTypes.LOAD_FAVORITOS,
        payload: JSON.parse(favoritosGuardados),
      });
    }
  } catch (error) {
    console.log('Error cargando favoritos:', error);
  }
};