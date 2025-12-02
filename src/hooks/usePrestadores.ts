"use client"

import { useState, useEffect } from "react"
import { obterTodosPrestadores, obterPrestadoresPorCategoria } from "@/lib/firestore-helpers"
import type { Prestador } from "@/types/firebase"

export function usePrestadores(categoria?: string) {
  const [prestadores, setPrestadores] = useState<Prestador[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const buscarPrestadores = async () => {
      setCarregando(true)

      try {
        const dados = categoria ? await obterPrestadoresPorCategoria(categoria) : await obterTodosPrestadores()

        setPrestadores(dados)
      } catch (erro) {
        console.error("Erro ao buscar prestadores:", erro)
      } finally {
        setCarregando(false)
      }
    }

    buscarPrestadores()
  }, [categoria])

  return { prestadores, carregando }
}
