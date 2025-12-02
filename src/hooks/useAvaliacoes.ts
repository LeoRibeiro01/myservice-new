"use client"

// Hook para gerenciar avaliações (RF007, RN4)

import { useState, useEffect } from "react"
import { criarAvaliacao, obterAvaliacoesServico, obterAvaliacoesPrestador } from "@/lib/firestore"
import type { Avaliacao } from "@/types/firestore"

interface UseAvaliacoesReturn {
  avaliacoes: Avaliacao[]
  carregando: boolean
  erro: string | null
  criar: (dados: {
    clientId: string
    providerId: string
    serviceId: string
    rating: number
    comment: string
  }) => Promise<void>
  recarregar: () => Promise<void>
}

export function useAvaliacoes(tipo: "servico" | "prestador", id: string): UseAvaliacoesReturn {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = async () => {
    try {
      setErro(null)
      setCarregando(true)
      console.log("[v0] Loading reviews for:", tipo, id)

      const dados = tipo === "servico" ? await obterAvaliacoesServico(id) : await obterAvaliacoesPrestador(id)

      console.log("[v0] Reviews loaded:", dados.length)
      setAvaliacoes(dados)
    } catch (error: any) {
      console.error("[v0] Reviews load error:", error)
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  const criar = async (dados: {
    clientId: string
    providerId: string
    serviceId: string
    rating: number
    comment: string
  }): Promise<void> => {
    try {
      setErro(null)
      console.log("[v0] Creating review:", dados)

      // RN4: Só clientes que contrataram podem avaliar (verificado no backend)
      await criarAvaliacao(dados)
      console.log("[v0] Review created successfully")

      await carregar()
    } catch (error: any) {
      console.error("[v0] Create review error:", error)
      setErro(error.message)
      throw error
    }
  }

  useEffect(() => {
    if (id) {
      carregar()
    }
  }, [id, tipo])

  return {
    avaliacoes,
    carregando,
    erro,
    criar,
    recarregar: carregar,
  }
}
