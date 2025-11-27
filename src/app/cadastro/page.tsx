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
import { FieldValue } from "firebase/firestore"

import { UserRegisterData } from "@/types/user"

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    userType: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem.")
      return
    }

    if (!formData.userType) {
      alert("Selecione o tipo de conta.")
      return
    }

    try {
      setIsLoading(true)

      // Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      const user = userCredential.user

      // Dados enviados ao Firestore
        const userData: UserRegisterData = {
      uid: user.uid,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: formData.userType as "cliente" | "prestador",
      createdAt: new Date().toISOString() // ou new Date()
    }


      // Envia para a coleção "users"
      await setDoc(doc(db, "users", user.uid), userData)

      // Redirecionamento por tipo de conta
      router.push(
        formData.userType === "cliente"
          ? "/dashboard/cliente"
          : "/dashboard/prestador"
      )

    } catch (error: any) {
      console.error("Erro ao criar conta:", error)
      alert(error.message || "Erro ao criar conta.")
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
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* TIPO DE CONTA */}
              <div className="space-y-3">
                <Label>Tipo de conta</Label>
                <RadioGroup
                  value={formData.userType}
                  onValueChange={(value) => handleInputChange("userType", value)}
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
                    required
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
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* TERMOS */}
              <div className="flex items-center space-x-2">
                <input id="terms" type="checkbox" className="rounded border-gray-300" required />
                <Label htmlFor="terms" className="text-sm">
                  Aceito os{" "}
                  <Link href="/terms" className="text-indigo-600 hover:underline">
                    termos de uso
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacy" className="text-indigo-600 hover:underline">
                    política de privacidade
                  </Link>
                </Label>
              </div>

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
