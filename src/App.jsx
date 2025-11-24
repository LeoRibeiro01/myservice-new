"use client"

import { useState } from "react"
import { Search, MapPin, Star, Users, Shield, Zap } from "lucide-react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
//import Link from "next/link"


const popularServices = [
  "Encanador",
  "Eletricista",
  "Pintor",
  "Faxineira",
  "Professor Particular",
  "Designer Gráfico",
  "Jardineiro",
  "Mecânico",
  "Cozinheiro",
  "Fotógrafo",
]

const featuredProviders = [
  {
    id: 1,
    name: "João Silva",
    service: "Encanador",
    rating: 4.9,
    reviews: 127,
    price: "R$ 80/hora",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    location: "São Paulo, SP",
    verified: true,
  },
  {
    id: 2,
    name: "Maria Santos",
    service: "Faxineira",
    rating: 4.8,
    reviews: 89,
    price: "R$ 50/hora",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    location: "Rio de Janeiro, RJ",
    verified: true,
  },
  {
    id: 4,
    name: "Ana Costa",
    service: "Designer Gráfico",
    rating: 4.9,
    reviews: 203,
    price: "R$ 120/hora",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    location: "São Paulo, SP",
    verified: true,
  },
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">MyService</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/services" className="text-gray-700 hover:text-indigo-600">
                Encontrar Serviços
              </a>
              <a href="/become-provider" className="text-gray-700 hover:text-indigo-600">
                Seja um Prestador
              </a>
              <a href="/how-it-works" className="text-gray-700 hover:text-indigo-600">
                Como Funciona
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <a href="/auth/login">
                <Button variant="ghost">Entrar</Button>
              </a>
              <a href="/auth/register">
                <Button>Cadastrar</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Encontre o <span className="text-indigo-600">profissional ideal</span> para você
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Conecte-se com prestadores de serviço qualificados da sua região de forma rápida e segura
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Que serviço você precisa?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Sua localização"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <a href="/services">
                <Button className="w-full h-12 text-lg">Buscar Profissionais</Button>
              </a>
            </div>
          </div>

          {/* Popular Services */}
          <div className="mb-16">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Serviços populares:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {popularServices.map((service) => (
                <Badge key={service} variant="secondary" className="px-4 py-2 cursor-pointer hover:bg-indigo-100">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher o MyService?</h3>
            <p className="text-xl text-gray-600">A plataforma mais rápida e segura para encontrar profissionais</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Velocidade</h4>
              <p className="text-gray-600">Encontre profissionais em segundos com nossa busca inteligente</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Segurança</h4>
              <p className="text-gray-600">Todos os profissionais são verificados e avaliados por clientes reais</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Comunicação</h4>
              <p className="text-gray-600">Chat em tempo real para negociar diretamente com o profissional</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Profissionais em destaque</h3>
            <p className="text-xl text-gray-600">Conheça alguns dos nossos melhores prestadores de serviço</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={provider.image || "/placeholder.svg"}
                      alt={provider.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-semibold text-lg">{provider.name}</h4>
                        {provider.verified && <Shield className="h-4 w-4 text-green-500 ml-2" />}
                      </div>
                      <p className="text-gray-600">{provider.service}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{provider.rating}</span>
                      <span className="text-gray-500 ml-1">({provider.reviews} avaliações)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{provider.location}</span>
                    </div>
                    <span className="font-semibold text-indigo-600">{provider.price}</span>
                  </div>

                  <div className="flex space-x-2">
                    <a href={`/provider/${provider.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Ver Perfil
                      </Button>
                    </a>
                    <a href={`/chat/${provider.id}`} className="flex-1">
                      <Button className="w-full">Conversar</Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">Pronto para começar?</h3>
          <p className="text-xl text-indigo-100 mb-8">
            Junte-se a milhares de pessoas que já encontraram o profissional ideal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/auth/register">
              <Button size="lg" variant="secondary" className="px-8">
                Encontrar Profissionais
              </Button>
            </a>
            <a href="/become-provider">
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-white border-white hover:bg-white hover:text-indigo-600"
              >
                Oferecer Serviços
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">MyService</h4>
              <p className="text-gray-400">A plataforma que conecta você aos melhores profissionais da sua região.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Para Clientes</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/services">Encontrar Serviços</a>
                </li>
                <li>
                  <a href="/how-it-works">Como Funciona</a>
                </li>
                <li>
                  <a href="/safety">Segurança</a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Para Profissionais</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/become-provider">Seja um Prestador</a>
                </li>
                <li>
                  <a href="/pricing">Preços</a>
                </li>
                <li>
                  <a href="/resources">Recursos</a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Suporte</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/help">Central de Ajuda</a>
                </li>
                <li>
                  <a href="/contact">Contato</a>
                </li>
                <li>
                  <a href="/terms">Termos de Uso</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MyService. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
