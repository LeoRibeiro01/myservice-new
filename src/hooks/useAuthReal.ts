"use client"

// Hook de autenticação real com Firebase Auth

import { useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { criarUsuario, obterUsuario } from "@/lib/firestore"
import type { Usuario, TipoUsuario, Localizacao } from "@/types/firestore"

interface DadosCadastro {
  email: string
  senha: string
  nome: string
  telefone: string
  tipo: TipoUsuario
  localizacao: Localizacao
  // Campos opcionais para prestador
  especialidade?: string
  descricao?: string
  disponibilidade?: string
}

export function useAuthReal() {
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null)
  const [usuarioFirebase, setUsuarioFirebase] = useState<FirebaseUser | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // Listener de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("[v0] Auth state changed:", firebaseUser?.uid)
      setUsuarioFirebase(firebaseUser)

      if (firebaseUser) {
        // Buscar dados completos do usuário no Firestore
        const dadosUsuario = await obterUsuario(firebaseUser.uid)
        console.log("[v0] User data loaded:", dadosUsuario)
        setUsuarioAtual(dadosUsuario)
      } else {
        setUsuarioAtual(null)
      }

      setCarregando(false)
    })

    return unsubscribe
  }, [])

  const cadastrar = async (dados: DadosCadastro): Promise<void> => {
    try {
      setErro(null)
      setCarregando(true)
      console.log("[v0] Starting registration...")

      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, dados.email, dados.senha)

      console.log("[v0] Firebase user created:", userCredential.user.uid)

      // Criar documento do usuário no Firestore
      const novoUsuario: Usuario = {
        uid: userCredential.user.uid,
        type: dados.tipo,
        name: dados.nome,
        email: dados.email,
        phone: dados.telefone,
        location: dados.localizacao,
        createdAt: new Date(),
      }

      // Adicionar campos específicos de prestador
      if (dados.tipo === "provider") {
        novoUsuario.specialty = dados.especialidade
        novoUsuario.description = dados.descricao
        novoUsuario.availability = dados.disponibilidade
        novoUsuario.portfolio = []
      }

      await criarUsuario(novoUsuario)
      console.log("[v0] User document created in Firestore")

      setUsuarioAtual(novoUsuario)
    } catch (error: any) {
      console.error("[v0] Registration error:", error)
      setErro(error.message)
      throw error
    } finally {
      setCarregando(false)
    }
  }

  const entrar = async (email: string, senha: string): Promise<void> => {
    try {
      setErro(null)
      setCarregando(true)
      console.log("[v0] Starting login...")

      await signInWithEmailAndPassword(auth, email, senha)
      console.log("[v0] Login successful")
    } catch (error: any) {
      console.error("[v0] Login error:", error)
      setErro(error.message)
      throw error
    } finally {
      setCarregando(false)
    }
  }

  const sair = async (): Promise<void> => {
    try {
      setErro(null)
      console.log("[v0] Signing out...")
      await signOut(auth)
      setUsuarioAtual(null)
      console.log("[v0] Sign out successful")
    } catch (error: any) {
      console.error("[v0] Sign out error:", error)
      setErro(error.message)
      throw error
    }
  }

  return {
    usuarioAtual,
    usuarioFirebase,
    carregando,
    erro,
    cadastrar,
    entrar,
    sair,
    estaAutenticado: !!usuarioAtual,
    ehCliente: usuarioAtual?.type === "client",
    ehPrestador: usuarioAtual?.type === "provider",
    ehAdmin: usuarioAtual?.type === "admin",
  }
}
