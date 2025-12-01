"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import {
  Search, MapPin, Filter, Star, Shield, Clock, ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { getAllProviders, Provider } from "@/services/firebase-service"

import { db, auth } from "@/lib/firebase"
import {
  collection, doc, query, where,
  getDocs, setDoc, serverTimestamp,
  addDoc
} from "firebase/firestore"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"

// -------------------------------------------------------------------
// FUNÇÃO GET OR CREATE CHAT — VERSÃO CORRETA
// -------------------------------------------------------------------
async function getOrCreateChat(currentUid: string, otherUid: string) {
  if (!currentUid || !otherUid) return null
  if (currentUid === otherUid) return null // impede conversar com si mesmo

  const chatsRef = collection(db, "chats")

  // 1) procurar chats onde currentUid participa
  const q = query(chatsRef, where("participants", "array-contains", currentUid))
  const snap = await getDocs(q)

  // 2) verificar se existe chat com os dois
  for (const docSnap of snap.docs) {
    const data = docSnap.data()
    if (Array.isArray(data.participants) && data.participants.includes(otherUid)) {
      return docSnap.id
    }
  }

  // 3) criar chat corretamente (ID AUTOMÁTICO)
  const newChatRef = await addDoc(chatsRef, {
    participants: [currentUid, otherUid],
    createdAt: serverTimestamp(),
  })

  return newChatRef.id
}


// -------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------------------

export default function ServicesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [showFilters, setShowFilters] = useState(false)
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<FirebaseUser | null>(null)

  // ---------------------- AUTENTICAÇÃO ----------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => unsub()
  }, [])

  // ---------------------- BUSCAR PRESTADORES ----------------------
  useEffect(() => {
    async function fetchProviders() {
      const data = await getAllProviders()
      setProviders(data)
      setLoading(false)
    }
    fetchProviders()
  }, [])

  // ---------------------- FILTROS ----------------------
  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.serviceCategory?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPrice =
      (provider.price || 0) >= priceRange[0] &&
      (provider.price || 0) <= priceRange[1]

    return matchesSearch && matchesPrice
  })

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "price-low":
        return (a.price || 0) - (b.price || 0)
      case "price-high":
        return (b.price || 0) - (a.price || 0)
      case "reviews":
        return (b.reviews || 0) - (a.reviews || 0)
      default:
        return 0
    }
  })

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>

  // ---------------------- INICIAR CHAT ----------------------
  const handleStartChat = async (providerId: string) => {
    if (!user) {
      alert("Você precisa estar logado para conversar")
      return
    }

    try {
      const chatId = await getOrCreateChat(user.uid, providerId)
      router.push(`/chats/${chatId}`)
    } catch (err) {
      console.error("Erro ao iniciar chat:", err)
      alert("Não foi possível iniciar o chat.")
    }
  }

  // -------------------------------------------------------------------
  // INTERFACE
  // -------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Search e filtros */}
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
            <label className="block text-sm font-medium mb-2">
              Faixa de preço: R$ {priceRange[0]} - R$ {priceRange[1]}/hora
            </label>
            <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="w-full" />
          </div>
        )}
      </div>

      {/* Lista de prestadores */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={provider.image || "/placeholder.svg"}
                  alt={provider.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />

                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-lg">{provider.name}</h3>
                    {provider.verified && <Shield className="h-4 w-4 text-green-500 ml-2" />}
                  </div>

                  <p className="text-gray-600">{provider.serviceCategory}</p>

                  <div className="flex items-center mt-1">
                    {provider.available ? (
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

              <p className="text-gray-600 text-sm mb-4">{provider.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{provider.rating || 0}</span>
                  <span className="text-gray-500 ml-1 text-sm">({provider.reviews || 0})</span>
                </div>

                <span className="font-bold text-indigo-600">R$ {provider.price || 0}/hora</span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{provider.location || "Não informado"}</span>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/prestador/${provider.id}`)}
                >
                  Ver Perfil
                </Button>

                <Button onClick={() => handleStartChat(provider.uid)}>
                  Conversar
                </Button>

              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedProviders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum profissional encontrado com os filtros aplicados.</p>
          <Button onClick={() => setSearchTerm("")} className="mt-4">
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
