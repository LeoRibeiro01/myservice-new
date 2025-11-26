// src/lib/api/auth.ts
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * REGISTRO
 */
export async function registerUser({
  name,
  email,
  password,
  type
}: {
  name: string;
  email: string;
  password: string;
  type: "cliente" | "prestador";
}) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCred.user.uid), {
    name,
    email,
    type,
    createdAt: new Date()
  });

  return userCred.user;
}

/**
 * LOGIN
 */
export async function loginUser(email: string, password: string) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);

  const snap = await getDoc(doc(db, "users", userCred.user.uid));
  const userData = snap.data();

  return {
    uid: userCred.user.uid,
    email: userCred.user.email,
    ...userData
  };
}

/**
 * LOGOUT
 */
export function logoutUser() {
  return signOut(auth);
}
