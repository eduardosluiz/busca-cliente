import { Contact } from '@/types/contacts'

interface ExportError extends Error {
  type: 'VALIDATION' | 'CONVERSION' | 'DOWNLOAD'
  details?: any
}

function sanitizeCSVField(field: string | null | undefined): string {
  if (field === null || field === undefined) return '""'
  // Escapa aspas duplas e caracteres especiais
  const sanitized = field.toString().replace(/"/g, '""')
  return `"${sanitized}"`
}

export function convertToCSV(contacts: Contact[]): string {
  try {
    if (!Array.isArray(contacts)) {
      throw new Error('O parâmetro contacts deve ser um array')
    }

    // Define as colunas do CSV
    const headers = [
      'Empresa',
      'Nome Fantasia',
      'Categoria',
      'CEP',
      'Cidade',
      'Estado',
      'Telefone',
      'Email',
      'Website',
      'Status'
    ]

    // Cria a linha de cabeçalho
    const csvRows = [headers.join(',')]

    // Adiciona os dados de cada contato
    for (const contact of contacts) {
      if (!contact || typeof contact !== 'object') {
        console.warn('Contato inválido encontrado, pulando...', contact)
        continue
      }

      const row = [
        sanitizeCSVField(contact.company_name),
        sanitizeCSVField(contact.fantasy_name),
        sanitizeCSVField(contact.category),
        sanitizeCSVField(contact.address?.zip),
        sanitizeCSVField(contact.address?.city),
        sanitizeCSVField(contact.address?.state),
        sanitizeCSVField(contact.phone),
        sanitizeCSVField(contact.email),
        sanitizeCSVField(contact.website),
        sanitizeCSVField(contact.status)
      ]
      csvRows.push(row.join(','))
    }

    return csvRows.join('\n')
  } catch (error) {
    const exportError: ExportError = new Error(
      'Erro ao converter contatos para CSV'
    ) as ExportError
    exportError.type = 'CONVERSION'
    exportError.details = error
    throw exportError
  }
}

export function downloadCSV(csvContent: string, fileName: string): void {
  try {
    if (!csvContent) {
      throw new Error('O conteúdo do CSV não pode estar vazio')
    }

    if (!fileName) {
      throw new Error('O nome do arquivo é obrigatório')
    }

    // Adiciona BOM para garantir que caracteres especiais sejam exibidos corretamente
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { 
      type: 'text/csv;charset=utf-8' 
    })
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.setAttribute('href', url)
    link.setAttribute('download', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`)
    
    // Adiciona o link de forma segura
    document.body.appendChild(link)
    link.click()
    
    // Limpa recursos
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)

  } catch (error) {
    const exportError: ExportError = new Error(
      'Erro ao fazer download do CSV'
    ) as ExportError
    exportError.type = 'DOWNLOAD'
    exportError.details = error
    throw exportError
  }
} 