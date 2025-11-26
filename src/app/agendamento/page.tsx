"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Clock, MapPin, User, CreditCard, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ChangeEvent } from "react"
import Link from "next/link"

const providerInfo = {
  name: "João Silva",
  service: "Encanador",
  price: 80,
  avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&h=120&fit=crop&crop=face",
}

const availableSlots = [
  { date: "2024-01-20", slots: ["09:00", "10:00", "14:00", "15:00", "16:00"] },
  { date: "2024-01-21", slots: ["08:00", "09:00", "11:00", "14:00", "15:00"] },
  { date: "2024-01-22", slots: ["10:00", "11:00", "13:00", "16:00", "17:00"] },
  { date: "2024-01-23", slots: ["09:00", "10:00", "14:00", "15:00"] },
  { date: "2024-01-24", slots: ["08:00", "09:00", "10:00", "11:00", "14:00"] },
]

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [urgency, setUrgency] = useState("normal")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular agendamento
    alert("Agendamento realizado com sucesso! Você receberá uma confirmação por e-mail.")
  }

  const getAvailableSlots = (date: string) => {
    const daySlots = availableSlots.find((slot) => slot.date === date)
    return daySlots ? daySlots.slots : []
  }

  const calculateTotal = () => {
    let total = providerInfo.price
    if (urgency === "urgent") total += 30 // Taxa de urgência
    if (urgency === "emergency") total += 50 // Taxa de emergência
    return total
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href={`/provider/${providerInfo.name}`}>
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Agendar Serviço</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Selecionar Data e Horário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Escolha a data</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.date}
                        onClick={() => {
                          setSelectedDate(slot.date)
                          setSelectedTime("")
                        }}
                        className={`p-3 text-center border rounded-lg transition-colors ${
                          selectedDate === slot.date
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {new Date(slot.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(slot.date).toLocaleDateString("pt-BR", { weekday: "short" })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <Label className="text-base font-medium mb-3 block">Escolha o horário</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {getAvailableSlots(selectedDate).map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 text-center border rounded-lg transition-colors ${
                            selectedTime === time
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Endereço completo</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("address", e.target.value)}
                    placeholder="Rua, número, bairro, cidade"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="serviceType">Tipo de serviço</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="repair">Reparo</SelectItem>
                      <SelectItem value="installation">Instalação</SelectItem>
                      <SelectItem value="maintenance">Manutenção</SelectItem>
                      <SelectItem value="unclogging">Desentupimento</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Urgência</Label>
                  <RadioGroup value={urgency} onValueChange={setUrgency}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal">Normal (sem taxa adicional)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgent" id="urgent" />
                      <Label htmlFor="urgent">Urgente (+R$ 30)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="emergency" id="emergency" />
                      <Label htmlFor="emergency">Emergência 24h (+R$ 50)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="description">Descrição do problema</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descreva detalhadamente o problema ou serviço necessário"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={providerInfo.avatar || "/placeholder.svg"}
                    alt={providerInfo.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{providerInfo.name}</h3>
                    <p className="text-sm text-gray-600">{providerInfo.service}</p>
                  </div>
                </div>

                <Separator />

                {selectedDate && selectedTime && (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {new Date(selectedDate).toLocaleDateString("pt-BR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{selectedTime}</span>
                    </div>
                  </div>
                )}

                {formData.address && (
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                    <span>{formData.address}</span>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Valor base</span>
                    <span>R$ {providerInfo.price}</span>
                  </div>
                  {urgency === "urgent" && (
                    <div className="flex justify-between text-sm">
                      <span>Taxa de urgência</span>
                      <span>R$ 30</span>
                    </div>
                  )}
                  {urgency === "emergency" && (
                    <div className="flex justify-between text-sm">
                      <span>Taxa de emergência</span>
                      <span>R$ 50</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>R$ {calculateTotal()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Forma de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="cash">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Dinheiro</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix">PIX</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Cartão (débito/crédito)</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Button
              onClick={handleSubmit}
              className="w-full"
              size="lg"
              disabled={!selectedDate || !selectedTime || !formData.name || !formData.phone}
            >
              Confirmar Agendamento
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Ao confirmar, você concorda com nossos termos de serviço. O pagamento será feito diretamente ao
              profissional.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
