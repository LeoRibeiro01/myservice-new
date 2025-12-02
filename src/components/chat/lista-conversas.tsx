// Lista de conversas do usuário

"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Conversa } from "@/types/firestore"
import { useEffect, useState } from "react"
import { obterUsuario } from "@/lib/firestore"
import type { Usuario } from "@/types/firestore"

interface ListaConversasProps {
  conversas: Conversa[]
  usuarioAtualId: string
  tipoUsuario: "client" | "provider"
  onSelecionarConversa: (conversaId: string) => void
  conversaSelecionada?: string | null
}

export function ListaConversas({
  conversas,
  usuarioAtualId,
  tipoUsuario,
  onSelecionarConversa,
  conversaSelecionada,
}: ListaConversasProps) {
  const [usuarios, setUsuarios] = useState<Record<string, Usuario>>({})

  // Carregar dados dos outros participantes
  useEffect(() => {
    const carregarUsuarios = async () => {
      const usuariosMap: Record<string, Usuario> = {}

      for (const conversa of conversas) {
        const outroUsuarioId = tipoUsuario === "client" ? conversa.providerId : conversa.clientId

        if (!usuariosMap[outroUsuarioId]) {
          const usuario = await obterUsuario(outroUsuarioId)
          if (usuario) {
            usuariosMap[outroUsuarioId] = usuario
          }
        }
      }

      setUsuarios(usuariosMap)
    }

    carregarUsuarios()
  }, [conversas, tipoUsuario])

  if (conversas.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <MessageCircle className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 font-semibold">Nenhuma conversa</h3>
        <p className="text-sm text-muted-foreground">Suas conversas aparecerão aqui</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {conversas.map((conversa) => {
          const outroUsuarioId = tipoUsuario === "client" ? conversa.providerId : conversa.clientId
          const outroUsuario = usuarios[outroUsuarioId]

          return (
            <Button
              key={conversa.id}
              variant={conversaSelecionada === conversa.id ? "secondary" : "ghost"}
              className="h-auto w-full justify-start p-3"
              onClick={() => onSelecionarConversa(conversa.id)}
            >
              <Avatar className="mr-3 h-10 w-10">
                <AvatarImage src={outroUsuario?.photoURL || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{outroUsuario?.name || "Carregando..."}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(conversa.updatedAt, {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <p className="truncate text-sm text-muted-foreground">{conversa.lastMessage || "Sem mensagens"}</p>
              </div>
            </Button>
          )
        })}
      </div>
    </ScrollArea>
  )
}
