// Modal para criar avaliação (RF007, RN4)

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Star } from "lucide-react"

interface ModalAvaliacaoProps {
  aberto: boolean
  onFechar: () => void
  servicoTitulo: string
  onConfirmar: (rating: number, comentario: string) => Promise<void>
}

export function ModalAvaliacao({ aberto, onFechar, servicoTitulo, onConfirmar }: ModalAvaliacaoProps) {
  const [rating, setRating] = useState(0)
  const [ratingHover, setRatingHover] = useState(0)
  const [comentario, setComentario] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const aoConfirmar = async () => {
    if (rating === 0) {
      setErro("Selecione uma nota")
      return
    }

    if (!comentario.trim()) {
      setErro("Escreva um comentário")
      return
    }

    try {
      setEnviando(true)
      setErro(null)
      console.log("[v0] Submitting review:", rating, comentario.substring(0, 50))

      await onConfirmar(rating, comentario)

      // Resetar estado
      setRating(0)
      setComentario("")
      onFechar()
    } catch (error: any) {
      console.error("[v0] Review submission error:", error)
      setErro(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Avaliar Serviço</DialogTitle>
          <DialogDescription>{servicoTitulo}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {erro && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{erro}</div>}

          <div className="space-y-2">
            <Label>Sua avaliação</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((estrela) => (
                <button
                  key={estrela}
                  type="button"
                  onClick={() => setRating(estrela)}
                  onMouseEnter={() => setRatingHover(estrela)}
                  onMouseLeave={() => setRatingHover(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      estrela <= (ratingHover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 1 && "Muito ruim"}
                {rating === 2 && "Ruim"}
                {rating === 3 && "Razoável"}
                {rating === 4 && "Bom"}
                {rating === 5 && "Excelente"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentario">Comentário</Label>
            <Textarea
              id="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Conte sobre sua experiência com o serviço..."
              rows={4}
            />
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            RN4: Você só pode avaliar serviços que já contratou e foram concluídos.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onFechar}>
            Cancelar
          </Button>
          <Button onClick={aoConfirmar} disabled={rating === 0 || enviando}>
            {enviando ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
