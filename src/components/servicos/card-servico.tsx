// Card de exibição de serviço com geolocalização (RF004, RN3)

"use client"

import { Star, MapPin, Calendar } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Servico } from "@/types/firestore"
import Link from "next/link"

interface CardServicoProps {
  servico: Servico & { distancia?: number }
  onAgendar?: () => void
  onChat?: () => void
}

export function CardServico({ servico, onAgendar, onChat }: CardServicoProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <img src={servico.photos[0] || "/placeholder.svg"} alt={servico.title} className="h-full w-full object-cover" />
        {servico.distancia !== undefined && (
          <Badge className="absolute left-3 top-3 bg-white text-black">
            <MapPin className="mr-1 h-3 w-3" />
            {servico.distancia.toFixed(1)} km
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold text-lg">{servico.title}</h3>
          <Badge variant="secondary">{servico.category}</Badge>
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{servico.description}</p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{servico.ratingAverage.toFixed(1)}</span>
            <span className="text-muted-foreground">({servico.ratingCount})</span>
          </div>

          <div className="font-semibold text-primary">R$ {servico.price.toFixed(2)}</div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 border-t p-4">
        <Button asChild variant="outline" className="flex-1 bg-transparent">
          <Link href={`/servicos/${servico.id}`}>Ver Detalhes</Link>
        </Button>

        {servico.acceptsScheduling && onAgendar && (
          <Button onClick={onAgendar} className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            Agendar
          </Button>
        )}

        {onChat && (
          <Button onClick={onChat} variant="secondary">
            Chat
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
