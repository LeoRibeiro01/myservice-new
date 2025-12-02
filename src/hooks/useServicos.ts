"use client"

// Hook para busca e gerenciamento de serviços com geolocalização

import { useState, useEffect } from "react"
import { buscarServicos, obterServico } from "@/lib/firestore"
import { ordenarPorDistancia } from "@/lib/geolocation"
import type { Servico, FiltrosBusca, Localizacao } from "@/types/firestore"

interface UseServicosReturn {
  servicos: (Servico & { distancia?: number })[]
  carregando: boolean
  erro: string | null
  buscar: (filtros?: FiltrosBusca) => Promise<void>
  obterPorId: (id: string) => Promise<Servico | null>
}

export function useServicos(
  localizacaoUsuario?: Localizacao | null,
  filtrosIniciais?: FiltrosBusca,
): UseServicosReturn {
  const [servicos, setServicos] = useState<(Servico & { distancia?: number })[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const buscar = async (filtros?: FiltrosBusca) => {
    try {
      setErro(null)
      setCarregando(true)
      console.log("[v0] Searching services with filters:", filtros)

      let resultados = await buscarServicos(filtros)
      console.log("[v0] Services found:", resultados.length)

      // Se tiver localização do usuário, ordenar por distância
      if (localizacaoUsuario) {
        const comDistancia = ordenarPorDistancia(resultados, localizacaoUsuario)

        // Aplicar filtro de raio se especificado
        if (filtros?.raioKm) {
          resultados = comDistancia.filter((s) => s.distancia <= filtros.raioKm!)
          console.log("[v0] Filtered by radius:", resultados.length)
        } else {
          resultados = comDistancia
        }

        setServicos(resultados)
      } else {
        // Sem localização, ordenar por avaliação
        resultados.sort((a, b) => b.ratingAverage - a.ratingAverage)
        setServicos(resultados)
      }
    } catch (error: any) {
      console.error("[v0] Services search error:", error)
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  const obterPorId = async (id: string): Promise<Servico | null> => {
    try {
      setErro(null)
      console.log("[v0] Fetching service:", id)
      const servico = await obterServico(id)
      return servico
    } catch (error: any) {
      console.error("[v0] Service fetch error:", error)
      setErro(error.message)
      return null
    }
  }

  // Busca inicial
  useEffect(() => {
    if (filtrosIniciais || localizacaoUsuario) {
      buscar(filtrosIniciais)
    }
  }, [localizacaoUsuario])

  return {
    servicos,
    carregando,
    erro,
    buscar,
    obterPorId,
  }
}
