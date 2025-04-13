import { Contact } from '@/types/contacts'

export function convertToCSV(contacts: Contact[]): string {
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
    const row = [
      `"${contact.company_name}"`,
      `"${contact.fantasy_name || ''}"`,
      `"${contact.category}"`,
      `"${contact.address.zip || ''}"`,
      `"${contact.address.city}"`,
      `"${contact.address.state}"`,
      `"${contact.phone || ''}"`,
      `"${contact.email || ''}"`,
      `"${contact.website || ''}"`,
      `"${contact.status}"`
    ]
    csvRows.push(row.join(','))
  }

  return csvRows.join('\n')
}

export function downloadCSV(csvContent: string, fileName: string): void {
  // Adiciona BOM para garantir que caracteres especiais sejam exibidos corretamente
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
} 