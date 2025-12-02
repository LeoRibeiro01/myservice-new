"use client"

import { useAuth } from "@/hooks/useAuth"
import { useChat } from "@/hooks/useChat"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { ParticipanteConversa } from "@/types/firebase"

export function ListaConversas() {
  const { usuario } = useAuth()
  const { conversas, carregando } = useChat(usuario?.uid)
  const router = useRouter()
  const [participantesConversa, setParticipantesConversa] = useState<Record<string, ParticipanteConversa[]>>({})

  if (carregando) {
    return <div className="text-center py-8">Carregando conversas...</div>
  }

  if (conversas.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">Nenhuma conversa ainda</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversas.map((conversa) => {
        const idOutroUsuario = conversa.participantes.find((uid) => uid !== usuario?.uid)

        return (
          <Card
            key={conversa.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition"
            onClick={() => router.push(`/chats/${conversa.id}`)}
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>U</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">Conversa</h3>
                <p className="text-sm text-gray-500 truncate">{conversa.ultimaMensagem || "Sem mensagens"}</p>
              </div>

              {conversa.ultimaMensagemEm && (
                <span className="text-xs text-gray-400">
                  {new Date(conversa.ultimaMensagemEm).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
