import { getLocale } from '#server/utils/getLocale'
import { getSearchDocuments } from '#server/utils/search-index'
import { featureConfig } from '~/config/features'
import { searchConfig } from '~/config/search'
import type { TSearchDocument, TSearchResponse, TSearchResult } from '~/types/search'

const MAX_PAGE = 1000

function getFirstQueryValue(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : ''
  }

  return ''
}

function normalizeText(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase('zh-TW').replace(/\s+/g, ' ').trim()
}

function parsePositiveInteger(value: unknown, fallback: number, maximum: number): number {
  const rawValue = getFirstQueryValue(value)

  if (!/^\d+$/.test(rawValue)) {
    return fallback
  }

  const parsedValue = Number(rawValue)

  if (!Number.isSafeInteger(parsedValue) || parsedValue < 1) {
    return fallback
  }

  return Math.min(parsedValue, maximum)
}

function getSearchScore(document: TSearchDocument, query: string, tokens: string[]): number {
  const normalizedTitle = normalizeText(document.title)
  const normalizedDescription = normalizeText(document.description)
  const normalizedKeywords = document.keywords.map(normalizeText)
  const searchableText = [normalizedTitle, normalizedDescription, ...normalizedKeywords].join(' ')

  if (!tokens.every((token) => searchableText.includes(token))) {
    return 0
  }

  let score = 100

  if (normalizedTitle === query) score += 1000
  if (normalizedTitle.startsWith(query)) score += 800
  if (normalizedTitle.includes(query)) score += 600
  if (normalizedKeywords.some((keyword) => keyword === query)) score += 500
  if (normalizedKeywords.some((keyword) => keyword.includes(query))) score += 400
  if (normalizedDescription.includes(query)) score += 200
  score += tokens.filter((token) => normalizedTitle.includes(token)).length * 50

  return score
}

function toSearchResult(document: TSearchDocument): TSearchResult {
  return {
    id: document.id,
    title: document.title,
    description: document.description,
    href: document.href,
  }
}

function createEmptyResponse(query: string, page: number, limit: number): TSearchResponse {
  return {
    query,
    results: [],
    total: 0,
    page,
    limit,
    totalPages: 1,
  }
}

export default defineEventHandler((event): TSearchResponse => {
  if (!featureConfig.search) {
    throw createError({ statusCode: 404, statusMessage: 'Search is disabled' })
  }

  const queryParams = getQuery(event)
  const rawQuery = getFirstQueryValue(queryParams.q).trim()
  const query = rawQuery.slice(0, searchConfig.maxQueryLength)
  const page = parsePositiveInteger(queryParams.page, 1, MAX_PAGE)
  const limit = parsePositiveInteger(queryParams.limit, searchConfig.pageSize, 50)

  if (!query) {
    return createEmptyResponse('', 1, limit)
  }

  const normalizedQuery = normalizeText(query)
  const tokens = normalizedQuery.split(' ').filter(Boolean)
  const documents = getSearchDocuments(getLocale(event))
  const rankedDocuments = documents
    .map((document) => ({ document, score: getSearchScore(document, normalizedQuery, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score)
    .map(({ document }) => document)

  const total = rankedDocuments.length
  const totalPages = Math.max(Math.ceil(total / limit), 1)
  const normalizedPage = Math.min(page, totalPages)
  const startIndex = (normalizedPage - 1) * limit
  const results = rankedDocuments.slice(startIndex, startIndex + limit).map(toSearchResult)

  return {
    query,
    results,
    total,
    page: normalizedPage,
    limit,
    totalPages,
  }
})
