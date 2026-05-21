// Re-exportamos los action creators y thunks desde los slices.
// Asi cualquier import existente del tipo
//   import { addFavorito, removeFavorito, loadFavoritos } from '../redux/ActionCreators'
// sigue funcionando exactamente igual.

export { addFavorito, removeFavorito, loadFavoritos } from './favoritos';
export { fetchJaiak } from './jaiak';
