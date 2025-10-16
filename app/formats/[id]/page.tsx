import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getFormatById } from '@/lib/formats'
import type { FormatCategory } from '@/lib/format-types'
import { isStructuredFormat, isWarmup } from '@/lib/format-types'
import { Collapsible } from '@/components/ui/collapsible'

// Convert markdown bold and italic to HTML
function convertMarkdown(text: string | undefined | null): string {
  // Handle undefined or null values
  if (!text) return ''

  // Bold: **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // Italic: *text*
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  return text
}

export default async function FormatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const format = getFormatById(id)

  if (!format) {
    notFound()
  }

  // Determine if format has extended data
  const isHarold = id === 'harold'
  const isArmando = id === 'armando'
  const isWarmupFormat = isWarmup(format)
  const categoryLabels: Record<FormatCategory, string> = {
    'long-form': 'Длинная форма',
    'short-form': 'Короткая форма',
    warmup: 'Разминка',
  }

  const shortDescription = isWarmupFormat
    ? format.shortDescription ?? format.fullDescription ?? format.description
    : format.shortDescription

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-sm font-medium text-[color:var(--accent)] hover:underline transition-colors"
            >
              ← Назад к списку
            </Link>
            <Link
              href={`/formats/${id}/print`}
              className="text-sm font-medium bg-[color:var(--accent)] text-white px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
            >
              🖨️ Версия для печати
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Format Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              🌀 {format.name}
            </h1>
            <div className="flex flex-wrap gap-2 justify-end">
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                {categoryLabels[format.formCategory]}
              </span>
              {isWarmupFormat ? (
                <span className="text-sm font-semibold px-3 py-1 rounded-full border border-[color:var(--accent)] text-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,white)] dark:bg-[color:color-mix(in_srgb,var(--accent)_20%,black)]">
                  🎯 {format.warmupType}
                </span>
              ) : (
                <>
                  {format.explored && (
                    <span className="text-sm font-semibold px-3 py-1 rounded-full border border-[color:var(--accent)] text-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,white)] dark:bg-[color:color-mix(in_srgb,var(--accent)_20%,black)]">
                      ⭐ Детально изучено
                    </span>
                  )}
                  {'authorTag' in format && format.authorTag && (
                    <span className="text-sm font-semibold px-3 py-1 rounded-full border border-[color:var(--accent)] text-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,white)] dark:bg-[color:color-mix(in_srgb,var(--accent)_20%,black)]">
                      👤 {format.authorTag}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {shortDescription && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {shortDescription}
            </p>
          )}

          {/* Meta Info */}
          {isStructuredFormat(format) ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Игроки</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {format.minPlayers}–{format.maxPlayers} человек
                    {isHarold && ' (оптимально 8)'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Длительность</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {format.duration}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>Тип разминки: {format.warmupType}</p>
            </div>
          )}
        </div>

        {isWarmupFormat ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Описание</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {format.description}
            </p>
          </div>
        ) : (
          <>
        {/* Description */}
        <Collapsible title="Описание" icon="📖" defaultOpen={true}>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
            {format.fullDescription.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </Collapsible>

        {/* Harold Diagram */}
        {isHarold && (
          <Collapsible title="Структура сцен" icon="🧱" defaultOpen={true}>
            <div className="mb-4">
              <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 font-mono text-sm text-center">
                <div className="text-neutral-700 dark:text-neutral-300">
                  <strong>Opening</strong> →{' '}
                  <span className="font-semibold text-[color:var(--accent)]">A1 B1 C1</span> →
                  <span className="text-[color:var(--accent)]"> Group Game 1</span> →
                  <span className="text-[color:var(--accent)]"> A2 B2 C2</span> →
                  <span className="text-[color:var(--accent)]"> Group Game 2</span> →
                  <span className="text-[color:var(--accent)]"> A3 B3 C3 (финал)</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <Image
                src="/harold-diagram.svg"
                alt="Диаграмма структуры Harold"
                width={800}
                height={500}
                className="w-full"
              />
            </div>

            <div className="mt-2 text-center">
              <a
                href="https://www.behance.net/gallery/56737073/The-Harold-Infographic-Poster-%28-Other-Improv-Forms%29"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[color:var(--accent)] hover:underline"
              >
                Альтернативная инфографика на Behance →
              </a>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• <span className="font-bold">A, B, C</span> — три параллельные линии с разными персонажами</p>
              <p>• <span className="font-bold">A2 / B2 / C2</span> — новые вариации той же темы, без пересечений между линиями</p>
              <p>• <span className="font-bold">A3 / B3 / C3</span> — финальный блок, где линии могут соединиться или «рифмоваться»</p>
              <p>• <span className="font-bold">Group Games</span> — короткие ансамблевые вставки, усиливающие тему открытия</p>
            </div>
          </Collapsible>
        )}

        {/* Harold Openings */}
        {isHarold && format.openings && (
          <Collapsible title="Форматы открытий (Opening)" icon="🔓" defaultOpen={false}>
            <div className="space-y-6">
              {format.openings.map((opening: any, idx: number) => {
                const icons = ['🎯', '📖', '🎭', '🎨']
                return (
                  <div key={idx} className="border-l-4 border-[color:var(--accent)] pl-6 py-3">
                    <div className="flex gap-4 items-start mb-3">
                      <span className="text-3xl flex-shrink-0">{icons[idx]}</span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {idx + 1}. {opening.name}
                      </h3>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Как проходит:</p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {opening.description}
                        </p>
                      </div>

                      {opening.howItWorks && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {opening.howItWorks}
                          </p>
                        </div>
                      )}

                      {opening.threeRounds && (
                        <div>
                          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Три круга:</p>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {opening.threeRounds}
                          </p>
                        </div>
                      )}

                      {opening.structure && (
                        <div>
                          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Структура:</p>
                          <p
                            className="text-gray-600 dark:text-gray-400 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: convertMarkdown(opening.structure) }}
                          />
                        </div>
                      )}

                      {opening.example && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 border-l-2 border-gray-300 dark:border-gray-600">
                          <p className="text-gray-600 dark:text-gray-400 italic">
                            Пример: {opening.example}
                          </p>
                        </div>
                      )}

                      {opening.result && (
                        <div>
                          <p className="text-[color:var(--accent)] font-medium">
                            → {opening.result}
                          </p>
                        </div>
                      )}

                      {opening.benefit && (
                        <div>
                          <p className="text-[color:var(--accent)] font-medium">
                            → {opening.benefit}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Collapsible>
        )}

        {/* Armando Openings */}
        {isArmando && format.openings && (
          <Collapsible title="Варианты структуры монологов" icon="🎤" defaultOpen={false}>
            <div className="space-y-6">
              {format.openings.map((opening: any, idx: number) => {
                const icons = ['🎙️', '👥', '🎭', '✨']
                return (
                  <div key={idx} className="border-l-4 border-[color:var(--accent)] pl-6 py-3">
                    <div className="flex gap-4 items-start mb-3">
                      <span className="text-3xl flex-shrink-0">{icons[idx]}</span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {idx + 1}. {opening.name}
                      </h3>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {opening.description}
                        </p>
                      </div>

                      {opening.howItWorks && (
                        <div>
                          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Как работает:</p>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {opening.howItWorks}
                          </p>
                        </div>
                      )}

                      {opening.example && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 border-l-2 border-gray-300 dark:border-gray-600">
                          <p className="text-gray-600 dark:text-gray-400 italic">
                            Пример: {opening.example}
                          </p>
                        </div>
                      )}

                      {opening.result && (
                        <div>
                          <p className="text-[color:var(--accent)] font-medium">
                            → {opening.result}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Collapsible>
        )}

        {/* Components (for non-Harold or as fallback) */}
        {!isHarold && (
          <Collapsible title="Структура формата" icon="🧱">
            <div className="space-y-4">
              {format.components.map((component, index) => (
                <div
                  key={index}
                  className="border-l-4 border-[color:var(--accent)] pl-4 py-2"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {index + 1}. {component.name}
                    </h3>
                    {component.duration && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {component.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {component.description}
                  </p>
                </div>
              ))}
            </div>
          </Collapsible>
        )}

        {/* Harold Key Rules */}
        {isHarold && format.keyRules && (
          <Collapsible title="Ключевые правила" icon="⚙️">
            <ul className="space-y-2">
              {format.keyRules.map((rule: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[color:var(--accent)] mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: convertMarkdown(rule) }} />
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        {/* Armando Key Rules */}
        {isArmando && format.keyRules && (
          <Collapsible title="Ключевые правила" icon="⚙️">
            <ul className="space-y-2">
              {format.keyRules.map((rule: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[color:var(--accent)] mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: convertMarkdown(rule) }} />
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        {/* Montage Rules */}
        {format.montageRules && !isHarold && (
          <Collapsible title="Правила монтажа" icon="✂️">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {format.montageRules}
            </p>
          </Collapsible>
        )}

        {/* Harold Example */}
        {isHarold && format.example && (
          <Collapsible title={`Пример на тему: «${format.example.theme}»`} icon="🎬">
            <div className="space-y-4">
              {/* Opening */}
              <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <h3 className="font-semibold text-[color:var(--accent)] mb-2">
                  Opening
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {format.example.opening}
                </p>
              </div>

              {/* Beatings */}
              {format.example.beatings && format.example.beatings.map((beating: any, beatingIdx: number) => (
                <div key={beatingIdx} className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Beating {beating.number}
                  </h3>

                  {/* Scenes within this beating */}
                  {beating.scenes && beating.scenes.map((scene: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {scene.label}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                        {scene.description}
                      </p>
                      {scene.inspiration && (
                        <p className="text-sm text-[color:var(--accent)] italic mt-2">
                          Inspiration: {scene.inspiration}
                        </p>
                      )}
                      {scene.connections && (
                        <p className="text-sm text-[color:var(--accent)] font-semibold mt-2">
                          → {scene.connections}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Group Games */}
              {format.example.groupGames && format.example.groupGames.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Group Games
                  </h3>
                  {format.example.groupGames.map((game: any, gameIdx: number) => (
                    <div
                      key={gameIdx}
                      className="rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm"
                    >
                      <h4 className="font-semibold text-[color:var(--accent)] mb-2">
                        {game.type} (после {game.after})
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {game.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Collapsible>
        )}

        {/* Armando Example */}
        {isArmando && format.example && (
          <Collapsible title={`Пример на тему: «${format.example.theme}»`} icon="🎬">
            <div className="space-y-4">
              {/* Monologist Info */}
              <div className="rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Монологист:</strong> {format.example.monologist}
                </p>
              </div>

              {/* Rounds */}
              {format.example.rounds.map((round: any, roundIdx: number) => (
                <div key={roundIdx} className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Раунд {round.number}
                  </h3>

                  {/* Monologue */}
                  <div className="rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
                    <h4 className="font-semibold text-[color:var(--accent)] mb-2">
                      Монолог {round.number} ({round.monologue.duration})
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                      {round.monologue.summary}
                    </p>
                    {round.monologue.keyDetails && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                          Ключевые детали:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {round.monologue.keyDetails.map((detail: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 rounded border border-[color:var(--accent)] text-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,white)] dark:bg-[color:color-mix(in_srgb,var(--accent)_20%,black)]"
                            >
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scenes */}
                  <div className="space-y-2">
                    {round.scenes.map((scene: any, sceneIdx: number) => (
                      <div
                        key={sceneIdx}
                        className="rounded-lg p-3 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm"
                      >
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                          Сцена {scene.number}
                        </h5>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {scene.description}
                        </p>
                        {scene.inspiration && (
                          <p className="text-xs text-[color:var(--accent)] italic mt-1">
                            Inspiration: {scene.inspiration}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Themes Summary */}
              {format.example.themes && (
                <div className="rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Темы:</strong> {format.example.themes}
                  </p>
                </div>
              )}
            </div>
          </Collapsible>
        )}

        {/* Skills and Focus */}
        <Collapsible title="Навыки и фокус" icon="🎯">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Развиваемые навыки:
              </h3>
              <div className="flex flex-wrap gap-2">
                {format.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-sm border border-[color:var(--accent)] text-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,white)] dark:bg-[color:color-mix(in_srgb,var(--accent)_20%,black)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Педагогический фокус:
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{format.focus}</p>
            </div>
          </div>
        </Collapsible>

        {/* Videos */}
        {((format.resources?.videos && format.resources.videos.length > 0) || (format.sourceVideos && format.sourceVideos.length > 0)) && (
          <Collapsible title="Видео референсы" icon="🎥">
            <div className="space-y-3">
              {format.resources?.videos ? (
                format.resources.videos.map((video: any, idx: number) => (
                  <a
                    key={idx}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[color:var(--accent)] dark:hover:border-[color:var(--accent)] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📹</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {video.title}
                          </p>
                          {video.lang && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Язык: {video.lang === 'RU' ? 'Русский' : 'English'}
                            </p>
                          )}
                          {video.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {video.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[color:var(--accent)]">→</span>
                    </div>
                  </a>
                ))
              ) : (
                format.sourceVideos.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[color:var(--accent)] dark:hover:border-[color:var(--accent)] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📹</span>
                        <span className="text-gray-900 dark:text-gray-100">{url}</span>
                      </div>
                      <span className="text-[color:var(--accent)]">→</span>
                    </div>
                  </a>
                ))
              )}
            </div>
          </Collapsible>
        )}

        {/* Books */}
        {format.resources?.books && format.resources.books.length > 0 && (
          <Collapsible title="Книги" icon="📘">
            <div className="space-y-3">
              {format.resources.books.map((book: any, idx: number) => (
                book.url ? (
                  <a
                    key={idx}
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[color:var(--accent)] dark:hover:border-[color:var(--accent)] transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {book.authors}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {book.description}
                        </p>
                      </div>
                      <span className="text-[color:var(--accent)] flex-shrink-0">→</span>
                    </div>
                  </a>
                ) : (
                  <div key={idx} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {book.authors}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {book.description}
                    </p>
                  </div>
                )
              ))}
            </div>
          </Collapsible>
        )}

        {/* Links */}
        {format.resources?.links && format.resources.links.length > 0 && (
          <Collapsible title="Полезные ссылки" icon="🔗">
            <div className="space-y-2">
              {format.resources.links.map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[color:var(--accent)] dark:hover:border-[color:var(--accent)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-gray-100">{link.title}</span>
                    <span className="text-[color:var(--accent)]">→</span>
                  </div>
                </a>
              ))}
            </div>
          </Collapsible>
        )}

        {/* Notes */}
        {format.notes && (
          <Collapsible title="Заметки" icon="💡" variant="accent">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {format.notes}
            </p>
          </Collapsible>
        )}
          </>
        )}
      </main>
    </div>
  )
}
