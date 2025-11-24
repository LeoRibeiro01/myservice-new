"use client"

import { useState } from "react"
import { Search, Star, Calendar, MessageCircle, Heart, Bell, Settings, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChangeEvent } from "react";
import Link from "next/link"

const recentBookings = [
  {
    id: 1,
    provider: "João Silva",
    service: "Encanador",
    date: "2024-01-25",
    time: "14:00",
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 2,
    provider: "Maria Santos",
    service: "Faxineira",
    date: "2024-01-28",
    time: "09:00",
    status: "pending",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face",
  },
]

const favoriteProviders = [
  {
    id: 1,
    name: "João Silva",
    service: "Encanador",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Ana Costa",
    service: "Designer Gráfico",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face",
  },
]

const recentMessages = [
  {
    id: 1,
    provider: "João Silva",
    message: "Confirmo presença para amanhã às 14h!",
    time: "10 min atrás",
    unread: true,
  },
  {
    id: 2,
    provider: "Carlos Oliveira",
    message: "Obrigado pela preferência!",
    time: "2 horas atrás",
    unread: false,
  },
]

export default function ClientDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              MyService
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-600">Encontre os melhores profissionais para suas necessidades</p>
        </div>

        {/* Quick Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar serviços..."
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Link href="/services">
                <Button size="lg">Buscar Profissionais</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Agendamentos</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mensagens</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Favoritos</p>
                  <p className="text-2xl font-bold text-gray-900">{favoriteProviders.length}</p>
                </div>
                <Heart className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avaliações</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Agendamentos</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.provider}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium">{booking.provider}</h4>
                          <p className="text-sm text-gray-600">{booking.service}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(booking.date).toLocaleDateString("pt-BR")} às {booking.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                          {booking.status === "confirmed" ? "Confirmado" : "Pendente"}
                        </Badge>
                        <Link href={`/chat/${booking.id}`}>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Profissionais Favoritos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {favoriteProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={provider.image || "/placeholder.svg"}
                        alt={provider.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{provider.name}</h4>
                        <p className="text-sm text-gray-600">{provider.service}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{provider.rating}</span>
                        </div>
                      </div>
                      <Link href={`/provider/${provider.id}`}>
                        <Button variant="outline" size="sm">
                          Ver Perfil
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Mensagens Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{message.provider[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{message.provider}</h4>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                        {message.unread && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback>
                        <User className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Alterar foto</Button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome</label>
                    <Input defaultValue="Cliente Teste" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">E-mail</label>
                    <Input defaultValue="cliente@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input defaultValue="(11) 99999-9999" />
                  </div>
                  <Button>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
