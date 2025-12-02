// Interface completa de chat seguindo RF015

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, ArrowLeft, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatReal } from "@/hooks/useChatReal"
import type { Usuario } from "@/types/firestore"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ChatInterfaceProps {
  conversaId: string
  usuarioAtualId: string
  onVoltar?: () => void
}

export function ChatInterface({ conversaId, usuarioAtualId, onVoltar }: ChatInterfaceProps) {
  const { mensagens, enviar, conversaAtual } = useChatReal(usuarioAtualId, "client")
  const [texto, setTexto] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [outroUsuario, setOutroUsuario] = useState<Usuario | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Carregar dados do outro usuário
  useEffect(() => {
    const carregarOutroUsuario = async () => {
      // Aqui você precisaria extrair o ID do outro participante da conversa
      // Por enquanto, vou deixar genérico
      console.log("[v0] Loading other user data...")
    }

    carregarOutroUsuario()
  }, [conversaId])

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [mensagens])

  const aoEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!texto.trim() || enviando) return

    try {
      setEnviando(true)
      await enviar(texto)
      setTexto("")
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header do chat */}
      <div className="flex items-center gap-3 border-b bg-white p-4">
        {onVoltar && (
          <Button variant="ghost" size="icon" onClick={onVoltar}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar>
          <AvatarImage src={outroUsuario?.photoURL || "/placeholder.svg"} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{outroUsuario?.name || "Carregando..."}</h3>
          {outroUsuario?.specialty && <p className="text-sm text-muted-foreground">{outroUsuario.specialty}</p>}
        </div>
      </div>

      {/* Mensagens */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mensagens.map((mensagem) => {
            const ehMinha = mensagem.senderId === usuarioAtualId

            return (
              <div key={mensagem.id} className={`flex ${ehMinha ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    ehMinha ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{mensagem.text}</p>
                  <p className={`mt-1 text-xs ${ehMinha ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {formatDistanceToNow(mensagem.createdAt, {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input de mensagem */}
      <form onSubmit={aoEnviar} className="border-t bg-white p-4">
        <div className="flex gap-2">
          <Input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={enviando}
            className="flex-1"
          />
          <Button type="submit" disabled={!texto.trim() || enviando}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
