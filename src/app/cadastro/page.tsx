"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Phone, User, Lock, Eye, EyeOff } from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

type UserType = "cliente" | "prestador"

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    userType: "" as UserType | "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateBasic = () => {
    if (!formData.userType) {
      setErrorMessage("Selecione o tipo de conta (Cliente ou Prestador).")
      return false
    }
    if (!formData.name.trim()) {
      setErrorMessage("Informe seu nome completo.")
      return false
    }
    if (!formData.email.trim()) {
      setErrorMessage("Informe um e-mail válido.")
      return false
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMessage("Senha deve ter ao menos 6 caracteres.")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("As senhas não coincidem.")
      return false
    }
    // phone is optional but we can require basic digits if present
    if (formData.phone && formData.phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Telefone inválido.")
      return false
    }
    setErrorMessage(null)
    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateBasic()) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      // cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      )
      const user = userCredential.user

      // cria o documento básico no Firestore (coleção "users")
      const userDocRef = doc(db, "users", user.uid)
      const userData = {
        uid: user.uid,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        type: formData.userType,
        createdAt: serverTimestamp()
      }

      await setDoc(userDocRef, userData)

      // redirecionamento:
      if (formData.userType === "prestador") {
        // redireciona para a tela de cadastro de prestador para completar (passa uid)
        router.push(`/cadastro/prestador?uid=${user.uid}`)
      } else {
        // cliente -> dashboard
        router.push("/dashboard/cliente")
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error)
      // mensagens amigáveis por código
      if (error?.code === "auth/email-already-in-use") {
        // Não podemos vincular automaticamente a conta existente sem credenciais.
        setErrorMessage(
          "Este e-mail já está em uso. Faça login ou recupere a senha. " +
            "Se você já criou conta e não completou o cadastro de prestador, entre com o mesmo e-mail e senha ou use 'Esqueci a senha'."
        )
      } else if (error?.code === "auth/invalid-email") {
        setErrorMessage("E-mail inválido.")
      } else if (error?.code === "auth/weak-password") {
        setErrorMessage("Senha fraca. Use ao menos 6 caracteres.")
      } else {
        setErrorMessage(error?.message || "Erro ao criar conta. Tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-indigo-600">
            MyService
          </Link>
          <p className="text-gray-600 mt-2">Crie sua conta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>Preencha os dados abaixo para criar sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* TIPO DE CONTA */}
              <div className="space-y-3">
                <Label>Tipo de conta</Label>
                <RadioGroup
                  value={formData.userType}
                  onValueChange={(value) => handleInputChange("userType", value as string)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cliente" id="cliente" />
                    <Label htmlFor="cliente">Cliente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prestador" id="prestador" />
                    <Label htmlFor="prestador">Prestador de Serviço</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* NOME */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* TELEFONE */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* SENHA */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    aria-label="Alternar visibilidade da senha"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* CONFIRMAR SENHA */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    aria-label="Alternar visibilidade da confirmação de senha"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* ERROS */}
              {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{" "}
                  <Link href="/auth/login" className="text-indigo-600 hover:underline">
                    Faça login
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
