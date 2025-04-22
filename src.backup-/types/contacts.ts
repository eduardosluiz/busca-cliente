export interface Contact {
  id: string
  company_name: string
  fantasy_name?: string
  phone?: string
  email?: string
  website?: string
  status: string
  category: string
  created_at?: string
  updated_at: string
  tags?: string[]
  location?: string
}

export interface ContactFilters {
  status?: string
  category?: string
  search?: string
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface ContactsResponse {
  data: Contact[]
  count: number
  totalPages: number
  currentPage: number
} 