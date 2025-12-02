// Lista de avaliações de um serviço/prestador (RF007)

"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, User } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Avaliacao } from "@/types/firestore"
import { useEffect, useState } from "react"
import { obterUsuario } from "@/lib/firestore"
import type { Usuario } from "@/types/firestore"

interface ListaAvaliacoesProps {
  avaliacoes: Avaliacao[]
}

export function ListaAvaliacoes({ avaliacoes }: ListaAvaliacoesProps) {
  const [clientes, setClientes] = useState<Record<string, Usuario>>({})

  useEffect(() => {
    const carregarClientes = async () => {
      const clientesMap: Record<string, Usuario> = {}

      for (const avaliacao of avaliacoes) {
        if (!clientesMap[avaliacao.clientId]) {
          const cliente = await obterUsuario(avaliacao.clientId)
          if (cliente) {
            clientesMap[avaliacao.clientId] = cliente
          }
        }
      }

      setClientes(clientesMap)
    }

    carregarClientes()
  }, [avaliacoes])

  if (avaliacoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
        <Star className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 font-semibold">Sem avaliações ainda</h3>
        <p className="text-sm text-muted-foreground">Seja o primeiro a avaliar este serviço</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {avaliacoes.map((avaliacao) => {
        const cliente = clientes[avaliacao.clientId]

        return (
          <div key={avaliacao.id} className="rounded-lg border p-4">
            <div className="mb-3 flex items-start gap-3">
              <Avatar>
                <AvatarImage src={cliente?.photoURL || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{cliente?.name || "Carregando..."}</h4>
                  <span className="text-sm text-muted-foreground">
                    {format(avaliacao.createdAt, "PPP", { locale: ptBR })}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < avaliacao.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">{avaliacao.rating}.0</span>
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{avaliacao.comment}</p>
          </div>
        )
      })}
    </div>
  )
}
