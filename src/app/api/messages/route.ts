// src/app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getFirestore, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import firebaseApp from "@/lib/firebase" // seu initFirebase

const db = getFirestore(firebaseApp)

export async function GET(req: NextRequest) {
  try {
    // pegar uid do cookie de autenticação (ou do token enviado pelo cliente)
    const token = req.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

    // decodifica o token no cliente? como estamos sem firebase-admin, você deve confiar no cliente
    const uid = token // aqui assumimos que o cliente enviou o uid (melhor que token JWT)
    if (!uid) return NextResponse.json({ error: "UID não encontrado" }, { status: 401 })

    // pegar chats do usuário
    const chatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", uid)
    )
    const chatsSnap = await getDocs(chatsQuery)

    const messages: any[] = []

    for (const chatDoc of chatsSnap.docs) {
      const messagesSnap = await getDocs(
        query(
          collection(db, "chats", chatDoc.id, "messages"),
          orderBy("createdAt", "desc"),
          limit(20)
        )
      )

      messagesSnap.forEach((msgDoc) => {
        const msgData = msgDoc.data()
        messages.push({
          id: msgDoc.id,
          chatId: chatDoc.id,
          client: msgData.senderName,
          message: msgData.text,
          time: msgData.createdAt.toDate().toLocaleString(),
          unread: msgData.unread,
        })
      })
    }

    // ordenar pela mais recente
    messages.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    return NextResponse.json(messages)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erro ao carregar mensagens" }, { status: 500 })
  }
}
