"use client"

// Hook de geolocalização com obtenção automática da localização do usuário

import { useState, useEffect } from "react"
import { obterLocalizacaoAtual } from "@/lib/geolocation"
import type { Localizacao } from "@/types/firestore"

interface UseGeolocalizacaoReturn {
  localizacao: Localizacao | null
  carregando: boolean
  erro: string | null
  obterLocalizacao: () => Promise<void>
  permissaoConcedida: boolean
}

export function useGeolocalizacao(autoObter = false): UseGeolocalizacaoReturn {
  const [localizacao, setLocalizacao] = useState<Localizacao | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [permissaoConcedida, setPermissaoConcedida] = useState(false)

  const obterLocalizacao = async () => {
    try {
      setErro(null)
      setCarregando(true)
      console.log("[v0] Requesting user location...")

      const loc = await obterLocalizacaoAtual()
      console.log("[v0] Location obtained:", loc)

      setLocalizacao(loc)
      setPermissaoConcedida(true)

      // Salvar no localStorage para uso futuro
      localStorage.setItem("userLocation", JSON.stringify(loc))
    } catch (error: any) {
      console.error("[v0] Location error:", error)

      if (error.code === 1) {
        setErro("Permissão de localização negada")
      } else if (error.code === 2) {
        setErro("Localização não disponível")
      } else if (error.code === 3) {
        setErro("Tempo esgotado ao obter localização")
      } else {
        setErro("Erro ao obter localização")
      }

      setPermissaoConcedida(false)
    } finally {
      setCarregando(false)
    }
  }

  // Tentar carregar localização salva do localStorage
  useEffect(() => {
    const localizacaoSalva = localStorage.getItem("userLocation")
    if (localizacaoSalva) {
      try {
        const loc = JSON.parse(localizacaoSalva)
        setLocalizacao(loc)
        setPermissaoConcedida(true)
        console.log("[v0] Loaded location from localStorage:", loc)
      } catch (e) {
        console.error("[v0] Error parsing saved location:", e)
      }
    }
  }, [])

  // Auto-obter localização se solicitado
  useEffect(() => {
    if (autoObter && !localizacao && !erro) {
      obterLocalizacao()
    }
  }, [autoObter])

  return {
    localizacao,
    carregando,
    erro,
    obterLocalizacao,
    permissaoConcedida,
  }
}
