// Inicializacion de Firebase para JaiApp.
// El apiKey de cliente web NO es secreto: la proteccion real son las reglas
// de Firestore (configuradas en consola: lectura publica, escritura cerrada).
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCKak4mXGWmUmcFwhlZ_yjKZ-6-8B2FZEw',
  authDomain: 'jaiapp-bca9e.firebaseapp.com',
  projectId: 'jaiapp-bca9e',
  storageBucket: 'jaiapp-bca9e.firebasestorage.app',
  messagingSenderId: '928239688554',
  appId: '1:928239688554:web:cef243e40a3a2e69d4e313',
};

// getApps() evita el error "Firebase App named '[DEFAULT]' already exists"
// si el bundler vuelve a evaluar este modulo (hot reload de Metro).
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
