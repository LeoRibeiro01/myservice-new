// Tipos baseados na estrutura real do Firebase

export type TipoUsuario = "cliente" | "prestador"

export interface Usuario {
  uid: string
  email: string
  nome: string
  telefone: string
  tipo: TipoUsuario
  criadoEm: Date | string
}

export interface Prestador {
  id: string
  uid: string
  nomeCompleto: string
  email: string
  telefone: string
  nomeEmpresa: string
  cnpj: string
  cpfHash: string
  endereco: string
  categoriaServico: string
  tempoExperiencia: string
  valorHora: number
  documentos: string[]
  criadoEm: Date | string
  atualizadoEm: Date | string
}

export interface Conversa {
  id: string
  participantes: string[] // array com 2 UIDs
  criadoEm: Date | string
  ultimaMensagem?: string
  ultimaMensagemEm?: Date | string
  naoLidas?: Record<string, number> // { uid: quantidade }
}

export interface Mensagem {
  id: string
  conversaId: string
  remetenteUid: string
  texto: string
  criadoEm: Date | string
  lida: boolean
  imagemUrl?: string
  arquivoUrl?: string
}

export interface IndicadorDigitacao {
  usuarioId: string
  estaDigitando: boolean
  timestamp: Date | string
}

export interface ParticipanteConversa {
  uid: string
  nome: string
  email: string
  tipo: TipoUsuario
}
