import * as ActionTypes from './ActionTypes';

export const favoritos = (state = { favoritos: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVORITO:
            if (state.favoritos.some(el => el === action.payload)) return state;
            return { ...state, favoritos: state.favoritos.concat(action.payload) };
        case ActionTypes.REMOVE_FAVORITO:
            return { ...state, favoritos: state.favoritos.filter(el => el !== action.payload) };
        default:
            return state;
    }
};
