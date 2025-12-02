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
  serverTimestamp,
  onSnapshot,
  addDoc,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Usuario, Prestador, Conversa, Mensagem } from "@/types/firebase"

// ===================== USUÁRIOS =====================

export async function criarUsuario(idUsuario: string, dados: Omit<Usuario, "uid" | "criadoEm">) {
  const usuarioRef = doc(db, "users", idUsuario)
  await setDoc(usuarioRef, {
    ...dados,
    uid: idUsuario,
    criadoEm: serverTimestamp(),
  })
}

export async function obterUsuario(idUsuario: string): Promise<Usuario | null> {
  const usuarioRef = doc(db, "users", idUsuario)
  const usuarioSnap = await getDoc(usuarioRef)

  if (!usuarioSnap.exists()) return null

  return { id: usuarioSnap.id, ...usuarioSnap.data() } as Usuario
}

export async function atualizarUsuario(idUsuario: string, dados: Partial<Usuario>) {
  const usuarioRef = doc(db, "users", idUsuario)
  await updateDoc(usuarioRef, dados)
}

// ===================== PRESTADORES =====================

export async function criarPrestador(
  idUsuario: string,
  dados: Omit<Prestador, "id" | "uid" | "criadoEm" | "atualizadoEm">,
) {
  const prestadorRef = doc(db, "prestadores", idUsuario)
  await setDoc(prestadorRef, {
    ...dados,
    id: idUsuario,
    uid: idUsuario,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  })
}

export async function obterPrestador(idUsuario: string): Promise<Prestador | null> {
  const prestadorRef = doc(db, "prestadores", idUsuario)
  const prestadorSnap = await getDoc(prestadorRef)

  if (!prestadorSnap.exists()) return null

  return { ...prestadorSnap.data() } as Prestador
}

export async function atualizarPrestador(idUsuario: string, dados: Partial<Prestador>) {
  const prestadorRef = doc(db, "prestadores", idUsuario)
  await updateDoc(prestadorRef, {
    ...dados,
    atualizadoEm: serverTimestamp(),
  })
}

export async function obterTodosPrestadores(): Promise<Prestador[]> {
  const prestadoresRef = collection(db, "prestadores")
  const querySnapshot = await getDocs(prestadoresRef)

  return querySnapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
      }) as Prestador,
  )
}

export async function obterPrestadoresPorCategoria(categoria: string): Promise<Prestador[]> {
  const prestadoresRef = collection(db, "prestadores")
  const q = query(prestadoresRef, where("serviceCategory", "==", categoria))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
      }) as Prestador,
  )
}

// ===================== CONVERSAS (CHATS) =====================

export async function criarConversa(participante1: string, participante2: string): Promise<string> {
  // Verificar se já existe uma conversa entre esses participantes
  const conversaExistente = await encontrarConversaPorParticipantes(participante1, participante2)
  if (conversaExistente) return conversaExistente.id

  const conversasRef = collection(db, "chats")
  const conversaDoc = await addDoc(conversasRef, {
    participantes: [participante1, participante2],
    criadoEm: serverTimestamp(),
  })

  return conversaDoc.id
}

export async function encontrarConversaPorParticipantes(uid1: string, uid2: string): Promise<Conversa | null> {
  const conversasRef = collection(db, "chats")
  const q = query(conversasRef, where("participantes", "array-contains", uid1))

  const querySnapshot = await getDocs(q)

  for (const doc of querySnapshot.docs) {
    const dados = doc.data()
    if (dados.participantes.includes(uid2)) {
      return { id: doc.id, ...dados } as Conversa
    }
  }

  return null
}

export async function obterConversasDoUsuario(idUsuario: string): Promise<Conversa[]> {
  const conversasRef = collection(db, "chats")
  const q = query(conversasRef, where("participantes", "array-contains", idUsuario), orderBy("criadoEm", "desc"))

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Conversa,
  )
}

// ===================== MENSAGENS =====================

export async function enviarMensagem(
  idConversa: string,
  uidRemetente: string,
  texto: string,
  urlImagem?: string,
  urlArquivo?: string,
): Promise<string> {
  const mensagensRef = collection(db, "chats", idConversa, "messages")

  const mensagemDoc = await addDoc(mensagensRef, {
    uidRemetente,
    texto,
    urlImagem,
    urlArquivo,
    lida: false,
    criadoEm: serverTimestamp(),
  })

  // Atualizar última mensagem no chat
  const conversaRef = doc(db, "chats", idConversa)
  await updateDoc(conversaRef, {
    ultimaMensagem: texto,
    ultimaMensagemEm: serverTimestamp(),
  })

  return mensagemDoc.id
}

export async function marcarMensagemComoLida(idConversa: string, idMensagem: string) {
  const mensagemRef = doc(db, "chats", idConversa, "messages", idMensagem)
  await updateDoc(mensagemRef, { lida: true })
}

export async function marcarTodasMensagensComoLidas(idConversa: string, idUsuario: string) {
  const mensagensRef = collection(db, "chats", idConversa, "messages")
  const q = query(mensagensRef, where("uidRemetente", "!=", idUsuario), where("lida", "==", false))

  const querySnapshot = await getDocs(q)

  const promessas = querySnapshot.docs.map((doc) => updateDoc(doc.ref, { lida: true }))

  await Promise.all(promessas)
}

// ===================== INDICADOR DE DIGITAÇÃO =====================

export async function definirIndicadorDigitacao(idConversa: string, idUsuario: string, estaDigitando: boolean) {
  const digitacaoRef = doc(db, "chats", idConversa, "typing", idUsuario)

  if (estaDigitando) {
    await setDoc(digitacaoRef, {
      estaDigitando: true,
      timestamp: serverTimestamp(),
    })
  } else {
    await deleteDoc(digitacaoRef)
  }
}

// ===================== OUVINTES EM TEMPO REAL =====================

export function inscreverEmMensagens(idConversa: string, callback: (mensagens: Mensagem[]) => void) {
  const mensagensRef = collection(db, "chats", idConversa, "messages")
  const q = query(mensagensRef, orderBy("criadoEm", "asc"))

  return onSnapshot(q, (snapshot) => {
    const mensagens = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          idConversa,
          ...doc.data(),
        }) as Mensagem,
    )

    callback(mensagens)
  })
}

export function inscreverEmDigitacao(
  idConversa: string,
  idOutroUsuario: string,
  callback: (estaDigitando: boolean) => void,
) {
  const digitacaoRef = doc(db, "chats", idConversa, "typing", idOutroUsuario)

  return onSnapshot(digitacaoRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data().estaDigitando)
    } else {
      callback(false)
    }
  })
}

export function inscreverEmConversasDoUsuario(idUsuario: string, callback: (conversas: Conversa[]) => void) {
  const conversasRef = collection(db, "chats")
  const q = query(conversasRef, where("participantes", "array-contains", idUsuario), orderBy("criadoEm", "desc"))

  return onSnapshot(q, (snapshot) => {
    const conversas = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Conversa,
    )

    callback(conversas)
  })
}

export { obterUsuario as getUser }
