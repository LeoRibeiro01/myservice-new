"use client"

import { useState, ChangeEvent } from "react"
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    // 🚨 Firebase não está pronto no SSR
    if (!auth || !db) {
      setErrorMessage("Erro interno: Firebase não carregou.")
      setIsLoading(false)
      return
    }

    try {
      // LOGIN
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // PERFIL NO FIRESTORE
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        setErrorMessage("Perfil não encontrado. Contate o suporte.")
        setIsLoading(false)
        return
      }

      const data = userSnap.data()

      router.push(
        data.type === "prestador"
          ? "/dashboard/prestador"
          : "/dashboard/cliente"
      )

    } catch (error: any) {
      console.error(error)

      let msg = "Erro ao entrar."

      if (error.code === "auth/invalid-email") msg = "E-mail inválido."
      if (error.code === "auth/user-not-found") msg = "Usuário não encontrado."
      if (error.code === "auth/wrong-password") msg = "Senha incorreta."
      if (error.code === "auth/too-many-requests") msg = "Muitas tentativas. Tente novamente mais tarde."

      setErrorMessage(msg)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 drop-shadow-sm">
          <Link href="/" className="text-4xl font-extrabold text-indigo-700 tracking-tight">
            MyService
          </Link>
          <p className="text-gray-600 mt-2">Acesse sua conta para continuar</p>
        </div>

        <Card className="shadow-xl border-none backdrop-blur bg-white/80">
          <CardHeader>
            <CardTitle className="text-lg">Fazer Login</CardTitle>
            <CardDescription>Acesse com seu e-mail e senha</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* EMAIL */}
              <div className="space-y-2">
                <Label>E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* SENHA */}
              <div className="space-y-2">
                <Label>Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="text-red-600 text-sm animate-fade-in">{errorMessage}</p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 text-md font-medium tracking-wide shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <Separator className="my-6" />

            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link href="/auth/register" className="text-indigo-600 hover:underline font-medium">
                Cadastre-se
              </Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
