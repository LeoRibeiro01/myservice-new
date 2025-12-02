// Botão para favoritar prestador (RF016)

"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useState } from "react"

interface BotaoFavoritoProps {
  ehFavorito: boolean
  onAlternar: () => Promise<void>
  tamanho?: "sm" | "default" | "lg"
}

export function BotaoFavorito({ ehFavorito, onAlternar, tamanho = "default" }: BotaoFavoritoProps) {
  const [processando, setProcessando] = useState(false)

  const aoClicar = async () => {
    try {
      setProcessando(true)
      await onAlternar()
    } catch (error) {
      console.error("Erro ao alternar favorito:", error)
    } finally {
      setProcessando(false)
    }
  }

  return (
    <Button variant={ehFavorito ? "default" : "outline"} size={tamanho} onClick={aoClicar} disabled={processando}>
      <Heart className={`h-4 w-4 ${ehFavorito ? "fill-current" : ""}`} />
      <span className="ml-2">{ehFavorito ? "Favoritado" : "Favoritar"}</span>
    </Button>
  )
}
