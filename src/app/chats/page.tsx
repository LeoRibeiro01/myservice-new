// Página principal de chat

"use client"

import { useState } from "react"
import { useAuthReal } from "@/hooks/useAuthReal"
import { useChatReal } from "@/hooks/useChatReal"
import { ListaConversas } from "@/components/chat/lista-conversas"
import { ChatInterface } from "@/components/chat/chat-interface"
import { MessageCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default function ChatPage() {
  const { usuarioAtual, carregando } = useAuthReal()
  const tipoUsuario = usuarioAtual?.type === "provider" ? "provider" : "client"
  const [conversaSelecionada, setConversaSelecionada] = useState<string | null>(null)
  const { conversas, selecionarConversa } = useChatReal(usuarioAtual?.uid, tipoUsuario)

  const aoSelecionarConversa = (conversaId: string) => {
    setConversaSelecionada(conversaId)
    selecionarConversa(conversaId)
  }

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!usuarioAtual) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen">
      {/* Lista de conversas - sidebar */}
      <div className="w-80 border-r bg-muted/10">
        <div className="flex items-center gap-2 border-b bg-white p-4">
          <MessageCircle className="h-5 w-5" />
          <h2 className="font-semibold">Mensagens</h2>
        </div>
        <ListaConversas
          conversas={conversas}
          usuarioAtualId={usuarioAtual.uid}
          tipoUsuario={tipoUsuario}
          onSelecionarConversa={aoSelecionarConversa}
          conversaSelecionada={conversaSelecionada}
        />
      </div>

      {/* Área de chat */}
      <div className="flex-1">
        {conversaSelecionada ? (
          <ChatInterface
            conversaId={conversaSelecionada}
            usuarioAtualId={usuarioAtual.uid}
            onVoltar={() => setConversaSelecionada(null)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="mx-auto mb-4 h-16 w-16" />
              <p>Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
