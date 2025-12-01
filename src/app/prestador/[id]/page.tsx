"use client"

import { useState, useEffect } from "react"
import { Star, MapPin, Shield, Clock, Calendar, MessageCircle, Heart, Share2, Camera, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { getProviderById } from "@/services/firebase-service" // função 

export default function ProviderProfilePage({ params }: { params: { id: string } }) {
  const [providerData, setProviderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const providerId = params.id

  useEffect(() => {
    async function fetchProvider() {
      const data = await getProviderById(providerId)
      setProviderData(data || null)
      setLoading(false)
    }
    fetchProvider()
  }, [providerId])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  if (!providerData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Prestador não encontrado
      </div>
    )

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
              <Link href="/services" className="text-gray-700 hover:text-indigo-600">
                Encontrar Serviços
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <img
                  src={providerData.image || "/placeholder.svg"}
                  alt={providerData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{providerData.name}</h1>
                  {providerData.verified && <Shield className="h-6 w-6 text-green-500 ml-3" />}
                </div>

                <p className="text-xl text-gray-600 mb-4">{providerData.service}</p>

                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold text-lg">{providerData.rating || "-"}</span>
                    <span className="text-gray-500 ml-1">({providerData.reviews || 0} avaliações)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{providerData.location || "Não informado"}</span>
                  </div>
                  <div className="flex items-center">
                    {providerData.available ? (
                      <div className="flex items-center text-green-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Disponível</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">Ocupado</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {(providerData.skills || []).map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="text-2xl font-bold text-indigo-600 mb-6">
                  R$ {providerData.price || "-"} /hora
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsFavorited(!isFavorited)}>
                    <Heart className={`h-4 w-4 ${isFavorited ? "fill-current text-red-500" : ""}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <Link href={`/chat/${providerData.id}`}>
                  <Button className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Conversar
                  </Button>
                </Link>
                <Link href={`/booking/${providerData.id}`}>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
            <TabsTrigger value="about">Sobre</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
            <TabsTrigger value="availability">Disponibilidade</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre o profissional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{providerData.description || "Sem descrição"}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações de contato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {providerData.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-3" />
                        <span>{providerData.phone}</span>
                      </div>
                    )}
                    {providerData.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-3" />
                        <span>{providerData.email}</span>
                      </div>
                    )}
                    {!providerData.phone && !providerData.email && <p>Não há contatos disponíveis</p>}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Portfólio de trabalhos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(providerData.portfolio || []).map((item: any) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                          <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <h3 className="mt-2 font-medium text-gray-900">{item.title}</h3>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Horários de atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(providerData.availability || {}).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium capitalize">
                        {day === "monday" && "Segunda-feira"}
                        {day === "tuesday" && "Terça-feira"}
                        {day === "wednesday" && "Quarta-feira"}
                        {day === "thursday" && "Quinta-feira"}
                        {day === "friday" && "Sexta-feira"}
                        {day === "saturday" && "Sábado"}
                        {day === "sunday" && "Domingo"}
                      </span>
                      <span className={hours === "Fechado" ? "text-gray-500" : "text-green-600"}>
                        {hours as string}
                      </span>
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
