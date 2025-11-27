import { Timestamp } from "firebase/firestore"
export type UserType = "cliente" | "prestador";

export interface AppUser {
  uid: string;
  email: string | null;
  name: string;
  type: UserType;
  phone: string;
  createdAt: Timestamp // ISO string (Firestore-friendly)
}

/**
 * Dados usados apenas no momento do registro
 */
export interface UserRegisterData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  createdAt: string; // string para salvar diretamente no Firestore
}
