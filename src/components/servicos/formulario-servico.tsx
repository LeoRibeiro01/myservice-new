// Formulário para criar/editar serviços (RF002, RN2, RN6)

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import type { Servico } from "@/types/firestore"

interface FormularioServicoProps {
  servicoInicial?: Partial<Servico>
  onSalvar: (dados: Partial<Servico>) => Promise<void>
  onCancelar: () => void
}

const CATEGORIAS = [
  "Limpeza",
  "Eletricista",
  "Encanador",
  "Jardinagem",
  "Pintor",
  "Marceneiro",
  "TI e Tecnologia",
  "Aulas Particulares",
  "Beleza e Estética",
  "Outros",
]

export function FormularioServico({ servicoInicial, onSalvar, onCancelar }: FormularioServicoProps) {
  const [dados, setDados] = useState({
    title: servicoInicial?.title || "",
    description: servicoInicial?.description || "",
    category: servicoInicial?.category || "",
    price: servicoInicial?.price || 0,
    acceptsScheduling: servicoInicial?.acceptsScheduling ?? true,
    active: servicoInicial?.active ?? true,
  })
  const [fotos, setFotos] = useState<string[]>(servicoInicial?.photos || [])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const aoMudarCampo = (campo: string, valor: any) => {
    setDados((prev) => ({ ...prev, [campo]: valor }))
    setErro(null)
  }

  const aoSubmeter = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação RN2: serviço precisa de título, descrição, imagem e categoria
    if (!dados.title.trim()) {
      setErro("Título é obrigatório")
      return
    }
    if (!dados.description.trim()) {
      setErro("Descrição é obrigatória")
      return
    }
    if (!dados.category) {
      setErro("Categoria é obrigatória")
      return
    }
    if (fotos.length === 0) {
      setErro("Pelo menos uma foto é obrigatória (RN2)")
      return
    }
    if (dados.price <= 0) {
      setErro("Preço deve ser maior que zero")
      return
    }

    try {
      setSalvando(true)
      await onSalvar({
        ...dados,
        photos: fotos,
      })
    } catch (error: any) {
      console.error("[v0] Save service error:", error)
      setErro(error.message)
    } finally {
      setSalvando(false)
    }
  }

  const adicionarFoto = () => {
    // Em produção, aqui você faria upload para Firebase Storage
    // Por ora, usando placeholders
    const novaFoto = `/placeholder.svg?height=200&width=300&query=serviço`
    setFotos((prev) => [...prev, novaFoto])
  }

  const removerFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={aoSubmeter} className="space-y-6">
      {erro && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{erro}</div>}

      <div className="space-y-2">
        <Label htmlFor="title">Título do Serviço *</Label>
        <Input
          id="title"
          value={dados.title}
          onChange={(e) => aoMudarCampo("title", e.target.value)}
          placeholder="Ex: Limpeza Residencial Completa"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
        <Textarea
          id="description"
          value={dados.description}
          onChange={(e) => aoMudarCampo("description", e.target.value)}
          placeholder="Descreva seu serviço em detalhes..."
          rows={4}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select value={dados.category} onValueChange={(value) => aoMudarCampo("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={dados.price}
            onChange={(e) => aoMudarCampo("price", Number.parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Fotos do Serviço * (RN2)</Label>
            <p className="text-sm text-muted-foreground">Pelo menos 1 foto é obrigatória</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={adicionarFoto}>
            <Upload className="mr-2 h-4 w-4" />
            Adicionar Foto
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {fotos.map((foto, index) => (
            <div key={index} className="relative aspect-video">
              <img
                src={foto || "/placeholder.svg"}
                alt={`Foto ${index + 1}`}
                className="h-full w-full rounded-md object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={() => removerFoto(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label>Aceitar Agendamentos (RN1)</Label>
          <p className="text-sm text-muted-foreground">Permitir que clientes agendem serviços</p>
        </div>
        <Switch
          checked={dados.acceptsScheduling}
          onCheckedChange={(checked) => aoMudarCampo("acceptsScheduling", checked)}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label>Serviço Ativo (RN6)</Label>
          <p className="text-sm text-muted-foreground">Desative para pausar o serviço temporariamente</p>
        </div>
        <Switch checked={dados.active} onCheckedChange={(checked) => aoMudarCampo("active", checked)} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={salvando} className="flex-1">
          {salvando ? "Salvando..." : "Salvar Serviço"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
