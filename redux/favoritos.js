import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Thunk: lee los favoritos persistidos en AsyncStorage al arrancar la app.
// En el commit de Firebase este thunk pasara a leer la coleccion del usuario
// en Firestore (o se mantiene AsyncStorage como cache local; ver instrucciones).
export const loadFavoritos = createAsyncThunk(
  'favoritos/loadFavoritos',
  async () => {
    try {
      const guardados = await AsyncStorage.getItem('favoritos');
      return guardados ? JSON.parse(guardados) : [];
    } catch (error) {
      console.log('Error cargando favoritos:', error);
      return [];
    }
  }
);

const favoritosSlice = createSlice({
  name: 'favoritos',
  initialState: { favoritos: [] },
  reducers: {
    addFavorito: (state, action) => {
      if (!state.favoritos.includes(action.payload)) {
        state.favoritos.push(action.payload);
      }
    },
    removeFavorito: (state, action) => {
      state.favoritos = state.favoritos.filter(
        (fav) => fav !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFavoritos.fulfilled, (state, action) => {
      state.favoritos = action.payload;
    });
  },
});

export const { addFavorito, removeFavorito } = favoritosSlice.actions;
export const favoritos = favoritosSlice.reducer;
export default favoritosSlice.reducer;
