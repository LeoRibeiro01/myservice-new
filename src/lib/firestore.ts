// Funções CRUD do Firestore seguindo a especificação oficial

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  addDoc,
  type QueryConstraint,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Usuario, Servico, Agendamento, Avaliacao, Conversa, Mensagem, FiltrosBusca } from "@/types/firestore"

// ============= USUÁRIOS =============

export async function criarUsuario(usuario: Usuario): Promise<void> {
  await setDoc(doc(db, "users", usuario.uid), {
    ...usuario,
    createdAt: Timestamp.now(),
  })
}

export async function obterUsuario(uid: string): Promise<Usuario | null> {
  const docRef = doc(db, "users", uid)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null

  const data = docSnap.data()
  return {
    ...data,
    uid: docSnap.id,
    createdAt: data.createdAt?.toDate(),
  } as Usuario
}

export async function atualizarUsuario(uid: string, dados: Partial<Usuario>): Promise<void> {
  const docRef = doc(db, "users", uid)
  await updateDoc(docRef, dados)
}

// ============= SERVIÇOS =============

export async function criarServico(servico: Omit<Servico, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, "services"), {
    ...servico,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export async function obterServico(id: string): Promise<Servico | null> {
  const docRef = doc(db, "services", id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null

  const data = docSnap.data()
  return {
    ...data,
    id: docSnap.id,
    createdAt: data.createdAt?.toDate(),
  } as Servico
}

export async function buscarServicos(filtros?: FiltrosBusca): Promise<Servico[]> {
  const constraints: QueryConstraint[] = [where("active", "==", true)]

  if (filtros?.categoria) {
    constraints.push(where("category", "==", filtros.categoria))
  }

  if (filtros?.precoMin !== undefined) {
    constraints.push(where("price", ">=", filtros.precoMin))
  }

  if (filtros?.precoMax !== undefined) {
    constraints.push(where("price", "<=", filtros.precoMax))
  }

  if (filtros?.notaMinima !== undefined) {
    constraints.push(where("ratingAverage", ">=", filtros.notaMinima))
  }

  const q = query(collection(db, "services"), ...constraints)
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate(),
  })) as Servico[]
}

export async function obterServicosPorPrestador(providerId: string): Promise<Servico[]> {
  const q = query(collection(db, "services"), where("providerId", "==", providerId), orderBy("createdAt", "desc"))

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate(),
  })) as Servico[]
}

export async function atualizarServico(id: string, dados: Partial<Servico>): Promise<void> {
  const docRef = doc(db, "services", id)
  await updateDoc(docRef, dados)
}

export async function pausarServico(id: string): Promise<void> {
  await atualizarServico(id, { active: false })
}

export async function reativarServico(id: string): Promise<void> {
  await atualizarServico(id, { active: true })
}

// ============= AGENDAMENTOS =============

