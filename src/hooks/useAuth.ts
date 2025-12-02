"use client"

import { useState, useEffect } from "react"
import {
  type User as UsuarioFirebase,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as sairFirebase,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { criarUsuario, obterUsuario, criarPrestador, obterPrestador } from "@/lib/firestore-helpers"
import type { Usuario, Prestador } from "@/types/firebase"

export function useAuth() {
  const [usuario, setUsuario] = useState<UsuarioFirebase | null>(null)
  const [dadosUsuario, setDadosUsuario] = useState<Usuario | null>(null)
  const [dadosPrestador, setDadosPrestador] = useState<Prestador | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const desinscrever = onAuthStateChanged(auth, async (usuarioFirebase) => {
      setUsuario(usuarioFirebase)

      if (usuarioFirebase) {
        // Buscar dados do usuário no Firestore
        const docUsuario = await obterUsuario(usuarioFirebase.uid)
        setDadosUsuario(docUsuario)

        // Se for prestador, buscar dados do prestador
        if (docUsuario?.tipo === "prestador") {
          const docPrestador = await obterPrestador(usuarioFirebase.uid)
          setDadosPrestador(docPrestador)
        }
      } else {
        setDadosUsuario(null)
        setDadosPrestador(null)
      }

      setCarregando(false)
    })

    return () => desinscrever()
  }, [])

  const cadastrar = async (
    email: string,
    senha: string,
    nome: string,
    telefone: string,
    tipo: "cliente" | "prestador",
  ) => {
    const credencial = await createUserWithEmailAndPassword(auth, email, senha)

    // Atualizar displayName
    await updateProfile(credencial.user, { displayName: nome })

    // Criar documento no Firestore
    await criarUsuario(credencial.user.uid, {
      email,
      nome,
      telefone,
      tipo,
    })

    return credencial.user
  }

  const entrar = async (email: string, senha: string) => {
    const credencial = await signInWithEmailAndPassword(auth, email, senha)
    return credencial.user
  }

  const sair = async () => {
    await sairFirebase(auth)
  }

  const cadastrarPrestador = async (dadosPrestador: Omit<Prestador, "id" | "uid" | "criadoEm" | "atualizadoEm">) => {
    if (!usuario) throw new Error("Usuário não autenticado")

    await criarPrestador(usuario.uid, dadosPrestador)
  }

  return {
    usuario,
    dadosUsuario,
    dadosPrestador,
    carregando,
    cadastrar,
    entrar,
    sair,
    cadastrarPrestador,
    estaAutenticado: !!usuario,
    ehPrestador: dadosUsuario?.tipo === "prestador",
    ehCliente: dadosUsuario?.tipo === "cliente",
  }
}
