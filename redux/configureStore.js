import { configureStore } from '@reduxjs/toolkit';
import { jaiak } from './jaiak';
import { favoritos } from './favoritos';

export const ConfigureStore = () => {
    const store = configureStore({
        reducer: {
            jaiak: jaiak,
            favoritos: favoritos,
        },
    });
    return store;
};
