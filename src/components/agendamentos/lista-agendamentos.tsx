// Lista de agendamentos com ações (RF006, RF009)

"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, XCircle, Star } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Agendamento } from "@/types/firestore"

interface ListaAgendamentosProps {
  agendamentos: Agendamento[]
  tipoUsuario: "client" | "provider"
  onAceitar?: (id: string) => Promise<void>
  onRecusar?: (id: string) => Promise<void>
  onCompletar?: (id: string) => Promise<void>
  onCancelar?: (id: string) => Promise<void>
  onAvaliar?: (id: string) => void
}

const STATUS_BADGES = {
  pending: { label: "Pendente", variant: "secondary" as const },
  accepted: { label: "Aceito", variant: "default" as const },
  rejected: { label: "Recusado", variant: "destructive" as const },
  completed: { label: "Concluído", variant: "outline" as const },
  canceled: { label: "Cancelado", variant: "destructive" as const },
}

export function ListaAgendamentos({
  agendamentos,
  tipoUsuario,
  onAceitar,
  onRecusar,
  onCompletar,
  onCancelar,
  onAvaliar,
}: ListaAgendamentosProps) {
  if (agendamentos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
        <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 font-semibold">Nenhum agendamento</h3>
        <p className="text-sm text-muted-foreground">Seus agendamentos aparecerão aqui</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {agendamentos.map((agendamento) => {
        const statusConfig = STATUS_BADGES[agendamento.status]

        return (
          <Card key={agendamento.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">ID: {agendamento.id.substring(0, 8)}</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(agendamento.date, "PPP", { locale: ptBR })}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Criado em {format(agendamento.createdAt, "PPP", { locale: ptBR })}</span>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2 border-t pt-4">
              {/* Ações do prestador */}
              {tipoUsuario === "provider" && agendamento.status === "pending" && (
                <>
                  <Button size="sm" variant="default" onClick={() => onAceitar?.(agendamento.id)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aceitar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onRecusar?.(agendamento.id)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Recusar
                  </Button>
                </>
              )}

              {tipoUsuario === "provider" && agendamento.status === "accepted" && (
                <Button size="sm" onClick={() => onCompletar?.(agendamento.id)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Marcar como Concluído
                </Button>
              )}

              {/* Ações do cliente */}
              {tipoUsuario === "client" && agendamento.status === "pending" && (
                <Button size="sm" variant="outline" onClick={() => onCancelar?.(agendamento.id)}>
                  Cancelar Agendamento
                </Button>
              )}

              {/* RN4: Só pode avaliar depois de concluído */}
              {tipoUsuario === "client" && agendamento.status === "completed" && (
                <Button size="sm" variant="default" onClick={() => onAvaliar?.(agendamento.id)}>
                  <Star className="mr-2 h-4 w-4" />
                  Avaliar Serviço
                </Button>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
