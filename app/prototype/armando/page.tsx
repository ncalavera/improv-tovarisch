import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'

import { getFormatById } from '@/lib/formats'
import { isStructuredFormat } from '@/lib/format-types'

type Stage = {
  id: string
  title: string
  subtitle?: string
}

type ExampleScene = {
  number: number
  description: string
}

type ExampleRound = {
  number: number
  monologue: {
    duration: string
    summary: string
    keyDetails?: string[]
  }
  scenes: ExampleScene[]
}

function ArmandoFlowDiagram({ stages }: { stages: Stage[] }) {
  const stageWidth = 180
  const stageHeight = 86
  const gap = 44
  const paddingX = 24
  const paddingY = 24
  const totalWidth = stages.length * stageWidth + (stages.length - 1) * gap + paddingX * 2
  const totalHeight = stageHeight + paddingY * 2 + 40

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="w-full max-w-4xl mx-auto drop-shadow-lg"
      role="img"
      aria-label="Структура формата Армандо"
    >
      <defs>
        <linearGradient id="armando-stage" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.9} />
        </linearGradient>
      </defs>
      {stages.map((stage, index) => {
        const x = paddingX + index * (stageWidth + gap)
        const y = paddingY + 20

        return (
          <Fragment key={stage.id}>
            <rect
              x={x}
              y={y}
              width={stageWidth}
              height={stageHeight}
              rx={20}
              fill="url(#armando-stage)"
            />
            <text
              x={x + stageWidth / 2}
              y={y + 38}
              textAnchor="middle"
              fontSize={18}
              fontWeight={600}
              fill="white"
            >
              {stage.title}
            </text>
            {stage.subtitle ? (
              <text
                x={x + stageWidth / 2}
                y={y + 62}
                textAnchor="middle"
                fontSize={13}
                fill="rgba(255,255,255,0.85)"
              >
                {stage.subtitle}
              </text>
            ) : null}
            {index < stages.length - 1 ? (
              <g>
                <line
                  x1={x + stageWidth + 6}
                  y1={y + stageHeight / 2}
                  x2={x + stageWidth + gap - 6}
                  y2={y + stageHeight / 2}
                  stroke="#312e81"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                <polygon
                  points={`${x + stageWidth + gap - 6},${y + stageHeight / 2} ${x + stageWidth + gap - 20},${
                    y + stageHeight / 2 - 8
                  } ${x + stageWidth + gap - 20},${y + stageHeight / 2 + 8}`}
                  fill="#312e81"
                />
              </g>
            ) : null}
          </Fragment>
        )
      })}
      <path
        d={`M ${paddingX + stageWidth / 2} ${paddingY + stageHeight + 32}
            C ${paddingX + stageWidth / 2} ${totalHeight - 12}, ${
          totalWidth - paddingX - stageWidth / 2
        } ${totalHeight - 12}, ${totalWidth - paddingX - stageWidth / 2} ${paddingY + stageHeight + 32}`}
        fill="none"
        stroke="#0f172a"
        strokeWidth={3}
        strokeDasharray="8 8"
        strokeLinecap="round"
      />
      <text
        x={totalWidth / 2}
        y={totalHeight - 12}
        textAnchor="middle"
        fontSize={12}
        fill="#0f172a"
      >
        Цикл повторяется до окончания шоу
      </text>
    </svg>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-white/90 dark:bg-gray-900/80 rounded-3xl border border-gray-200/60 dark:border-gray-800 px-8 py-8 space-y-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {icon}
        </span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
      </div>
      <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">{children}</div>
    </section>
  )
}

