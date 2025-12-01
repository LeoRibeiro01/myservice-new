"use client"

import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import {
  Send,
  ArrowLeft,
  MapPin,
  ImageIcon,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { db, auth } from "@/lib/firebase"
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

interface MessageItem {
  id: string
  senderUid: string
  senderName?: string
  text: string
  createdAtStr: string
  read: boolean
}

export default function ChatPage() {
  const params = useParams() as { chatId?: string }
  const searchParams = useSearchParams()
  const router = useRouter()

  const chatId = params?.chatId ?? (Array.isArray(params?.chatId) ? params?.chatId[0] : undefined)
  // opcional: providerId vindo pela query para mostrar header correto
  const providerId = searchParams?.get?.("providerId") ?? undefined

  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [chatExists, setChatExists] = useState<boolean | null>(null)
  const [participants, setParticipants] = useState<string[] | null>(null)
  const [otherUserId, setOtherUserId] = useState<string | null>(null)
  const [otherUserInfo, setOtherUserInfo] = useState<any | null>(null)

  const [messages, setMessages] = useState<MessageItem[]>([])
  const [nameCache, setNameCache] = useState<Record<string, string>>({})
  const [newMessage, setNewMessage] = useState("")
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const [typingLocal, setTypingLocal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u)
    })
    return () => unsub()
  }, [])

  // verify chat and participants (only once when chatId or user changes)
  useEffect(() => {
    if (!chatId || !currentUser) {
      setChatExists(null)
      return
    }

    let mounted = true
    const chatRef = doc(db, "chats", chatId)

    const check = async () => {
      try {
        const snap = await getDoc(chatRef)
        if (!mounted) return
        if (!snap.exists()) {
          // chat não existe — não criamos aqui para evitar criação com participants inválidos
          setChatExists(false)
          setParticipants(null)
          setOtherUserId(null)
          return
        }

        const data = snap.data()
        const parts: string[] = Array.isArray(data.participants) ? data.participants : []
        // garantir exatamente 2 participantes válidos (strings)
        const validParts = parts.filter((p) => typeof p === "string" && p)
        if (validParts.length !== 2) {
          setChatExists(false)
          setParticipants(validParts)
          setOtherUserId(null)
          return
        }

        setChatExists(true)
        setParticipants(validParts)

        const other = validParts.find((p) => p !== currentUser.uid) ?? null
        setOtherUserId(other)

        // opcional: buscar info do outro usuário (nome/avatar)
        if (other) {
          const otherRef = doc(db, "users", other)
          const otherSnap = await getDoc(otherRef)
          if (otherSnap.exists()) setOtherUserInfo(otherSnap.data())
        }
      } catch (err) {
        console.error("Erro ao verificar chat:", err)
        setChatExists(false)
      }
    }

    check()
    return () => {
      mounted = false
    }
  }, [chatId, currentUser])

  // helper: ensure we have sender name (cache) — evita muitas leituras
  const ensureName = async (uid: string) => {
    if (!uid) return "Usuário"
    if (nameCache[uid]) return nameCache[uid]
    try {
      const uRef = doc(db, "users", uid)
      const uSnap = await getDoc(uRef)
      const name = uSnap.exists() ? (uSnap.data().name || "Usuário") : "Usuário"
      setNameCache((prev) => ({ ...prev, [uid]: name }))
      return name
    } catch (err) {
      console.error("Erro ao buscar nome:", err)
      return "Usuário"
    }
  }

  // subscribe mensagens real-time (isolado por chatId)
  useEffect(() => {
    if (!chatId || !currentUser || chatExists !== true) {
      setMessages([])
      return
    }

    const messagesRef = collection(db, "chats", chatId, "messages")
    const q = query(messagesRef, orderBy("createdAt", "asc"))
    let mounted = true

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        if (!mounted) return
        const docs = snapshot.docs
        const list: MessageItem[] = []

        // build list and fetch missing names (batch)
        const missingNames = new Set<string>()
        for (const d of docs) {
          const data = d.data()
          const uid = data.senderUid
          if (uid && !nameCache[uid]) missingNames.add(uid)
        }

        // fetch missing names
        if (missingNames.size > 0) {
          await Promise.all(
            Array.from(missingNames).map(async (uid) => {
              const n = await ensureName(uid)
              return n
            })
          )
        }

        for (const d of docs) {
          const data = d.data()
          const createdAtObj = data.createdAt?.toDate ? data.createdAt.toDate() : null
          const createdAtStr = createdAtObj
            ? createdAtObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
            : ""

          list.push({
            id: d.id,
            senderUid: data.senderUid,
            senderName: nameCache[data.senderUid] || undefined,
            text: data.text || "",
            createdAtStr,
            read: data.read ?? false,
          })
        }

        setMessages(list)

        // scroll
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)

        // marcar como lidas: somente mensagens que não são minhas e que não estão marcadas
        for (const d of docs) {
          const data = d.data()
          if (data.senderUid && data.senderUid !== currentUser.uid && !data.read) {
            try {
              await updateDoc(doc(db, "chats", chatId, "messages", d.id), { read: true })
            } catch (err) {
              // não fatal — pode ser permissão
              console.error("Erro marcando mensagem como lida:", err)
            }
          }
        }
      },
      (err) => {
        console.error("Erro no onSnapshot mensagens:", err)
      }
    )

    return () => {
      mounted = false
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, currentUser, chatExists, nameCache]) // nameCache usado para forçar leitura quando preenchido

  // typing listener (other user's typing doc)
  useEffect(() => {
    if (!chatId || !otherUserId) {
      setIsOtherTyping(false)
      return
    }
    const typingRef = doc(db, "chats", chatId, "typing", otherUserId)
    const unsubscribe = onSnapshot(typingRef, (snap) => {
      const data = snap.data()
      setIsOtherTyping(Boolean(data?.isTyping))
    }, (err) => {
      // se não existir doc ou permissão negada, ignora
      // console.debug("typing snapshot err", err)
    })

    return () => unsubscribe()
  }, [chatId, otherUserId])

  // local typing: notify firestore document when user types (debounced)
  useEffect(() => {
    if (!chatId || !currentUser) return
    const typingRef = doc(db, "chats", chatId, "typing", currentUser.uid)

    // when typingLocal changes to true we set doc true
    const applyTyping = async () => {
      try {
        if (typingLocal) {
          // upsert doc
          await setDoc(typingRef, { isTyping: true }, { merge: true })
        } else {
          await setDoc(typingRef, { isTyping: false }, { merge: true })
        }
      } catch (err) {
        console.error("Erro atualizando typing:", err)
      }
    }

    applyTyping()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingLocal, chatId, currentUser?.uid])

  // input change handler (typing debounce)
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    if (!currentUser || !chatId) return

    // sinaliza que o usuário está digitando
    setTypingLocal(true)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setTypingLocal(false)
    }, 1000)
  }

  // send message (ONLY if chat exists and participants valid)
