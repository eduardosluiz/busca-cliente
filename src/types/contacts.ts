export interface Contact {
  id: string
  user_id: string
  company_name: string
  fantasy_name?: string
  category: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zip: string
  }
  phone?: string
  email?: string
  website?: string
  status: string
  created_at: string
  updated_at: string
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