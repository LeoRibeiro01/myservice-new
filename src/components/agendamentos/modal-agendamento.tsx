// Modal para criar agendamento (RF006, RN1)

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import type { Servico } from "@/types/firestore"

interface ModalAgendamentoProps {
  aberto: boolean
  onFechar: () => void
  servico: Servico
  clienteId: string
  onConfirmar: (data: Date) => Promise<void>
}

export function ModalAgendamento({ aberto, onFechar, servico, clienteId, onConfirmar }: ModalAgendamentoProps) {
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>()
  const [agendando, setAgendando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const aoConfirmar = async () => {
    if (!dataSelecionada) {
      setErro("Selecione uma data")
      return
    }

    try {
      setAgendando(true)
      setErro(null)
      console.log("[v0] Creating appointment for:", dataSelecionada)

      await onConfirmar(dataSelecionada)
      onFechar()
    } catch (error: any) {
      console.error("[v0] Appointment error:", error)
      setErro(error.message)
    } finally {
      setAgendando(false)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar Serviço</DialogTitle>
          <DialogDescription>{servico.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {erro && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{erro}</div>}

          <div className="space-y-2">
            <Label>Selecione a data</Label>
            <Calendar
              mode="single"
              selected={dataSelecionada}
              onSelect={setDataSelecionada}
              locale={ptBR}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          {dataSelecionada && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Data selecionada:</p>
              <p className="text-lg font-semibold">{format(dataSelecionada, "PPP", { locale: ptBR })}</p>
            </div>
          )}

          <div className="rounded-lg border p-4">
            <div className="flex justify-between text-sm">
              <span>Valor do serviço:</span>
              <span className="font-semibold">R$ {servico.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onFechar}>
            Cancelar
          </Button>
          <Button onClick={aoConfirmar} disabled={!dataSelecionada || agendando}>
            {agendando ? "Agendando..." : "Confirmar Agendamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
