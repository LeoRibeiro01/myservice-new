"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface HeaderProps {
  variant?: "default" | "transparent"
}

export function Header({ variant = "default" }: HeaderProps) {
  return (
    <header className={`border-b ${variant === "transparent" ? "bg-transparent" : "bg-white shadow-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-indigo-600">MyService</h1>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/services" className="text-gray-700 hover:text-indigo-600">
              Encontrar Serviços
            </Link>
            <Link href="/become-provider" className="text-gray-700 hover:text-indigo-600">
              Seja um Prestador
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-indigo-600">
              Como Funciona
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}
