"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'

import type { Format } from '@/lib/formats'

const difficultyLabels: Record<Format['difficulty'], string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый'
}

const difficultyOrder: Record<Format['difficulty'], number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2
}

const difficultyOrderDesc: Record<Format['difficulty'], number> = {
  advanced: 0,
  intermediate: 1,
  beginner: 2
}

type LengthFilter = 'all' | 'short' | 'medium' | 'long'
type SortOption = 'default' | 'difficulty' | 'length' | 'players'

type Props = {
  formats: Format[]
}

function estimateDurationMinutes(duration: string): number | null {
  if (!duration) return null

  const normalized = duration.toLowerCase()
  const numberMatches = normalized.match(/\d+[.,]?\d*/g)
  if (!numberMatches) {
    return null
  }

  const hasHours = /(час|ч)/.test(normalized)
  const hasMinutes = /мин/.test(normalized)

  // Handle explicit hour + minute mentions like "1 час 30 минут"
  if (hasHours && hasMinutes && numberMatches.length >= 2) {
    const hours = Number(numberMatches[0].replace(',', '.'))
    const minutes = Number(numberMatches[1].replace(',', '.'))
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      return hours * 60 + minutes
    }
  }

  const values = numberMatches
    .map((value) => Number(value.replace(',', '.')))
    .filter((value) => !Number.isNaN(value))

  if (values.length === 0) {
    return null
  }

  if (hasHours && !hasMinutes) {
    const averageHours = values.reduce((sum, value) => sum + value, 0) / values.length
    return Math.round(averageHours * 60)
  }

  if (hasHours && hasMinutes && numberMatches.length === 1) {
    // Something like "1 час" without explicit minutes
    return values[0] * 60
  }

  // Default to minutes (use average if a range is provided)
  const averageMinutes = values.reduce((sum, value) => sum + value, 0) / values.length
  return Math.round(averageMinutes)
}

function matchesLengthFilter(duration: string, lengthFilter: LengthFilter): boolean {
  if (lengthFilter === 'all') {
    return true
  }

  const minutes = estimateDurationMinutes(duration)

  if (minutes === null) {
    // If we cannot parse the duration, keep the format visible instead of hiding it unexpectedly
    return true
  }

  if (lengthFilter === 'short') {
    return minutes <= 20
  }

  if (lengthFilter === 'medium') {
    return minutes > 20 && minutes <= 40
  }

  return minutes > 40
}

function getAveragePlayers(format: Format): number {
  return (format.minPlayers + format.maxPlayers) / 2
}

export function FormatsExplorer({ formats }: Props) {
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | Format['difficulty']>('all')
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>('all')
  const [playersFilter, setPlayersFilter] = useState<'all' | number>('all')
  const [sortOption, setSortOption] = useState<SortOption>('default')

  const playerOptions = useMemo(() => {
    const numbers = new Set<number>()
    formats.forEach((format) => {
      for (let count = format.minPlayers; count <= format.maxPlayers; count += 1) {
        numbers.add(count)
      }
    })
    return Array.from(numbers).sort((a, b) => a - b)
  }, [formats])

  const filteredFormats = useMemo(() => {
    return formats.filter((format) => {
      if (difficultyFilter !== 'all' && format.difficulty !== difficultyFilter) {
        return false
      }

      if (!matchesLengthFilter(format.duration, lengthFilter)) {
        return false
      }

      if (playersFilter !== 'all') {
        if (playersFilter < format.minPlayers || playersFilter > format.maxPlayers) {
          return false
        }
      }

      return true
    })
  }, [difficultyFilter, formats, lengthFilter, playersFilter])

  const defaultSortedFormats = useMemo(() => {
    return [...filteredFormats].sort((a, b) => {
      if (a.explored && !b.explored) return -1
      if (!a.explored && b.explored) return 1

      const aHasTag = Boolean(a.authorTag)
      const bHasTag = Boolean(b.authorTag)
      if (aHasTag && !bHasTag) return -1
      if (!aHasTag && bHasTag) return 1

      const difficultyComparison = difficultyOrderDesc[a.difficulty] - difficultyOrderDesc[b.difficulty]
      if (difficultyComparison !== 0) {
        return difficultyComparison
      }

      return a.name.localeCompare(b.name, 'ru')
    })
  }, [filteredFormats])

  const sortedFormats = useMemo(() => {
    if (sortOption === 'default') {
      return defaultSortedFormats
    }

    const formatsToSort = [...defaultSortedFormats]

    if (sortOption === 'difficulty') {
      return formatsToSort.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
    }

    if (sortOption === 'length') {
      return formatsToSort.sort((a, b) => {
        const aDuration = estimateDurationMinutes(a.duration)
        const bDuration = estimateDurationMinutes(b.duration)

        if (aDuration === null && bDuration === null) return 0
        if (aDuration === null) return 1
        if (bDuration === null) return -1
        return aDuration - bDuration
      })
    }

    return formatsToSort.sort((a, b) => getAveragePlayers(a) - getAveragePlayers(b))
  }, [defaultSortedFormats, sortOption])

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Все форматы</h2>
        <p className="text-gray-600 dark:text-gray-400">Найдено форматов: {sortedFormats.length}</p>
      </div>

      <div className="bg-white/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-8 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Сложность</span>
            <select
              value={difficultyFilter}
              onChange={(event) =>
                setDifficultyFilter(event.target.value as 'all' | Format['difficulty'])
              }
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Любая сложность</option>
              <option value="beginner">Только начальный уровень</option>
              <option value="intermediate">Только средний уровень</option>
              <option value="advanced">Только продвинутый уровень</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Длительность</span>
            <select
              value={lengthFilter}
              onChange={(event) => setLengthFilter(event.target.value as LengthFilter)}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Любая длительность</option>
              <option value="short">Короткие (до 20 минут)</option>
              <option value="medium">Средние (20-40 минут)</option>
              <option value="long">Длинные (40 минут и больше)</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Количество игроков</span>
            <select
              value={playersFilter}
              onChange={(event) =>
                setPlayersFilter(event.target.value === 'all' ? 'all' : Number(event.target.value))
              }
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Любое количество</option>
              {playerOptions.map((option) => (
                <option key={option} value={option}>
                  {option} игроков
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Сортировка</span>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value as SortOption)}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">По умолчанию</option>
              <option value="difficulty">Сложность</option>
              <option value="length">Длительность</option>
              <option value="players">Количество игроков</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedFormats.map((format) => (
          <Link key={format.id} href={`/formats/${format.id}`} className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      format.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : format.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {difficultyLabels[format.difficulty]}
                  </span>
                  {format.explored && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      ⭐ Детально изучено
                    </span>
                  )}
                  {format.authorTag && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      👤 {format.authorTag}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {format.name}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{format.shortDescription}</p>

              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>
                    {format.minPlayers}-{format.maxPlayers} игроков
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>{format.duration}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1">
                {format.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {format.skills.length > 3 && (
                  <span className="text-xs text-gray-500">+{format.skills.length - 3}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {sortedFormats.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Форматы не найдены</p>
        </div>
      )}
    </div>
  )
}

export default FormatsExplorer
