"use client"

// Hook para gerenciar favoritos (RF016)

import { useState, useEffect } from "react"
import { adicionarFavorito, removerFavorito, obterFavoritosCliente } from "@/lib/firestore"

interface UseFavoritosReturn {
  favoritos: string[]
  ehFavorito: (providerId: string) => boolean
  alternarFavorito: (providerId: string) => Promise<void>
  carregando: boolean
  erro: string | null
}

export function useFavoritos(clientId: string): UseFavoritosReturn {
  const [favoritos, setFavoritos] = useState<string[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true)
        console.log("[v0] Loading favorites for client:", clientId)

        const ids = await obterFavoritosCliente(clientId)
        console.log("[v0] Favorites loaded:", ids.length)
        setFavoritos(ids)
      } catch (error: any) {
        console.error("[v0] Load favorites error:", error)
        setErro(error.message)
      } finally {
        setCarregando(false)
      }
    }

    if (clientId) {
      carregar()
    }
  }, [clientId])

  const ehFavorito = (providerId: string): boolean => {
    return favoritos.includes(providerId)
  }

  const alternarFavorito = async (providerId: string): Promise<void> => {
    try {
      setErro(null)
      const jaEhFavorito = ehFavorito(providerId)

      console.log("[v0] Toggling favorite:", providerId, jaEhFavorito ? "remove" : "add")

      if (jaEhFavorito) {
        await removerFavorito(clientId, providerId)
        setFavoritos((prev) => prev.filter((id) => id !== providerId))
      } else {
        await adicionarFavorito(clientId, providerId)
        setFavoritos((prev) => [...prev, providerId])
      }
    } catch (error: any) {
      console.error("[v0] Toggle favorite error:", error)
      setErro(error.message)
      throw error
    }
  }

  return {
    favoritos,
    ehFavorito,
    alternarFavorito,
    carregando,
    erro,
  }
}
