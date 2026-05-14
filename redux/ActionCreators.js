import * as ActionTypes from './ActionTypes';

export const addFavorito = (jaiId) => ({
    type: ActionTypes.ADD_FAVORITO,
    payload: jaiId,
});

export const removeFavorito = (jaiId) => ({
    type: ActionTypes.REMOVE_FAVORITO,
    payload: jaiId,
});