const handleSend = async () => {
  if (!currentUser) return

  if (!chatId) {
    alert("Chat inválido — volte e inicie a conversa pela lista de serviços.")
    return
  }

  // nova validação correta
  if (chatExists === false) {  
    alert("Este chat não existe ou você não tem permissão.")
    return
  }

  if (!newMessage.trim()) return

  try {
    const messagesRef = collection(db, "chats", chatId, "messages")
    await addDoc(messagesRef, {
      senderUid: currentUser.uid,
      text: newMessage.trim(),
      createdAt: serverTimestamp(),
      read: false,
    })


      // garantir typing false imediatamente
      setTypingLocal(false)
      setNewMessage("")
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err)
      alert("Não foi possível enviar mensagem.")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [])

  // UI helpers
  const getDisplayName = (uid?: string) => {
    if (!uid) return "Usuário"
    if (uid === currentUser?.uid) return "Você"
    return nameCache[uid] ?? (uid === otherUserId ? (otherUserInfo?.name ?? "Contato") : "Contato")
  }

  // render
  if (chatExists === null) {
    // aguardando verificação do chat (ou auth)
    return <div className="p-6">carregando chat...</div>
  }

  if (chatExists === false) {
    return (
      <div className="p-6">
        <p className="mb-4">Chat inválido ou corrompido. por segurança, não criamos salas daqui.</p>
        <p className="mb-4">inicie a conversa a partir da página de serviços / perfil do prestador.</p>
        <Button onClick={() => router.push("/servicos")}>voltar</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/servicos">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={otherUserInfo?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{(otherUserInfo?.name || getDisplayName(otherUserId || "") || "?")[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{otherUserInfo?.name ?? getDisplayName(otherUserId || "")}</div>
                <div className="text-xs text-gray-500">{participants?.includes(currentUser?.uid) ? "conversa privada" : ""}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm"><Phone className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm"><Video className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      {/* mensagens */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => {
              const mine = m.senderUid === currentUser?.uid
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`${mine ? "bg-indigo-600 text-white" : "bg-white border"} max-w-md px-4 py-2 rounded-lg shadow-sm`}>
                    <div className="text-xs opacity-80 mb-1">{getDisplayName(m.senderUid)}</div>
                    <div className="text-sm">{m.text}</div>
                    <div className={`text-xs mt-1 ${mine ? "text-indigo-200" : "text-gray-500"}`}>{m.createdAtStr}</div>
                  </div>
                </div>
              )
            })}

            {isOtherTyping && (
              <div className="text-sm text-gray-500">digitando...</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* input */}
          <div className="border-t bg-white p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm"><ImageIcon className="h-4 w-4" /></Button>
              <div className="flex-1">
                <Input
                  placeholder={chatExists ? "Digite sua mensagem..." : "Chat indisponível"}
                  value={newMessage}
                  onChange={onInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={!chatExists}
                />
              </div>
              <Button onClick={handleSend} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
