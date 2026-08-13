export type TSearchDocument = {
  id: string
  title: string
  description: string
  href: string
  keywords: string[]
}

export type TSearchResult = Pick<TSearchDocument, 'id' | 'title' | 'description' | 'href'>

export type TSearchResponse = {
  query: string
  results: TSearchResult[]
  total: number
  page: number
  limit: number
  totalPages: number
}
