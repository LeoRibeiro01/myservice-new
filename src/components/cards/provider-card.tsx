import Link from "next/link"
import { Star, MapPin, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface Provider {
  id: number
  name: string
  service: string
  rating: number
  reviews: number
  price: string
  image: string
  location: string
  verified: boolean
}

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
          <Link href={`/provider/${provider.id}`} className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Ver Perfil
            </Button>
          </Link>
          <Link href={`/chat/${provider.id}`} className="flex-1">
            <Button className="w-full">Conversar</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
