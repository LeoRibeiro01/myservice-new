"use client"

import { ChangeEvent, useState, useEffect } from "react"
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
  Search,
  Filter,
  Heart,
  Award,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { getFirestore, collection, query, where, getDocs, orderBy, limit, Timestamp } from "firebase/firestore"
import firebaseApp from "@/lib/firebase" // seu initFirebase
import { getAuth } from "firebase/auth"


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

const favoriteProviders = [
  { id: 1, name: "Carlos Eletricista", category: "Elétrica", rating: 4.8, phone: "(11) 98765-4321" },
  { id: 2, name: "Ana Pintora", category: "Pintura", rating: 4.9, phone: "(11) 91234-5678" },
]

const recentReviews = [
  {
    id: 1,
    client: "Maria Santos",
    rating: 5,
    comment: "Excelente profissional! Muito caprichoso e pontual.",
    date: "2024-01-20",
  },
  {
    id: 2,
    client: "Pedro Silva",
    rating: 4,
    comment: "Bom trabalho, mas poderia ser mais rápido.",
    date: "2024-01-18",
  },
]

const notifications = [
  { id: 1, type: "booking", message: "Novo agendamento de Maria Santos", time: "5 min atrás", read: false },
  { id: 2, type: "payment", message: "Pagamento de R$ 150 confirmado", time: "1 hora atrás", read: false },
  { id: 3, type: "review", message: "Nova avaliação de Carlos Oliveira", time: "3 horas atrás", read: true },
]

const calendarDays = [
  { date: "2024-01-22", bookings: [] },
  { date: "2024-01-23", bookings: [] },
  { date: "2024-01-24", bookings: [] },
  { date: "2024-01-25", bookings: [{ time: "14:00", client: "Maria Santos", service: "Reparo de vazamento" }] },
  { date: "2024-01-26", bookings: [{ time: "09:00", client: "Carlos Oliveira", service: "Instalação de torneira" }] },
  { date: "2024-01-27", bookings: [] },
  { date: "2024-01-28", bookings: [{ time: "15:00", client: "Ana Costa", service: "Manutenção preventiva" }] },
]

