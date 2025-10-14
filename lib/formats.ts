import fs from 'fs'
import path from 'path'

export interface Format {
  id: string
  name: string
  explored?: boolean
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
  // Extended data fields (for formats like Harold and Armando)
  openings?: Array<{
    name: string
    description: string
    howItWorks: string
    example: string
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

const FORMATS_DIR = path.join(process.cwd(), 'data', 'formats')

// Читаем все форматы из директории /data/formats/
export function getFormats(): Format[] {
  try {
    const files = fs.readdirSync(FORMATS_DIR).filter(file => file.endsWith('.json'))
    const formats = files.map(file => {
      const filePath = path.join(FORMATS_DIR, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const format = JSON.parse(fileContent)
      return format
    })
    // Sort by explored status (explored first), then alphabetically by name
    return formats.sort((a, b) => {
      if (a.explored && !b.explored) return -1
      if (!a.explored && b.explored) return 1
      return a.name.localeCompare(b.name, 'ru')
    })
  } catch (error) {
    console.error('Error reading formats:', error)
    return []
  }
}

// Получить формат по ID - читает напрямую из файла
export function getFormatById(id: string): Format | null {
  try {
    const filePath = path.join(FORMATS_DIR, `${id}.json`)
    if (!fs.existsSync(filePath)) {
      return null
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`Error reading format ${id}:`, error)
    return null
  }
}

// Фильтровать форматы
export function filterFormats(filters: {
  difficulty?: string
  minPlayers?: number
  maxPlayers?: number
  skills?: string[]
}): Format[] {
  let formats = getFormats()

  if (filters.difficulty) {
    formats = formats.filter(f => f.difficulty === filters.difficulty)
  }

  if (filters.minPlayers) {
    formats = formats.filter(f => f.maxPlayers >= filters.minPlayers)
  }

  if (filters.maxPlayers) {
    formats = formats.filter(f => f.minPlayers <= filters.maxPlayers)
  }

  if (filters.skills && filters.skills.length > 0) {
    formats = formats.filter(f =>
      filters.skills!.some(skill => f.skills.includes(skill))
    )
  }

  return formats
}

// Сохранить формат в отдельный файл
export function saveFormat(format: Format): void {
  try {
    const filePath = path.join(FORMATS_DIR, `${format.id}.json`)
    fs.writeFileSync(filePath, JSON.stringify(format, null, 2), 'utf-8')
  } catch (error) {
    console.error(`Error saving format ${format.id}:`, error)
    throw error
  }
}

// Добавить новый формат
export function addFormat(format: Omit<Format, 'id'>): Format {
  const newFormat: Format = {
    ...format,
    id: String(Date.now()) // Простой ID на основе timestamp
  }
  saveFormat(newFormat)
  return newFormat
}
