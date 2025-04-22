// Enum para status do contato
export enum ContactStatus {
  Active = 'active',
  Inactive = 'inactive'
}

// Enum para estados brasileiros
export enum BrazilianState {
  AC = 'Acre',
  AL = 'Alagoas',
  AP = 'Amapá',
  AM = 'Amazonas',
  BA = 'Bahia',
  CE = 'Ceará',
  DF = 'Distrito Federal',
  ES = 'Espírito Santo',
  GO = 'Goiás',
  MA = 'Maranhão',
  MT = 'Mato Grosso',
  MS = 'Mato Grosso do Sul',
  MG = 'Minas Gerais',
  PA = 'Pará',
  PB = 'Paraíba',
  PR = 'Paraná',
  PE = 'Pernambuco',
  PI = 'Piauí',
  RJ = 'Rio de Janeiro',
  RN = 'Rio Grande do Norte',
  RS = 'Rio Grande do Sul',
  RO = 'Rondônia',
  RR = 'Roraima',
  SC = 'Santa Catarina',
  SP = 'São Paulo',
  SE = 'Sergipe',
  TO = 'Tocantins'
}

// Enum para tags comuns
export enum ContactTag {
  Cliente = 'cliente',
  Fornecedor = 'fornecedor',
  Parceiro = 'parceiro',
  VIP = 'vip',
  Prospect = 'prospect',
  LeadQuente = 'lead-quente',
  LeadFrio = 'lead-frio',
  Inativo = 'inativo'
}

// Interface principal do contato
export interface Contact {
  id: string;
  user_id: string;
  company_name: string;
  fantasy_name?: string;
  category: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  status: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  notes?: string;
}

// Interface para filtros de busca
export interface ContactFilters {
  search?: string
  status?: ContactStatus
  city?: string
  state?: BrazilianState
  tags?: ContactTag[]
  page?: number
  limit?: number
  sortBy?: 'name' | 'created_at' | 'updated_at'
  sortOrder?: 'asc' | 'desc'
}

// Interface para validação de campos
export const contactValidation = {
  name: { 
    required: true, 
    minLength: 2, 
    maxLength: 100,
    message: 'Nome deve ter entre 2 e 100 caracteres'
  },
  email: { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido'
  },
  phone: { 
    required: true, 
    pattern: /^\(\d{2}\) \d{5}-\d{4}$/,
    message: 'Telefone deve estar no formato (99) 99999-9999'
  }
} as const

// Funções auxiliares de validação
export const validateContact = (contact: Partial<Contact>): Record<string, string> => {
  const errors: Record<string, string> = {}

  // Validar nome
  if (!contact.name) {
    errors.name = contactValidation.name.message
  } else if (contact.name.length < contactValidation.name.minLength) {
    errors.name = `Nome deve ter pelo menos ${contactValidation.name.minLength} caracteres`
  } else if (contact.name.length > contactValidation.name.maxLength) {
    errors.name = `Nome deve ter no máximo ${contactValidation.name.maxLength} caracteres`
  }

  // Validar email
  if (!contact.email) {
    errors.email = 'Email é obrigatório'
  } else if (!contactValidation.email.pattern.test(contact.email)) {
    errors.email = contactValidation.email.message
  }

  // Validar telefone
  if (!contact.phone) {
    errors.phone = 'Telefone é obrigatório'
  } else if (!contactValidation.phone.pattern.test(contact.phone)) {
    errors.phone = contactValidation.phone.message
  }

  return errors
}

// Função para formatar telefone automaticamente
export const formatPhone = (phone: string): string => {
  // Remove tudo que não é número
  const numbers = phone.replace(/\D/g, '')
  
  // Formata para (99) 99999-9999
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

// Função para verificar se há erros
export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0
}

// Função para obter lista de estados
export const getStatesList = (): { value: BrazilianState; label: string }[] => {
  return Object.entries(BrazilianState).map(([_, value]) => ({
    value: value as BrazilianState,
    label: value
  }))
}

// Função para obter lista de tags
export const getTagsList = (): { value: ContactTag; label: string }[] => {
  return Object.entries(ContactTag).map(([_, value]) => ({
    value: value as ContactTag,
    label: value.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())
  }))
} 