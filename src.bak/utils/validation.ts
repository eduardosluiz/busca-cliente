import { Contact } from '@/types/contact'

export function formatPhoneNumber(phone: string) {
  // Remove tudo que não for número
  const numbers = phone.replace(/\D/g, '')
  
  // Aplica a máscara (XX) XXXXX-XXXX
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }
  
  return numbers.slice(0, 11)
}

export function validateContact(data: Partial<Contact>) {
  const errors: {[key: string]: string} = {}

  // Nome é obrigatório e deve ter pelo menos 3 caracteres
  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Nome é obrigatório e deve ter pelo menos 3 caracteres'
  }

  // Email é obrigatório e deve ser válido
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email inválido'
  }

  // Telefone é obrigatório e deve ter 10 ou 11 dígitos
  if (!data.phone || data.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Telefone inválido'
  }

  // Estado é obrigatório
  if (!data.state) {
    errors.state = 'Estado é obrigatório'
  }

  return errors
} 