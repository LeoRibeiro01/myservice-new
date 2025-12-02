"use client"

// Hook para gerenciamento de agendamentos

import { useState, useEffect } from "react"
import {
  criarAgendamento,
  obterAgendamentosCliente,
  obterAgendamentosPrestador,
  atualizarStatusAgendamento,
} from "@/lib/firestore"
import type { Agendamento } from "@/types/firestore"

interface UseAgendamentosReturn {
  agendamentos: Agendamento[]
  carregando: boolean
  erro: string | null
  criar: (dados: {
    clientId: string
    providerId: string
    serviceId: string
    date: Date
  }) => Promise<string>
  aceitar: (id: string) => Promise<void>
  recusar: (id: string) => Promise<void>
  completar: (id: string) => Promise<void>
  cancelar: (id: string) => Promise<void>
  recarregar: () => Promise<void>
}

export function useAgendamentos(userId: string, tipo: "client" | "provider"): UseAgendamentosReturn {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = async () => {
    try {
      setErro(null)
      setCarregando(true)
      console.log("[v0] Loading appointments for:", userId, tipo)

      const dados =
        tipo === "client" ? await obterAgendamentosCliente(userId) : await obterAgendamentosPrestador(userId)

      console.log("[v0] Appointments loaded:", dados.length)
      setAgendamentos(dados)
    } catch (error: any) {
      console.error("[v0] Appointments load error:", error)
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  const criar = async (dados: {
    clientId: string
    providerId: string
    serviceId: string
    date: Date
  }): Promise<string> => {
    try {
      setErro(null)
      console.log("[v0] Creating appointment:", dados)

      const id = await criarAgendamento(dados)
      console.log("[v0] Appointment created:", id)

      await carregar()
      return id
    } catch (error: any) {
      console.error("[v0] Create appointment error:", error)
      setErro(error.message)
      throw error
    }
  }

  const aceitar = async (id: string): Promise<void> => {
    try {
      setErro(null)
      console.log("[v0] Accepting appointment:", id)
      await atualizarStatusAgendamento(id, "accepted")
      await carregar()
    } catch (error: any) {
      console.error("[v0] Accept error:", error)
      setErro(error.message)
      throw error
    }
  }

  const recusar = async (id: string): Promise<void> => {
    try {
      setErro(null)
      console.log("[v0] Rejecting appointment:", id)
      await atualizarStatusAgendamento(id, "rejected")
      await carregar()
    } catch (error: any) {
      console.error("[v0] Reject error:", error)
      setErro(error.message)
      throw error
    }
  }

  const completar = async (id: string): Promise<void> => {
    try {
      setErro(null)
      console.log("[v0] Completing appointment:", id)
      await atualizarStatusAgendamento(id, "completed")
      await carregar()
    } catch (error: any) {
      console.error("[v0] Complete error:", error)
      setErro(error.message)
      throw error
    }
  }

  const cancelar = async (id: string): Promise<void> => {
    try {
      setErro(null)
      console.log("[v0] Canceling appointment:", id)
      await atualizarStatusAgendamento(id, "canceled")
      await carregar()
    } catch (error: any) {
      console.error("[v0] Cancel error:", error)
      setErro(error.message)
      throw error
    }
  }

  useEffect(() => {
    if (userId) {
      carregar()
    }
  }, [userId, tipo])

  return {
    agendamentos,
    carregando,
    erro,
    criar,
    aceitar,
    recusar,
    completar,
    cancelar,
    recarregar: carregar,
  }
}
