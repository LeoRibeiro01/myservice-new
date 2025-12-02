"use client"

// Hook de chat em tempo real seguindo a especificação RF015

import { useState, useEffect } from "react"
import { obterOuCriarConversa, obterConversasUsuario, enviarMensagem, inscreverEmMensagens } from "@/lib/firestore"
import type { Conversa, Mensagem } from "@/types/firestore"

interface UseChatReturn {
  conversas: Conversa[]
  mensagens: Mensagem[]
  carregando: boolean
  erro: string | null
  iniciarConversa: (clientId: string, providerId: string, serviceId?: string) => Promise<string>
  enviar: (texto: string) => Promise<void>
  selecionarConversa: (conversaId: string) => void
  conversaAtual: string | null
}

export function useChatReal(userId: string, tipoUsuario: "client" | "provider"): UseChatReturn {
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [conversaAtual, setConversaAtual] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Carregar lista de conversas do usuário
  useEffect(() => {
    if (!userId) return

    const carregarConversas = async () => {
      try {
        setCarregando(true)
        console.log("[v0] Loading conversations for:", userId, tipoUsuario)

        const dados = await obterConversasUsuario(userId, tipoUsuario)
        console.log("[v0] Conversations loaded:", dados.length)
        setConversas(dados)
      } catch (error: any) {
        console.error("[v0] Load conversations error:", error)
        setErro(error.message)
      } finally {
        setCarregando(false)
      }
    }

    carregarConversas()
  }, [userId, tipoUsuario])

  // Inscrever nas mensagens da conversa atual em tempo real
  useEffect(() => {
    if (!conversaAtual) {
      setMensagens([])
      return
    }

    console.log("[v0] Subscribing to messages for conversation:", conversaAtual)

    // Listener em tempo real
    const unsubscribe = inscreverEmMensagens(conversaAtual, (novasMensagens) => {
      console.log("[v0] Messages updated:", novasMensagens.length)
      setMensagens(novasMensagens)
    })

    return unsubscribe
  }, [conversaAtual])

  const iniciarConversa = async (clientId: string, providerId: string, serviceId?: string): Promise<string> => {
    try {
      setErro(null)
      console.log("[v0] Starting/getting conversation:", {
        clientId,
        providerId,
        serviceId,
      })

      // Verifica se já existe ou cria nova conversa
      const conversaId = await obterOuCriarConversa(clientId, providerId, serviceId)
      console.log("[v0] Conversation ID:", conversaId)

      setConversaAtual(conversaId)
      return conversaId
    } catch (error: any) {
      console.error("[v0] Start conversation error:", error)
      setErro(error.message)
      throw error
    }
  }

  const enviar = async (texto: string): Promise<void> => {
    if (!conversaAtual || !texto.trim()) return

    try {
      setErro(null)
      console.log("[v0] Sending message:", texto.substring(0, 50))

      await enviarMensagem(conversaAtual, userId, texto)
      console.log("[v0] Message sent successfully")
    } catch (error: any) {
      console.error("[v0] Send message error:", error)
      setErro(error.message)
      throw error
    }
  }

  const selecionarConversa = (conversaId: string) => {
    console.log("[v0] Selecting conversation:", conversaId)
    setConversaAtual(conversaId)
  }

  return {
    conversas,
    mensagens,
    carregando,
    erro,
    iniciarConversa,
    enviar,
    selecionarConversa,
    conversaAtual,
  }
}
