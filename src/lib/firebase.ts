// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { serverTimestamp } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyC8bdlY37Gp-gvZQuJwa6W_nBS_9W98IcE",
  authDomain: "myservice-28f7e.firebaseapp.com",
  projectId: "myservice-28f7e",
  storageBucket: "myservice-28f7e.appspot.com",
  messagingSenderId: "447491660194",
  appId: "1:447491660194:web:b6803bf0af6c836e06fafb",
  measurementId: "G-SR0W86L5QC"
};



// garante que só inicializa 1 vez (Next reinicia módulos toda hora)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// analytics só no client
export async function initAnalytics() {
  if (typeof window === "undefined") return null;

  const { getAnalytics } = await import("firebase/analytics");
  return getAnalytics(app);
}

export default app;
