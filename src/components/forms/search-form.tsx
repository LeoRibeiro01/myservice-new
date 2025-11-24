"use client"

import type React from "react"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChangeEvent } from "react";

interface SearchFormProps {
  onSearch?: (searchTerm: string, location: string) => void
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchTerm, location)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Que serviço você precisa?"
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Sua localização"
            value={location}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        <Button type="submit" className="w-full h-12 text-lg">
          Buscar Profissionais
        </Button>
      </div>
    </form>
  )
}
