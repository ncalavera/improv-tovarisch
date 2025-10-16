"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'

import type { Format, FormatCategory, StructuredFormat } from '@/lib/format-types'
import { isStructuredFormat, isWarmup } from '@/lib/format-types'

const difficultyOrderDesc: Record<StructuredFormat['difficulty'], number> = {
  advanced: 0,
  intermediate: 1,
  beginner: 2
}

type LengthFilter = 'all' | 'upTo15' | 'to25' | 'over25'
type SortPair = 'default' | 'difficulty' | 'players' | 'length'

const formatCategoryLabels: Record<FormatCategory, string> = {
  'long-form': 'Длинная форма',
  'short-form': 'Короткая форма',
  warmup: 'Разминка',
}

const sortLabelMap: Record<Exclude<SortPair, 'default'>, { forward: string; reverse: string }> = {
  difficulty: {
    forward: 'Посложнее → Попроще',
    reverse: 'Попроще → Посложнее'
  },
  players: {
    forward: 'Побольше людей → Поменьше людей',
    reverse: 'Поменьше людей → Побольше людей'
  },
  length: {
    forward: 'Подлиннее → Покороче',
    reverse: 'Покороче → Подлиннее'
  }
}

type Props = {
  formats: Format[]
}

function estimateDurationMinutes(duration?: string): number | null {
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

function matchesLengthFilter(duration: string | undefined, lengthFilter: LengthFilter): boolean {
  if (lengthFilter === 'all') {
    return true
  }

  const minutes = estimateDurationMinutes(duration)

  if (minutes === null) {
    // If we cannot parse the duration, keep the format visible instead of hiding it unexpectedly
    return true
  }

  if (lengthFilter === 'upTo15') {
    return minutes <= 15
  }

  if (lengthFilter === 'to25') {
    return minutes > 15 && minutes <= 25
  }

  return minutes > 25
}

function getAveragePlayers(format: StructuredFormat): number {
  return (format.minPlayers + format.maxPlayers) / 2
}

function compareDifficultyDesc(a: StructuredFormat, b: StructuredFormat): number {
  return difficultyOrderDesc[a.difficulty] - difficultyOrderDesc[b.difficulty]
}

function comparePlayersDesc(a: StructuredFormat, b: StructuredFormat): number {
  return getAveragePlayers(b) - getAveragePlayers(a)
}

function compareLengthDesc(a: StructuredFormat, b: StructuredFormat): number {
  const aDuration = estimateDurationMinutes(a.duration)
  const bDuration = estimateDurationMinutes(b.duration)

  if (aDuration === null && bDuration === null) return 0
  if (aDuration === null) return 1
  if (bDuration === null) return -1

  return bDuration - aDuration
}

export function FormatsExplorer({ formats }: Props) {
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>('all')
  const [playersFilter, setPlayersFilter] = useState<'all' | number>('all')
  const [sortPair, setSortPair] = useState<SortPair>('default')
  const [sortReversed, setSortReversed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [formCategoryFilter, setFormCategoryFilter] = useState<'all' | FormatCategory>('all')

  const playerOptions = useMemo(() => {
    const numbers = new Set<number>()
    formats.forEach((format) => {
      if (!isStructuredFormat(format)) return
      for (let count = format.minPlayers; count <= format.maxPlayers; count += 1) {
        numbers.add(count)
      }
    })
    return Array.from(numbers).sort((a, b) => a - b)
  }, [formats])

  const filteredFormats = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return formats.filter((format) => {
      if (normalizedQuery) {
        const name = format.name.toLowerCase()
        if (!name.includes(normalizedQuery)) {
          return false
        }
      }

      if (formCategoryFilter !== 'all' && format.formCategory !== formCategoryFilter) {
        return false
      }

      if (isWarmup(format)) {
        return true
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
  }, [formats, formCategoryFilter, lengthFilter, playersFilter, searchQuery])

  const defaultSortedFormats = useMemo(() => {
    return [...filteredFormats].sort((a, b) => {
      if (isStructuredFormat(a) && isStructuredFormat(b)) {
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
      }

      if (isStructuredFormat(a) && isWarmup(b)) return -1
      if (isWarmup(a) && isStructuredFormat(b)) return 1

      return a.name.localeCompare(b.name, 'ru')
    })
  }, [filteredFormats])

  const sortedFormats = useMemo(() => {
    if (sortPair === 'default') {
      return defaultSortedFormats
    }

    const formatsToSort = [...defaultSortedFormats]
    let comparator: (a: StructuredFormat, b: StructuredFormat) => number

    if (sortPair === 'difficulty') {
      comparator = compareDifficultyDesc
    } else if (sortPair === 'players') {
      comparator = comparePlayersDesc
    } else {
      comparator = compareLengthDesc
    }

    return formatsToSort.sort((a, b) => {
      if (isWarmup(a) && isWarmup(b)) {
        const result = a.name.localeCompare(b.name, 'ru')
        return sortReversed ? -result : result
      }

      if (isWarmup(a)) return 1
      if (isWarmup(b)) return -1

      const result = comparator(a, b)
      return sortReversed ? -result : result
    })
  }, [defaultSortedFormats, sortPair, sortReversed])

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Все форматы</h2>
        <p className="text-gray-600 dark:text-gray-400">Найдено форматов: {sortedFormats.length}</p>
      </div>

      <div className="bg-white/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <label className="flex flex-col gap-1 text-sm min-w-[220px]">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span aria-hidden="true">🔍</span>
                <span>Поиск формата</span>
              </span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                type="text"
                placeholder="Введите название"
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span aria-hidden="true">🎭</span>
                <span>Форма</span>
              </span>
              <select
                value={formCategoryFilter}
                onChange={(event) => setFormCategoryFilter(event.target.value as 'all' | FormatCategory)}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все формы</option>
                <option value="long-form">Длинная форма</option>
                <option value="short-form">Короткая форма</option>
                <option value="warmup">Разминка</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span aria-hidden="true">⏱️</span>
                <span>Длительность</span>
              </span>
              <select
                value={lengthFilter}
                onChange={(event) => setLengthFilter(event.target.value as LengthFilter)}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Любая</option>
                <option value="upTo15">До 15 минут</option>
                <option value="to25">16–25 минут</option>
                <option value="over25">26+ минут</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span aria-hidden="true">👥</span>
                <span>Игроки</span>
              </span>
              <select
                value={playersFilter === 'all' ? 'all' : String(playersFilter)}
                onChange={(event) =>
                  setPlayersFilter(event.target.value === 'all' ? 'all' : Number(event.target.value))
                }
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Любое</option>
                {playerOptions.map((option) => (
                  <option key={option} value={String(option)}>
                    {option} чел.
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Сортировка</span>
            <div className="flex items-center gap-2">
              <select
                value={sortPair}
                onChange={(event) => {
                  const value = event.target.value as SortPair
                  setSortPair(value)
                  setSortReversed(false)
                }}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">По умолчанию</option>
                <option value="difficulty">
                  {sortPair === 'difficulty' && sortReversed
                    ? sortLabelMap.difficulty.reverse
                    : sortLabelMap.difficulty.forward}
                </option>
                <option value="players">
                  {sortPair === 'players' && sortReversed
                    ? sortLabelMap.players.reverse
                    : sortLabelMap.players.forward}
                </option>
                <option value="length">
                  {sortPair === 'length' && sortReversed
                    ? sortLabelMap.length.reverse
                    : sortLabelMap.length.forward}
                </option>
              </select>
              {sortPair !== 'default' && (
                <button
                  type="button"
                  onClick={() => setSortReversed((prev) => !prev)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Поменять направление сортировки"
                  title="Поменять направление сортировки"
                >
                  <span aria-hidden="true">⇆</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedFormats.map((format) => {
          const warmup = isWarmup(format)
          const summary = warmup
            ? format.shortDescription ?? format.fullDescription ?? format.description
            : format.shortDescription

          return (
            <Link key={format.id} href={`/formats/${format.id}`} className="group">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 h-full transform transition-transform duration-200 ease-out group-hover:scale-[1.02] group-hover:shadow-md">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                      {formatCategoryLabels[format.formCategory]}
                    </span>

                    {warmup ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/70 dark:text-orange-200">
                        🎯 {format.warmupType}
                      </span>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {format.name}
                </h3>

                {summary && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{summary}</p>
                )}

                {isStructuredFormat(format) ? (
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
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span>Описание разминки →</span>
                  </div>
                )}

              </div>
            </Link>
          )
        })}
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
