import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Lee la coleccion 'jaiak' de Firestore y devuelve un array con la misma
// forma que el array local de comun/jaiakDatak.js (cada doc tiene id + campos).
export async function fetchJaiakFromFirestore() {
  const snap = await getDocs(collection(db, 'jaiak'));
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
