// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC8bdlY37Gp-gvZQuJwa6W_nBS_9W98IcE",
  authDomain: "myservice-28f7e.firebaseapp.com",
  projectId: "myservice-28f7e",
  storageBucket: "myservice-28f7e.appspot.com",
  messagingSenderId: "447491660194",
  appId: "1:447491660194:web:b6803bf0af6c836e06fafb",
  measurementId: "G-SR0W86L5QC"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * 🔥 FIRESTORE ESTÁVEL (SEM CACHE BUGADO)
 * Usamos memoryLocalCache() — funciona em qualquer navegador,
 * não cria IndexedDB, não quebra SSR, não dá erro de "client offline".
 */
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});

export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
