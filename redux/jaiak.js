import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { fetchJaiakFromFirestore } from '../firebase/jaiakService';
// Fallback local: si Firestore aun no esta sembrado o falla la red,
// la app sigue mostrando datos para no quedarse vacia.
import { jaiak as jaiakLocales } from '../comun/jaiakDatak';

export const fetchJaiak = createAsyncThunk(
  'jaiak/fetchJaiak',
  async (_, { rejectWithValue }) => {
    try {
      const datos = await fetchJaiakFromFirestore();
      if (Array.isArray(datos) && datos.length > 0) {
        return datos;
      }
      // Coleccion vacia: usar los datos locales como red de seguridad.
      console.warn('Firestore vacio, usando datos locales como fallback.');
      return jaiakLocales;
    } catch (error) {
      console.warn('Error cargando jaiak de Firestore:', error?.message);
      // Si Firestore falla del todo, no romper la app: caer al local.
      return jaiakLocales;
    }
  }
);

const jaiakSlice = createSlice({
  name: 'jaiak',
  initialState: {
    isLoading: false,
    errMess: null,
    jaiak: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJaiak.pending, (state) => {
        state.isLoading = true;
        state.errMess = null;
      })
      .addCase(fetchJaiak.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errMess = null;
        state.jaiak = action.payload;
      })
      .addCase(fetchJaiak.rejected, (state, action) => {
        state.isLoading = false;
        state.errMess = action.payload || 'Error desconocido';
      });
  },
});

export const jaiak = jaiakSlice.reducer;
export default jaiakSlice.reducer;
