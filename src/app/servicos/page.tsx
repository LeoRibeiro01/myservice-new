"use client"

import { useState } from "react"
import { Search, MapPin, Filter, Star, Shield, Clock, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ChangeEvent } from "react";
import Link from "next/link"

// Atualizar as imagens dos prestadores com fotos genéricas específicas para cada profissão

const services = [
  {
    id: 1,
    name: "João Silva",
    service: "Encanador",
    rating: 4.9,
    reviews: 127,
    price: 80,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    location: "São Paulo, SP",
    verified: true,
    available: true,
    description: "Especialista em reparos hidráulicos residenciais e comerciais",
    skills: ["Vazamentos", "Instalação", "Desentupimento"],
  },
  {
    id: 2,
    name: "Maria Santos",
    service: "Faxineira",
    rating: 4.8,
    reviews: 89,
    price: 50,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    location: "São Paulo, SP",
    verified: true,
    available: false,
    description: "Limpeza residencial e comercial com produtos ecológicos",
    skills: ["Limpeza Pesada", "Organização", "Produtos Ecológicos"],
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    service: "Eletricista",
    rating: 4.7,
    reviews: 156,
    price: 90,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "São Paulo, SP",
    verified: true,
    available: true,
    description: "Instalações elétricas residenciais e industriais",
    skills: ["Instalação", "Manutenção", "Emergência 24h"],
  },
  {
    id: 4,
    name: "Ana Costa",
    service: "Designer Gráfico",
    rating: 4.9,
    reviews: 203,
    price: 120,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    location: "São Paulo, SP",
    verified: true,
    available: true,
    description: "Criação de identidade visual e materiais gráficos",
    skills: ["Logo", "Branding", "Material Impresso"],
  },
  {
    id: 5,
    name: "Pedro Almeida",
    service: "Professor Particular",
    rating: 4.6,
    reviews: 78,
    price: 60,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    location: "São Paulo, SP",
    verified: true,
    available: true,
    description: "Aulas de matemática e física para ensino médio",
    skills: ["Matemática", "Física", "Vestibular"],
  },
  {
    id: 6,
    name: "Lucia Ferreira",
    service: "Jardineiro",
    rating: 4.5,
    reviews: 45,
    price: 70,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    location: "São Paulo, SP",
    verified: false,
    available: true,
    description: "Manutenção e paisagismo de jardins residenciais",
    skills: ["Poda", "Paisagismo", "Irrigação"],
  },
]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [showFilters, setShowFilters] = useState(false)

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1]
    return matchesSearch && matchesPrice
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "reviews":
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              MyService
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/services" className="text-indigo-600 font-medium">
                Encontrar Serviços
              </Link>
              <Link href="/become-provider" className="text-gray-700 hover:text-indigo-600">
                Seja um Prestador
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
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar serviços..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Localização"
                value={location}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Melhor avaliação</SelectItem>
                <SelectItem value="price-low">Menor preço</SelectItem>
                <SelectItem value="price-high">Maior preço</SelectItem>
                <SelectItem value="reviews">Mais avaliações</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Faixa de preço: R$ {priceRange[0]} - R$ {priceRange[1]}/hora
                  </label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={200} step={10} className="w-full" />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Apenas verificados</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Disponível agora</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{sortedServices.length} profissionais encontrados</h2>
          <p className="text-gray-600">Mostrando resultados para "{searchTerm || "todos os serviços"}"</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      {service.verified && <Shield className="h-4 w-4 text-green-500 ml-2" />}
                    </div>
                    <p className="text-gray-600">{service.service}</p>
                    <div className="flex items-center mt-1">
                      {service.available ? (
                        <div className="flex items-center text-green-600">
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="text-xs">Disponível</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="text-xs">Ocupado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {service.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{service.rating}</span>
                    <span className="text-gray-500 ml-1 text-sm">({service.reviews})</span>
                  </div>
                  <span className="font-bold text-indigo-600">R$ {service.price}/hora</span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{service.location}</span>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/provider/${service.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Ver Perfil
                    </Button>
                  </Link>
                  <Link href={`/chat/${service.id}`} className="flex-1">
                    <Button className="w-full">Conversar</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum profissional encontrado com os filtros aplicados.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setPriceRange([0, 200])
              }}
              className="mt-4"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
