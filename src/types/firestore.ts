// Tipos baseados na especificação oficial do MyService

export type TipoUsuario = "client" | "provider" | "admin"

export type StatusAgendamento = "pending" | "accepted" | "rejected" | "completed" | "canceled"

export interface Localizacao {
  lat: number
  lng: number
}

export interface Usuario {
  uid: string
  type: TipoUsuario
  name: string
  email: string
  phone: string
  photoURL?: string
  // Campos específicos de prestador
  specialty?: string
  description?: string
  availability?: string
  portfolio?: string[]
  location: Localizacao
  createdAt: Date
}

export interface Servico {
  id: string
  providerId: string
  title: string
  description: string
  category: string
  price: number
  photos: string[]
  active: boolean
  acceptsScheduling: boolean
  location: Localizacao
  ratingAverage: number
  ratingCount: number
  createdAt: Date
}

export interface Agendamento {
  id: string
  clientId: string
  providerId: string
  serviceId: string
  date: Date
  status: StatusAgendamento
  createdAt: Date
}

export interface Avaliacao {
  id: string
  clientId: string
  providerId: string
  serviceId: string
  rating: number
  comment: string
  createdAt: Date
}

export interface Conversa {
  id: string
  clientId: string
  providerId: string
  serviceId?: string
  lastMessage: string
  updatedAt: Date
}

export interface Mensagem {
  id: string
  senderId: string
  text: string
  createdAt: Date
}

export interface Favorito {
  clientId: string
  providerId: string
  createdAt: Date
}

// Filtros de busca
export interface FiltrosBusca {
  categoria?: string
  precoMin?: number
  precoMax?: number
  notaMinima?: number
  raioKm?: number
  localizacao?: Localizacao
}