export async function criarAgendamento(agendamento: Omit<Agendamento, "id" | "createdAt" | "status">): Promise<string> {
  const docRef = await addDoc(collection(db, "appointments"), {
    ...agendamento,
    date: Timestamp.fromDate(agendamento.date),
    status: "pending",
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export async function obterAgendamento(id: string): Promise<Agendamento | null> {
  const docRef = doc(db, "appointments", id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null

  const data = docSnap.data()
  return {
    ...data,
    id: docSnap.id,
    date: data.date?.toDate(),
    createdAt: data.createdAt?.toDate(),
  } as Agendamento
}

export async function obterAgendamentosCliente(clientId: string): Promise<Agendamento[]> {
  const q = query(collection(db, "appointments"), where("clientId", "==", clientId), orderBy("date", "desc"))

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    date: doc.data().date?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as Agendamento[]
}

export async function obterAgendamentosPrestador(providerId: string): Promise<Agendamento[]> {
  const q = query(collection(db, "appointments"), where("providerId", "==", providerId), orderBy("date", "desc"))

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    date: doc.data().date?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as Agendamento[]
}

export async function atualizarStatusAgendamento(id: string, status: Agendamento["status"]): Promise<void> {
  const docRef = doc(db, "appointments", id)
  await updateDoc(docRef, { status })
}

// ============= CONVERSAS E MENSAGENS =============

export async function obterOuCriarConversa(clientId: string, providerId: string, serviceId?: string): Promise<string> {
  // Verificar se já existe conversa
  const constraints = [where("clientId", "==", clientId), where("providerId", "==", providerId)]

  if (serviceId) {
    constraints.push(where("serviceId", "==", serviceId))
  }

  const q = query(collection(db, "conversations"), ...constraints)
  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    return snapshot.docs[0].id
  }

  // Criar nova conversa
  const docRef = await addDoc(collection(db, "conversations"), {
    clientId,
    providerId,
    serviceId: serviceId || null,
    lastMessage: "",
    updatedAt: Timestamp.now(),
  })

  return docRef.id
}

export async function obterConversasUsuario(userId: string, tipo: "client" | "provider"): Promise<Conversa[]> {
  const campo = tipo === "client" ? "clientId" : "providerId"
  const q = query(collection(db, "conversations"), where(campo, "==", userId), orderBy("updatedAt", "desc"))

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Conversa[]
}

export async function enviarMensagem(conversationId: string, senderId: string, text: string): Promise<void> {
  // Adicionar mensagem na subcoleção
  await addDoc(collection(db, "conversations", conversationId, "messages"), {
    senderId,
    text,
    createdAt: Timestamp.now(),
  })

  // Atualizar última mensagem e timestamp da conversa
  await updateDoc(doc(db, "conversations", conversationId), {
    lastMessage: text,
    updatedAt: Timestamp.now(),
  })
}

export function inscreverEmMensagens(conversationId: string, callback: (mensagens: Mensagem[]) => void): () => void {
  const q = query(collection(db, "conversations", conversationId, "messages"), orderBy("createdAt", "asc"))

  return onSnapshot(q, (snapshot) => {
    const mensagens = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
    })) as Mensagem[]

    callback(mensagens)
  })
}

// ============= AVALIAÇÕES =============

export async function criarAvaliacao(avaliacao: Omit<Avaliacao, "id" | "createdAt">): Promise<string> {
  // Verificar se cliente já avaliou este serviço
  const q = query(
    collection(db, "reviews"),
    where("clientId", "==", avaliacao.clientId),
    where("serviceId", "==", avaliacao.serviceId),
  )

  const snapshot = await getDocs(q)
  if (!snapshot.empty) {
    throw new Error("Você já avaliou este serviço")
  }

  // Criar avaliação
  const docRef = await addDoc(collection(db, "reviews"), {
    ...avaliacao,
    createdAt: Timestamp.now(),
  })

  // Atualizar rating do serviço
  await atualizarRatingServico(avaliacao.serviceId)

  return docRef.id
}

async function atualizarRatingServico(serviceId: string): Promise<void> {
  const q = query(collection(db, "reviews"), where("serviceId", "==", serviceId))

  const snapshot = await getDocs(q)

  if (snapshot.empty) return

  const ratings = snapshot.docs.map((doc) => doc.data().rating)
  const ratingAverage = ratings.reduce((a, b) => a + b, 0) / ratings.length
  const ratingCount = ratings.length

  await updateDoc(doc(db, "services", serviceId), {
    ratingAverage,
    ratingCount,
  })
}

export async function obterAvaliacoesServico(serviceId: string): Promise<Avaliacao[]> {
  const q = query(collection(db, "reviews"), where("serviceId", "==", serviceId), orderBy("createdAt", "desc"))

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate(),
  })) as Avaliacao[]
}

export async function obterAvaliacoesPrestador(providerId: string): Promise<Avaliacao[]> {
  const q = query(collection(db, "reviews"), where("providerId", "==", providerId), orderBy("createdAt", "desc"))

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate(),
  })) as Avaliacao[]
}

// ============= FAVORITOS =============

export async function adicionarFavorito(clientId: string, providerId: string): Promise<void> {
  const id = `${clientId}_${providerId}`
  await setDoc(doc(db, "favorites", id), {
    clientId,
    providerId,
    createdAt: Timestamp.now(),
  })
}

export async function removerFavorito(clientId: string, providerId: string): Promise<void> {
  const id = `${clientId}_${providerId}`
  await deleteDoc(doc(db, "favorites", id))
}

export async function verificarFavorito(clientId: string, providerId: string): Promise<boolean> {
  const id = `${clientId}_${providerId}`
  const docRef = doc(db, "favorites", id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists()
}

export async function obterFavoritosCliente(clientId: string): Promise<string[]> {
  const q = query(collection(db, "favorites"), where("clientId", "==", clientId))

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data().providerId)
}

// Exportar alias para compatibilidade
export { obterUsuario as getUser }