export default function ArmandoPrototypePage() {
  const format = getFormatById('armando')

  if (!format || !isStructuredFormat(format)) {
    notFound()
  }

  const meta = {
    emoji: '🎙️',
    titleRu: 'Армандо',
    titleEn: 'Armando',
    tagline: format.shortDescription,
  }

  const categoryLabel = format.formCategory === 'long-form' ? 'Длинная форма' : 'Короткая форма'

  const tags = [
    { label: 'Игроки', value: `${format.minPlayers}–${format.maxPlayers}` },
    { label: 'Длительность', value: format.duration },
    { label: 'Тип', value: categoryLabel },
    { label: 'Сложность', value: 'Средний уровень' },
  ]

  const sceneStages = format.components
    .filter((component) => !component.name.toLowerCase().includes('цикл'))
    .map((component, index) => ({
      id: `${index}-${component.name}`,
      title: component.name,
      subtitle: component.duration ?? undefined,
    }))

  const rawExampleRounds = format.example?.rounds
  const exampleRounds: ExampleRound[] = Array.isArray(rawExampleRounds)
    ? (rawExampleRounds as ExampleRound[])
    : []
  const exampleScenes = exampleRounds.flatMap((round) =>
    round.scenes.map((scene) => ({
      round: round.number,
      number: scene.number,
      description: scene.description,
    })),
  )

  const pairedSceneHighlights = format.components
    .filter((component) => component.name.toLowerCase().includes('сцен'))
    .map((component, index) => ({
      component,
      example: exampleScenes[index],
    }))

  const skillColumns = [
    format.skills.slice(0, Math.ceil(format.skills.length / 2)),
    format.skills.slice(Math.ceil(format.skills.length / 2)),
  ]

  const resources = {
    videos: format.resources?.videos ?? [],
    fallbackVideos: format.resources?.videos ? [] : format.sourceVideos,
    books: format.resources?.books ?? [],
    links: format.resources?.links ?? [],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link
            href="/formats/armando"
            className="text-sm text-violet-300 hover:text-violet-100 transition"
          >
            ← Назад к текущей версии страницы
          </Link>
          <Link
            href="/"
            className="text-sm text-violet-300 hover:text-violet-100 transition"
          >
            ← Каталог форматов
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <section className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl px-8 py-10 space-y-6 shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl" aria-hidden>
                {meta.emoji}
              </span>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">Импровизационный формат</p>
                <h1 className="text-4xl font-black text-white">
                  {meta.titleRu}
                </h1>
                <p className="text-lg text-violet-200">{meta.titleEn}</p>
              </div>
            </div>
            <p className="text-lg text-slate-100/90 leading-relaxed">{meta.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-2 rounded-full bg-violet-500/15 text-violet-100 border border-violet-500/40 px-4 py-2 text-sm"
              >
                <span className="font-semibold text-violet-200/90">{tag.label}:</span> {tag.value}
              </span>
            ))}
          </div>
        </section>

        <Section icon="📖" title="Подробное описание">
          {format.fullDescription.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Section>

        <Section icon="🧭" title="Структура формата">
          <p>
            Формат строится на чередовании правдивых монологов и импровизированных сцен. Участники постоянно возвращаются к
            монологисту, когда чувствуют, что группе нужно новое вдохновение.
          </p>
          <ArmandoFlowDiagram stages={sceneStages} />
          {format.montageRules ? (
            <p className="text-sm text-slate-400 border border-slate-700/60 bg-slate-900/60 rounded-2xl px-4 py-3">
              <strong className="text-violet-200 font-semibold">Монтаж:</strong> {format.montageRules}
            </p>
          ) : null}
        </Section>

        {format.openings ? (
          <Section icon="🎤" title="Opening — монологические структуры">
            <p>
              Armando начинается с монолога, который задаёт эмоциональный вектор шоу. Вот четыре популярных подхода к построению
              монологов:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {format.openings.map((opening, index) => (
                <article
                  key={opening.name}
                  className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 space-y-3"
                >
                  <h3 className="text-lg font-semibold text-white flex items-start gap-2">
                    <span className="text-2xl" aria-hidden>
                      {['🎙️', '👥', '🎭', '✨'][index] ?? '🎙️'}
                    </span>
                    <span>{opening.name}</span>
                  </h3>
                  <p className="text-sm text-violet-100/90 leading-relaxed">{opening.description}</p>
                  {opening.howItWorks ? (
                    <p className="text-sm text-slate-200 leading-relaxed">
                      <strong className="text-violet-200">Как работает:</strong> {opening.howItWorks}
                    </p>
                  ) : null}
                  {opening.example ? (
                    <p className="text-sm italic text-violet-100/80 leading-relaxed">
                      Пример: {opening.example}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </Section>
        ) : null}

        <Section icon="🎬" title="Основные сцены">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">Что делает сцены Армандо уникальными</h3>
              <ul className="space-y-2 text-sm text-slate-200 leading-relaxed">
                {format.keyRules?.map((rule) => (
                  <li key={rule} className="flex gap-2">
                    <span className="text-violet-300">•</span>
                    <span dangerouslySetInnerHTML={{ __html: rule }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {pairedSceneHighlights.map(({ component, example }) => (
                <article
                  key={component.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3"
                >
                  <h4 className="text-lg font-semibold text-white">{component.name}</h4>
                  <p className="text-sm text-slate-200 leading-relaxed">{component.description}</p>
                  {example ? (
                    <p className="text-sm text-violet-200/90 leading-relaxed">
                      <strong className="text-violet-100">Пример сцены:</strong> {example.description}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 space-y-3">
                <h4 className="text-lg font-semibold text-white">Навыки, которые тренирует формат</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-200">
                  {skillColumns.map((column, columnIndex) => (
                    <ul key={columnIndex} className="space-y-2">
                      {column.map((skill) => (
                        <li key={skill} className="flex gap-2">
                          <span className="text-violet-300">•</span>
                          <span>{skill.replace(/-/g, ' ')}</span>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 space-y-3">
                <h4 className="text-lg font-semibold text-white">Педагогический фокус</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{format.focus}</p>
                <div className="text-sm text-violet-200/80 space-y-1">
                  <p><strong className="text-violet-100">Вариации:</strong> {format.variations.join('; ')}</p>
                  <p><strong className="text-violet-100">Похожие форматы:</strong> {format.similarTo.join('; ')}</p>
                  <p><strong className="text-violet-100">Перед стартом:</strong> {format.prerequisites.join('; ')}</p>
                </div>
              </div>
            </div>

            {format.notes ? (
              <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5 space-y-2 text-amber-100">
                <h4 className="text-lg font-semibold">Практическая заметка</h4>
                <p className="text-sm leading-relaxed whitespace-pre-line">{format.notes}</p>
              </div>
            ) : null}
          </div>
        </Section>

        {format.example ? (
          <Section icon="📝" title="Пример шоу от начала до конца">
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
                <p className="text-sm text-violet-200/80">
                  <strong className="text-violet-100">Тема:</strong> {format.example.theme}
                </p>
                <p className="text-sm text-violet-200/80">
                  <strong className="text-violet-100">Монологист:</strong> {format.example.monologist}
                </p>
              </div>
              {exampleRounds.map((round) => (
                <article key={round.number} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                  <header>
                    <h3 className="text-xl font-semibold text-white">Раунд {round.number}</h3>
                  </header>
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 space-y-2">
                      <h4 className="text-lg font-semibold text-violet-100">Монолог {round.number}</h4>
                      <p className="text-sm text-violet-200/80">
                        <strong className="text-violet-100">Длительность:</strong> {round.monologue.duration}
                      </p>
                      <p className="text-sm text-slate-200 leading-relaxed">{round.monologue.summary}</p>
                      {round.monologue.keyDetails?.length ? (
                        <p className="text-xs uppercase tracking-[0.25em] text-violet-200/60">
                          Ключевые детали: {round.monologue.keyDetails.join(', ')}
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-3">
                      {round.scenes.map((scene) => (
                        <div
                          key={scene.number}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2"
                        >
                          <h4 className="text-sm font-semibold text-white uppercase tracking-[0.2em]">
                            Сцена {scene.number}
                          </h4>
                          <p className="text-sm text-slate-200 leading-relaxed">{scene.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
              {format.example.themes ? (
                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 text-sm text-violet-100">
                  <strong className="text-violet-50">Общие темы:</strong> {format.example.themes}
                </div>
              ) : null}
            </div>
          </Section>
        ) : null}

        {(resources.videos.length > 0 || resources.fallbackVideos.length > 0) && (
          <Section icon="🎥" title="Видео">
            <div className="grid gap-4 md:grid-cols-2">
              {resources.videos.map((video) => (
                <a
                  key={video.url}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 hover:border-violet-300 transition"
                >
                  <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                  <p className="text-sm text-violet-200/80">Язык: {video.lang === 'RU' ? 'Русский' : 'Английский'}</p>
                  <p className="text-sm text-slate-200 leading-relaxed mt-2">{video.description}</p>
                </a>
              ))}
              {resources.fallbackVideos.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 hover:border-violet-300 transition"
                >
                  <h3 className="text-lg font-semibold text-white">Видео ресурс</h3>
                  <p className="text-sm text-slate-200 leading-relaxed break-words">{url}</p>
                </a>
              ))}
            </div>
          </Section>
        )}

        {(resources.links.length > 0 || resources.books.length > 0) && (
          <Section icon="🔗" title="Ссылки и источники">
            <div className="space-y-6">
              {resources.links.length ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Полезные ссылки</h3>
                  <ul className="space-y-2 text-sm text-slate-200">
                    {resources.links.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-200 hover:text-violet-100 underline"
                        >
                          {link.title}
                        </a>
                        {link.description ? (
                          <p className="text-slate-400">{link.description}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {resources.books.length ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Книги</h3>
                  <ul className="space-y-3 text-sm text-slate-200">
                    {resources.books.map((book) => (
                      <li key={book.title} className="border border-white/10 bg-white/5 rounded-2xl p-4">
                        <p className="font-semibold text-white">{book.title}</p>
                        <p className="text-violet-200/80">{book.authors}</p>
                        <p className="text-slate-300 leading-relaxed mt-1">{book.description}</p>
                        <a
                          href={book.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-200 hover:text-violet-100 underline text-sm mt-2 inline-block"
                        >
                          Открыть источник
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </Section>
        )}
      </main>
    </div>
  )
}