// tipagem para mensagens reais vindas do banco
interface Message {
  id: string
  chatId: string
  client: string
  message: string
  time: number
  unread: boolean
}

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)

  // **estado só para mensagens reais**
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    async function fetchMessages() {
      const db = getFirestore(firebaseApp)
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) return

      try {
        // pega chats onde o usuário participa
        const chatsQuery = query(
          collection(db, "chats"),
          where("participants", "array-contains", user.uid)
        )
        const chatsSnap = await getDocs(chatsQuery)

        const msgs: Message[] = []

        for (const chatDoc of chatsSnap.docs) {
          const messagesSnap = await getDocs(
            query(
              collection(db, "chats", chatDoc.id, "messages"),
              orderBy("createdAt", "desc"),
              limit(20)
            )
          )

          messagesSnap.forEach((msgDoc) => {
            const data = msgDoc.data()
            const createdAt = data.createdAt as Timestamp
            msgs.push({
              id: msgDoc.id,
              chatId: chatDoc.id,
              client: data.senderName || "Cliente",
              message: data.text,
              time: createdAt.toDate().getTime(),
              unread: data.unread || false,
            })
          })
        }

        // ordena por data mais recente
        msgs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        setMessages(msgs)
      } catch (err) {
        console.error("Falha ao buscar mensagens:", err)
      }
    }

    fetchMessages()
  }, [])

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
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold">Notificações</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b hover:bg-gray-50 ${!notif.read ? "bg-indigo-50" : ""}`}
                        >
                          <p className="text-sm font-medium">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats.monthEarnings.toFixed(2).replace('.', ',')}
                  </p>
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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
            <TabsTrigger value="earnings">Financeiro</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar serviços ou prestadores..."
                      value={searchQuery}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas categorias</SelectItem>
                        <SelectItem value="plumbing">Encanamento</SelectItem>
                        <SelectItem value="electric">Elétrica</SelectItem>
                        <SelectItem value="painting">Pintura</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Distância" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Qualquer</SelectItem>
                        <SelectItem value="5km">Até 5km</SelectItem>
                        <SelectItem value="10km">Até 10km</SelectItem>
                        <SelectItem value="20km">Até 20km</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Mais filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

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

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Agenda Inteligente
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">Janeiro 2024</span>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-24 p-2 border rounded-lg ${
                        day.bookings.length > 0 ? "bg-indigo-50 border-indigo-200" : "bg-white"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{new Date(day.date).getDate()}</div>
                      {day.bookings.map((booking, i) => (
                        <div key={i} className="text-xs bg-indigo-600 text-white rounded p-1 mb-1">
                          <div className="font-medium">{booking.time}</div>
                          <div className="truncate">{booking.client}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Financeiro Detalhado
                    </CardTitle>
                    <Select defaultValue="3months">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">Último mês</SelectItem>
                        <SelectItem value="3months">Últimos 3 meses</SelectItem>
                        <SelectItem value="6months">Últimos 6 meses</SelectItem>
                        <SelectItem value="year">Último ano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Total Ganhos</p>
                        <p className="text-2xl font-bold text-green-600">R$ 12.150</p>
                        <p className="text-xs text-gray-500 mt-1">+15% vs período anterior</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Serviços Realizados</p>
                        <p className="text-2xl font-bold">42</p>
                        <p className="text-xs text-gray-500 mt-1">Média: R$ 289/serviço</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Taxa de Resposta</p>
                        <p className="text-2xl font-bold">{stats.responseRate}%</p>
                        <p className="text-xs text-gray-500 mt-1">Excelente performance!</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Histórico Mensal
                    </h3>
                    {earnings.map((earning, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{earning.month}</h4>
                          <p className="text-sm text-gray-600">{earning.services} serviços realizados</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(earning.value / 5000) * 100}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-xl font-bold text-green-600 ml-4">R$ {earning.value.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

 <TabsContent value="messages">
  <Card>
    <CardHeader>
      <CardTitle>Central de Mensagens</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
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
          ))
        ) : (
          <p className="text-sm text-gray-500">Nenhuma mensagem disponível</p>
        )}
      </div>
    </CardContent>
  </Card>
</TabsContent>



          <TabsContent value="reviews">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Avaliações e Reputação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Avaliação Geral</p>
                            <div className="flex items-center mt-1">
                              <p className="text-3xl font-bold">{stats.rating}</p>
                              <Star className="h-6 w-6 text-yellow-400 fill-current ml-1" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Total de Avaliações</p>
                        <p className="text-3xl font-bold">127</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Recomendações</p>
                        <p className="text-3xl font-bold">98%</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Avaliações Recentes</h3>
                    {recentReviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{review.client}</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Prestadores Favoritos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {favoriteProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{provider.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{provider.name}</h4>
                          <p className="text-sm text-gray-600">{provider.category}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">{provider.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contatar
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        </Button>
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
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Perfil e Configurações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-2xl">JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">João Silva</h3>
                      <p className="text-gray-600">Encanador Profissional</p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Editar Foto
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nome Completo</label>
                      <Input defaultValue="João Silva" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input defaultValue="joao.silva@email.com" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Telefone</label>
                      <Input defaultValue="(11) 98765-4321" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Serviços Oferecidos</label>
                      <Input defaultValue="Encanamento, Reparos hidráulicos, Instalação" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Valor por Hora</label>
                      <Input defaultValue="R$ 80,00" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Disponibilidade</label>
                      <Select defaultValue="full-time">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Tempo integral</SelectItem>
                          <SelectItem value="part-time">Meio período</SelectItem>
                          <SelectItem value="weekends">Fins de semana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="w-full">Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


