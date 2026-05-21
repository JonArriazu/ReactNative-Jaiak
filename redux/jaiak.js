import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fuente de datos actual: archivo local.
// En el siguiente commit (Firebase) este import se sustituye por una llamada
// a Firestore desde firebase/jaiakService.js — el resto del codigo no cambia.
import { jaiak as jaiakLocales } from '../comun/jaiakDatak';

export const fetchJaiak = createAsyncThunk(
  'jaiak/fetchJaiak',
  async (_, { rejectWithValue }) => {
    try {
      // Simulamos una llamada asincrona para mantener la forma final
      // (cuando entre Firebase aqui ira un getDocs(collection(db, 'jaiak'))).
      const datos = await Promise.resolve(jaiakLocales);
      return datos;
    } catch (error) {
      return rejectWithValue(error?.message || 'Error cargando jaiak');
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
