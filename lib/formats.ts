import fs from 'fs'
import path from 'path'

import type { Format, FormatCategory, StructuredFormat, WarmupFormat } from './format-types'
import { isStructuredFormat, isWarmup } from './format-types'

export type { Format, FormatCategory, StructuredFormat, WarmupFormat } from './format-types'
export { isStructuredFormat, isWarmup } from './format-types'

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
    // Sort by explored status (explored first), then by authorTag (Ivan Maska second), then alphabetically by name
    return formats.sort((a, b) => {
      if (isStructuredFormat(a) && isStructuredFormat(b)) {
        // Explored formats (Harold, Armando) come first
        if (a.explored && !b.explored && !b.authorTag) return -1
        if (!a.explored && !a.authorTag && b.explored) return 1

        // Formats with authorTag (Ivan Maska) come second
        if ((a.explored || a.authorTag) && !b.explored && !b.authorTag) return -1
        if (!a.explored && !a.authorTag && (b.explored || b.authorTag)) return 1
      }

      if (isStructuredFormat(a) && isWarmup(b)) return -1
      if (isWarmup(a) && isStructuredFormat(b)) return 1

      // Within same group, sort alphabetically
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
    formats = formats.filter(f => isStructuredFormat(f) && f.difficulty === filters.difficulty)
  }

  if (filters.minPlayers) {
    formats = formats.filter(f => isStructuredFormat(f) && f.maxPlayers >= filters.minPlayers!)
  }

  if (filters.maxPlayers) {
    formats = formats.filter(f => isStructuredFormat(f) && f.minPlayers <= filters.maxPlayers!)
  }

  if (filters.skills && filters.skills.length > 0) {
    formats = formats.filter(f =>
      isStructuredFormat(f) && filters.skills!.some(skill => f.skills.includes(skill))
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
