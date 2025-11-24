"use client"

import { useState } from "react"
import { ChangeEvent } from "react";
import {
  Calendar,
  MessageCircle,
  Star,
  TrendingUp,
  Users,
  Clock,
  Bell,
  Settings,
  LogOut,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

const upcomingBookings = [
  {
    id: 1,
    client: "Maria Santos",
    service: "Reparo de vazamento",
    date: "2024-01-25",
    time: "14:00",
    address: "Rua das Flores, 123",
    status: "confirmed",
    value: 150,
  },
  {
    id: 2,
    client: "Carlos Oliveira",
    service: "Instalação de torneira",
    date: "2024-01-26",
    time: "09:00",
    address: "Av. Paulista, 456",
    status: "pending",
    value: 120,
  },
  {
    id: 3,
    client: "Ana Costa",
    service: "Manutenção preventiva",
    date: "2024-01-28",
    time: "15:00",
    address: "Rua Augusta, 789",
    status: "confirmed",
    value: 200,
  },
]

const recentMessages = [
  {
    id: 1,
    client: "Pedro Silva",
    message: "Olá! Gostaria de agendar um serviço...",
    time: "10 min atrás",
    unread: true,
  },
  {
    id: 2,
    client: "Lucia Ferreira",
    message: "Obrigada pelo excelente trabalho!",
    time: "2 horas atrás",
    unread: false,
  },
]

const stats = {
  totalServices: 156,
  rating: 4.9,
  monthEarnings: 4250,
  pendingServices: 3,
  responseRate: 98,
}

const earnings = [
  { month: "Janeiro", value: 4250, services: 15 },
  { month: "Dezembro", value: 3800, services: 13 },
  { month: "Novembro", value: 4100, services: 14 },
]

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo, João Silva!</h1>
          <p className="text-gray-600">Gerencie seus serviços, clientes e agenda em um só lugar</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Serviços Realizados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
                </div>
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
                    <Star className="h-5 w-5 text-yellow-400 fill-current ml-1" />
                  </div>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ganhos do Mês</p>
                  <p className="text-2xl font-bold text-gray-900">R$ {stats.monthEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Serviços Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingServices}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="bookings">Agendamentos</TabsTrigger>
            <TabsTrigger value="earnings">Ganhos</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Upcoming Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Próximos Agendamentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{booking.client}</h4>
                          <p className="text-sm text-gray-600">{booking.service}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(booking.date).toLocaleDateString("pt-BR")} às {booking.time}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={booking.status === "confirmed" ? "default" : "secondary"} className="mb-2">
                            {booking.status === "confirmed" ? "Confirmado" : "Pendente"}
                          </Badge>
                          <p className="text-sm font-medium text-green-600">R$ {booking.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Mensagens Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentMessages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{message.client[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{message.client}</h4>
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
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{booking.client}</h4>
                        <p className="text-sm text-gray-600">{booking.service}</p>
                        <p className="text-sm text-gray-500 mt-1">{booking.address}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(booking.date).toLocaleDateString("pt-BR")} às {booking.time}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <Badge variant={booking.status === "confirmed" ? "default" : "secondary"} className="mb-2">
                            {booking.status === "confirmed" ? "Confirmado" : "Pendente"}
                          </Badge>
                          <p className="text-sm font-medium text-green-600">R$ {booking.value}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Histórico de Ganhos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earnings.map((earning, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{earning.month}</h4>
                        <p className="text-sm text-gray-600">{earning.services} serviços realizados</p>
                      </div>
                      <p className="text-xl font-bold text-green-600">R$ {earning.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Central de Mensagens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{message.client[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{message.client}</h4>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                        {message.unread && (
                          <Badge variant="default" className="mt-2">
                            Nova
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
