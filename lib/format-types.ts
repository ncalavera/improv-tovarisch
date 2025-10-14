export type FormatCategory = 'long-form' | 'short-form' | 'warmup'

interface BaseFormat {
  id: string
  name: string
  formCategory: FormatCategory
}

export interface WarmupFormat extends BaseFormat {
  formCategory: 'warmup'
  description: string
  warmupType: string
  shortDescription?: string
  fullDescription?: string
}

export interface StructuredFormat extends BaseFormat {
  formCategory: 'long-form' | 'short-form'
  explored?: boolean
  authorTag?: string
  shortDescription: string
  fullDescription: string
  minPlayers: number
  maxPlayers: number
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  components: Array<{
    name: string
    description: string
    duration?: string
  }>
  montageRules?: string
  skills: string[]
  focus: string
  variations: string[]
  prerequisites: string[]
  similarTo: string[]
  sourceVideos: string[]
  notes?: string
  openings?: Array<{
    name: string
    description: string
    howItWorks: string
    example: string | null
    result: string
  }>
  keyRules?: string[]
  example?: any
  resources?: {
    videos?: Array<{
      title: string
      url: string
      lang?: string
      description: string
    }>
    books?: Array<{
      title: string
      authors: string
      year: number | null
      description: string
      url: string
    }>
    links?: Array<{
      title: string
      url: string
      description: string
    }>
  }
}

export type Format = StructuredFormat | WarmupFormat

export function isWarmup(format: Format): format is WarmupFormat {
  return format.formCategory === 'warmup'
}

export function isStructuredFormat(format: Format): format is StructuredFormat {
  return format.formCategory === 'long-form' || format.formCategory === 'short-form'
}
