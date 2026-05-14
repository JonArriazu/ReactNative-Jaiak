import * as ActionTypes from './ActionTypes';

export const jaiak = (state = { isLoading: true, errMess: null, jaiak: [] }, action) => {
    switch (action.type) {
        case ActionTypes.JAIAK_LOADING:
            return { ...state, isLoading: true, errMess: null };
        case ActionTypes.ADD_JAIAK:
            return { ...state, isLoading: false, errMess: null, jaiak: action.payload };
        case ActionTypes.JAIAK_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };
        default:
            return state;
    }
};
