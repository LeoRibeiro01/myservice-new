"use client"

import { useState, useEffect, useCallback } from "react"
import {
  criarConversa,
  enviarMensagem,
  marcarTodasMensagensComoLidas,
  definirIndicadorDigitacao,
  inscreverEmMensagens,
  obterConversasDoUsuario,
  obterUsuario,
} from "@/lib/firestore-helpers"
import type { Conversa, Mensagem, ParticipanteConversa } from "@/types/firebase"

export function useChat(idUsuarioAtual: string | undefined) {
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!idUsuarioAtual) {
      setCarregando(false)
      return
    }

    // Carregar conversas do usuário
    obterConversasDoUsuario(idUsuarioAtual).then((conversas) => {
      setConversas(conversas)
      setCarregando(false)
    })
  }, [idUsuarioAtual])

  const iniciarConversa = async (idOutroUsuario: string): Promise<string> => {
    if (!idUsuarioAtual) throw new Error("Usuário não autenticado")

    const idConversa = await criarConversa(idUsuarioAtual, idOutroUsuario)
    return idConversa
  }

  const obterParticipantesConversa = async (conversa: Conversa): Promise<ParticipanteConversa[]> => {
    const participantes: ParticipanteConversa[] = []

    for (const uid of conversa.participantes) {
      const usuario = await obterUsuario(uid)
      if (usuario) {
        participantes.push({
          uid: usuario.uid,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
        })
      }
    }

    return participantes
  }

  return {
    conversas,
    carregando,
    iniciarConversa,
    obterParticipantesConversa,
  }
}

export function useMensagensChat(idConversa: string | undefined, idUsuarioAtual: string | undefined) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [outroUsuarioDigitando, setOutroUsuarioDigitando] = useState(false)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!idConversa) {
      setCarregando(false)
      return
    }

    // Listener de mensagens em tempo real
    const desinscreverMensagens = inscreverEmMensagens(idConversa, (mensagens) => {
      setMensagens(mensagens)
      setCarregando(false)

      // Marcar mensagens como lidas
      if (idUsuarioAtual) {
        marcarTodasMensagensComoLidas(idConversa, idUsuarioAtual)
      }
    })

    return () => {
      desinscreverMensagens()
    }
  }, [idConversa, idUsuarioAtual])

  const enviar = useCallback(
    async (texto: string, urlImagem?: string) => {
      if (!idConversa || !idUsuarioAtual) return

      await enviarMensagem(idConversa, idUsuarioAtual, texto, urlImagem)
    },
    [idConversa, idUsuarioAtual],
  )

  const definirDigitacao = useCallback(
    async (estaDigitando: boolean) => {
      if (!idConversa || !idUsuarioAtual) return

      await definirIndicadorDigitacao(idConversa, idUsuarioAtual, estaDigitando)
    },
    [idConversa, idUsuarioAtual],
  )

  return {
    mensagens,
    carregando,
    enviar,
    definirDigitacao,
    outroUsuarioDigitando,
  }
}

export { useMensagensChat as useChatMessages }
