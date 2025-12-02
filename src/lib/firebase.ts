// Firebase configuration and initialization
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { initializeFirestore, memoryLocalCache } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyC8bdlY37Gp-gvZQuJwa6W_nBS_9W98IcE",
  authDomain: "myservice-28f7e.firebaseapp.com",
  projectId: "myservice-28f7e",
  storageBucket: "myservice-28f7e.appspot.com",
  messagingSenderId: "447491660194",
  appId: "1:447491660194:web:b6803bf0af6c836e06fafb",
  measurementId: "G-SR0W86L5QC",
}

// Initialize Firebase (evita reinicializar se já existe)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

/**
 * Firestore com memoryLocalCache para evitar problemas de SSR
 * e bugs de IndexedDB em diferentes navegadores
 */
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
})

export const auth = getAuth(app)
export const storage = getStorage(app)

export default app
