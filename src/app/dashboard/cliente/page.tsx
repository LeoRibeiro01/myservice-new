"use client"

import { ChangeEvent, useState } from "react"
import {
  Search,
  Star,
  Calendar,
  MessageCircle,
  Heart,
  Bell,
  Settings,
  User,
  LogOut,
  MapPin,
  Filter,
  Clock,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

const recentBookings = [
  {
    id: 1,
    provider: "João Silva",
    service: "Encanador",
    date: "2024-01-25",
    time: "14:00",
    status: "confirmed",
    canRate: false,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 2,
    provider: "Maria Santos",
    service: "Faxineira",
    date: "2024-01-28",
    time: "09:00",
    status: "pending",
    canRate: false,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 3,
    provider: "Carlos Oliveira",
    service: "Eletricista",
    date: "2024-01-20",
    time: "10:00",
    status: "completed",
    canRate: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
]

const favoriteProviders = [
  {
    id: 1,
    name: "João Silva",
    service: "Encanador",
    rating: 4.9,
    category: "Reparos",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Ana Costa",
    service: "Designer Gráfico",
    rating: 4.9,
    category: "Design",
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
  {
    id: 3,
    provider: "Maria Santos",
    message: "Estou a caminho!",
    time: "1 dia atrás",
    unread: true,
  },
]

const recentSearches = ["Encanador", "Eletricista", "Faxineira"]

const recommendations = [
  {
    id: 5,
    name: "Pedro Almeida",
    service: "Encanador",
    rating: 4.8,
    price: "R$ 80-120/h",
    distance: "2.3 km",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "Julia Fernandes",
    service: "Faxineira",
    rating: 4.7,
    price: "R$ 50-80/h",
    distance: "1.5 km",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
  },
]

const notifications = [
  { id: 1, type: "booking", message: "Agendamento confirmado para amanhã", time: "5 min atrás", read: false },
  { id: 2, type: "message", message: "Nova mensagem de João Silva", time: "10 min atrás", read: false },
  { id: 3, type: "promotion", message: "Desconto de 20% em serviços de limpeza", time: "2 horas atrás", read: true },
  { id: 4, type: "rating", message: "Avalie seu último serviço", time: "1 dia atrás", read: false },
]

export default function ClientDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [maxDistance, setMaxDistance] = useState(10)
  const [minRating, setMinRating] = useState(0)
  const [availableToday, setAvailableToday] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

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
              <Popover open={showNotifications} onOpenChange={setShowNotifications}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notificações</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${!notif.read ? "bg-blue-50" : ""}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                          {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t">
                    <Button variant="ghost" size="sm" className="w-full">
                      Ver todas
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
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

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar serviços ou prestadores..."
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                  {searchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        <div className="text-xs text-gray-500 px-2 py-1">Sugestões</div>
                        {recentSearches
                          .filter((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map((search, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSearchTerm(search)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                            >
                              <Clock className="h-3 w-3 inline mr-2 text-gray-400" />
                              {search}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="lg" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Link href="/servicos">
                  <Button size="lg">Buscar</Button>
                </Link>
              </div>

              {showFilters && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="reparos">Reparos</SelectItem>
                        <SelectItem value="limpeza">Limpeza</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="beleza">Beleza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Faixa de Preço (R$/hora)</Label>
                    <div className="pt-2">
                      <Slider
                        min={0}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>R$ {priceRange[0]}</span>
                        <span>R$ {priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Distância máxima (km)</Label>
                    <div className="pt-2">
                      <Slider
                        min={1}
                        max={50}
                        step={1}
                        value={[maxDistance]}
                        onValueChange={(v) => setMaxDistance(v[0])}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-600 mt-1">{maxDistance} km</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Avaliação mínima</Label>
                    <Select value={minRating.toString()} onValueChange={(v) => setMinRating(Number(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Todas</SelectItem>
                        <SelectItem value="3">3+ estrelas</SelectItem>
                        <SelectItem value="4">4+ estrelas</SelectItem>
                        <SelectItem value="4.5">4.5+ estrelas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="available-today" checked={availableToday} onCheckedChange={setAvailableToday} />
                    <Label htmlFor="available-today">Disponível hoje</Label>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Buscas recentes:</span>
                {recentSearches.map((search, idx) => (
                  <Button key={idx} variant="outline" size="sm" onClick={() => setSearchTerm(search)}>
                    {search}
                  </Button>
                ))}
              </div>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {recentMessages.filter((m) => m.unread).length}
                    <span className="text-sm text-gray-500 ml-1">não lidas</span>
                  </p>
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

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recomendados para Você
              </CardTitle>
              <Link href="/services">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <img
                    src={provider.image || "/placeholder.svg"}
                    alt={provider.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{provider.name}</h4>
                    <p className="text-sm text-gray-600">{provider.service}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{provider.rating}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {provider.distance}
                      </div>
                      <span className="text-sm font-medium text-indigo-600">{provider.price}</span>
                    </div>
                  </div>
                  <Link href={`/provider/${provider.id}`}>
                    <Button size="sm">Ver</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Agenda</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="messages">
              Mensagens
              {recentMessages.filter((m) => m.unread).length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {recentMessages.filter((m) => m.unread).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meus Agendamentos</CardTitle>
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
                      <div className="flex items-center gap-2">
                       <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "completed"
                                ? "secondary"
                                : "destructive" // aqui ao invés de "outline"
                          }
                          className="mb-2"
                        >
                          {booking.status === "confirmed" ? "Confirmado" : booking.status === "completed" ? "Concluído" : "Pendente"}
                        </Badge>


                        {booking.status === "confirmed" && (
                          <>
                            <Button variant="outline" size="sm">
                              Reagendar
                            </Button>
                            <Button variant="outline" size="sm">
                              Cancelar
                            </Button>
                          </>
                        )}

                        {booking.canRate && (
                          <Button size="sm" variant="default">
                            <Star className="h-4 w-4 mr-1" />
                            Avaliar
                          </Button>
                        )}

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

            <Card>
              <CardHeader>
                <CardTitle>Visualização de Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Visualização de calendário em desenvolvimento</p>
                  <p className="text-sm mt-1">
                    Em breve você poderá ver todos os seus agendamentos em um calendário interativo
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profissionais Favoritos</CardTitle>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas categorias</SelectItem>
                      <SelectItem value="reparos">Reparos</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="limpeza">Limpeza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                        <Badge variant="secondary" className="mt-1">
                            {provider.category}
                          </Badge>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{provider.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href={`/chat/${provider.id}`}>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </Link>
                        <Link href={`/provider/${provider.id}`}>
                          <Button size="sm" className="w-full">
                            Ver Perfil
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Mensagens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <Link key={message.id} href={`/chat/${message.id}`}>
                      <div
                        className={`flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${message.unread ? "bg-blue-50 border-blue-200" : ""}`}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{message.provider[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium text-sm ${message.unread ? "text-blue-900" : ""}`}>
                              {message.provider}
                            </h4>
                            <span className="text-xs text-gray-500">{message.time}</span>
                          </div>
                          <p
                            className={`text-sm mt-1 ${message.unread ? "text-blue-800 font-medium" : "text-gray-600"}`}
                          >
                            {message.message}
                          </p>
                          {message.unread && (
                            <Badge variant="default" className="mt-2">
                              Nova
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <div className="space-y-6">
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

              <Card>
                <CardHeader>
                  <CardTitle>Preferências</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Localização</Label>
                      <div className="flex gap-2">
                        <Input defaultValue="São Paulo, SP" />
                        <Button variant="outline">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Categorias de Interesse</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Reparos", "Limpeza", "Design", "Beleza", "Tecnologia"].map((cat) => (
                          <Badge key={cat} variant="secondary" className="cursor-pointer hover:bg-indigo-50">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Notificações</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Agendamentos</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Mensagens</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Promoções</span>
                        <Switch />
                      </div>
                    </div>

                    <Button>Salvar Preferências</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
