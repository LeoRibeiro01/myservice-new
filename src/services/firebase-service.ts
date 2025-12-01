// services/firebase-service.ts
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export type Provider = {
  price: number
  available: any
  location: string
  name: any
  id: string            // ID do documento = auth.uid do prestador
  uid: string           // redundância útil: uid do Firebase Auth
  businessName?: string
  serviceCategory?: string
  experienceTime?: string
  description?: string
  image?: string
  rating?: number
  reviews?: number
  phone?: string
  address?: string
  verified?: boolean
}

export async function getProviderById(uid: string): Promise<Provider | null> {
  try {
    const ref = doc(db, "prestadores", uid)
    const snap = await getDoc(ref)
    
    if (!snap.exists()) return null

    return {
      id: snap.id,     // mesmo que uid
      ...(snap.data() as any)
    }
  } catch (err) {
    console.error("Erro ao buscar prestador:", err)
    return null
  }
}

export async function getAllProviders(): Promise<Provider[]> {
  try {
    const snap = await getDocs(collection(db, "prestadores"))

    return snap.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as any)
    }))
  } catch (err) {
    console.error("Erro ao buscar prestadores:", err)
    return []
  }
}
