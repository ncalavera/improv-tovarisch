'use client'

import Link from 'next/link'
import { Fragment } from 'react'

import { Collapsible } from '@/components/ui/collapsible'

export type Stage = {
  id: string
  title: string
  subtitle?: string
}

export type ExampleScene = {
  number: number
  description: string
}

export type ExampleRound = {
  number: number
  monologue: {
    duration: string
    summary: string
    keyDetails?: string[]
  }
  scenes: ExampleScene[]
}

type Opening = {
  name: string
  description: string
  howItWorks?: string
  example?: string | null
  result?: string
}

type SceneComponentHighlight = {
  name: string
  description: string
  duration?: string
  example?: ExampleScene
}

type VideoResource = {
  title: string
  url: string
  lang?: string
  description?: string
}

type VideoPreview = {
  platform: string
  embedUrl?: string
  preview?: string
  canonicalUrl?: string
}

type BookResource = {
  title: string
  authors: string
  year: number | null
  description: string
  url: string
}

type LinkResource = {
  title: string
  url: string
  description: string
}

export type ArmandoPrototypeViewProps = {
  meta: {
    emoji: string
    titleRu: string
    titleEn: string
    tagline: string
  }
  tags: Array<{ label: string; value: string }>
  description: string[]
  structure: {
    overview: string
    stages: Stage[]
    montage?: string
  }
  openings: Opening[]
  sceneHighlights: {
    uniqueHighlights: string[]
    components: SceneComponentHighlight[]
    skills: string[][]
    focus: string
    variations: string[]
    similarTo: string[]
    prerequisites: string[]
    notes?: string
  }
  example?: {
    theme?: string
    monologist?: string
    rounds: ExampleRound[]
    themes?: string
  }
  videos: {
    featured: VideoResource[]
    fallback: string[]
  }
  resources: {
    links: LinkResource[]
    books: BookResource[]
  }
}

function convertMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function wrapSvgLines(text: string, maxCharsPerLine = 18): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach((word) => {
    const candidate = currentLine.length === 0 ? word : `${currentLine} ${word}`
    if (candidate.length <= maxCharsPerLine) {
      currentLine = candidate
    } else {
      if (currentLine.length > 0) {
        lines.push(currentLine)
      }
      currentLine = word
    }
  })

  if (currentLine.length > 0) {
    lines.push(currentLine)
  }

  return lines
}

function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1)
    }

    if (parsed.hostname.includes('youtube.com')) {
      const params = parsed.searchParams.get('v')
      if (params) {
        return params
      }
      const segments = parsed.pathname.split('/')
      const watchIndex = segments.findIndex((segment) => segment === 'embed')
      if (watchIndex >= 0 && segments[watchIndex + 1]) {
        return segments[watchIndex + 1]
      }
    }
  } catch (error) {
    console.error('Failed to parse YouTube url', error)
  }

  return null
}

function getVkEmbedUrl(url: string): { embedUrl: string; canonicalUrl: string } | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'vkvideo.ru' || parsed.hostname === 'm.vk.com') {
      parsed.hostname = 'vk.com'
    }

    const match = parsed.pathname.match(/video(-?\d+)_(\d+)/)
    if (!match) {
      return null
    }

    const [, ownerId, videoId] = match
    return {
      embedUrl: `https://vk.com/video_ext.php?oid=${ownerId}&id=${videoId}&hd=2`,
      canonicalUrl: `https://vk.com/video${ownerId}_${videoId}`,
    }
  } catch (error) {
    console.error('Failed to parse VK video url', error)
    return null
  }
}

function getVideoPreview(url: string): VideoPreview | null {
  const youtubeId = getYouTubeId(url)
  if (youtubeId) {
    return {
      platform: 'YouTube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
      preview: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      canonicalUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    }
  }

  const vkEmbed = getVkEmbedUrl(url)
  if (vkEmbed) {
    return {
      platform: 'VK Видео',
      embedUrl: vkEmbed.embedUrl,
      preview: undefined,
      canonicalUrl: vkEmbed.canonicalUrl,
    }
  }

  return null
}

function ArmandoFlowDiagram({ stages }: { stages: Stage[] }) {
  const stageWidth = 220
  const stageHeight = 120
  const gap = 52
  const paddingX = 32
  const paddingY = 32
  const totalWidth = stages.length * stageWidth + (stages.length - 1) * gap + paddingX * 2
  const totalHeight = stageHeight + paddingY * 2 + 90
  const bottomLabelY = totalHeight - 28

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="w-full max-w-5xl mx-auto drop-shadow-xl"
      role="img"
      aria-label="Структура формата Армандо"
    >
      <defs>
        <linearGradient id="armando-stage" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#312e81" stopOpacity={0.95} />
        </linearGradient>
      </defs>
      {stages.map((stage, index) => {
        const x = paddingX + index * (stageWidth + gap)
        const y = paddingY
        const titleLines = wrapSvgLines(stage.title, 18)
        const subtitleLines = stage.subtitle ? wrapSvgLines(stage.subtitle, 22) : []

        return (
          <Fragment key={stage.id}>
            <rect
              x={x}
              y={y}
              width={stageWidth}
              height={stageHeight}
              rx={28}
              fill="url(#armando-stage)"
            />
            <g>
              {titleLines.map((line, lineIndex) => (
                <text
                  key={lineIndex}
                  x={x + stageWidth / 2}
                  y={y + 46 + lineIndex * 20}
                  textAnchor="middle"
                  fontSize={18}
                  fontWeight={700}
                  fill="white"
                >
                  {line}
                </text>
              ))}
              {subtitleLines.map((line, lineIndex) => (
                <text
                  key={line}
                  x={x + stageWidth / 2}
                  y={y + 46 + titleLines.length * 20 + 18 + lineIndex * 18}
                  textAnchor="middle"
                  fontSize={14}
                  fill="rgba(226,232,240,0.85)"
                >
                  {line}
                </text>
              ))}
            </g>
            {index < stages.length - 1 ? (
              <g>
                <line
                  x1={x + stageWidth}
                  y1={y + stageHeight / 2}
                  x2={x + stageWidth + gap}
                  y2={y + stageHeight / 2}
                  stroke="#1e1b4b"
                  strokeWidth={5}
                  strokeLinecap="round"
                />
                <polygon
                  points={`${x + stageWidth + gap},${y + stageHeight / 2} ${x + stageWidth + gap - 18},${
                    y + stageHeight / 2 - 10
                  } ${x + stageWidth + gap - 18},${y + stageHeight / 2 + 10}`}
                  fill="#1e1b4b"
                />
              </g>
            ) : null}
          </Fragment>
        )
      })}
      <path
        d={`M ${paddingX + stageWidth / 2} ${paddingY + stageHeight + 28}
            C ${paddingX + stageWidth / 2} ${totalHeight - 40}, ${totalWidth - paddingX - stageWidth / 2} ${totalHeight - 40}, ${
          totalWidth - paddingX - stageWidth / 2
        } ${paddingY + stageHeight + 28}`}
        fill="none"
        stroke="#94a3b8"
        strokeWidth={3}
        strokeDasharray="10 10"
        strokeLinecap="round"
      />
      <text
        x={totalWidth / 2}
        y={bottomLabelY}
        textAnchor="middle"
        fontSize={14}
        fill="#e2e8f0"
      >
        Цикл повторяется до окончания шоу
      </text>
    </svg>
  )
}

function VideoEmbedCard({ video }: { video: VideoResource }) {
  const preview = getVideoPreview(video.url)
  const targetUrl = preview?.canonicalUrl ?? video.url
  const shouldRenderIframe = preview?.platform === 'VK Видео' && Boolean(preview.embedUrl)

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-violet-400/40 bg-slate-950/70 shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        {shouldRenderIframe ? (
          <iframe
            src={preview.embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full"
          />
        ) : preview?.preview ? (
          <>
            <img
              src={preview.preview}
              alt={video.title}
              className="h-full w-full object-cover transition duration-500 ease-out"
              loading="lazy"
            />
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/20 text-white opacity-0 transition hover:opacity-100 focus-visible:opacity-100"
            >
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/70 text-3xl shadow-xl">
                ▶
              </span>
              <span className="text-sm font-semibold uppercase tracking-wide">Смотреть</span>
              <span className="sr-only">{`Открыть видео ${video.title}`}</span>
            </a>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-300">Предпросмотр недоступен</div>
        )}
        {!shouldRenderIframe && preview?.preview ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-950/50 via-slate-950/0 to-slate-950/60" />
        ) : null}
        {preview?.platform ? (
          <div className="pointer-events-none absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {preview.platform}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 p-5 text-slate-100">
        <h3 className="text-lg font-semibold leading-snug">
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-violet-200">
            {video.title}
          </a>
        </h3>
        <p className="text-sm text-violet-200/90">{video.lang === 'RU' ? 'Русский' : video.lang === 'EN' ? 'Английский' : video.lang ?? 'Язык не указан'}</p>
        {video.description ? (
          <p className="text-sm text-slate-300 leading-relaxed">{video.description}</p>
        ) : null}
      </div>
    </article>
  )
}

function FallbackVideoLink({ url }: { url: string }) {
  const [rawLink, ...rest] = url.split(' — ')
  const href = rawLink.trim()
  const infoParts = rest.map((part) => part.trim()).filter(Boolean)
  const [primaryLabel, ...details] = infoParts
  const label = primaryLabel ?? href
  const description = details.join(' — ')
  return (
    <li className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 text-sm text-slate-200">
      <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-violet-200 hover:text-violet-100 transition">
        {label}
      </a>
      {description ? <p className="mt-1 text-slate-300">{description}</p> : null}
    </li>
  )
}

function ResourcesGrid({ links }: { links: LinkResource[] }) {
  if (!links.length) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl border border-violet-400/30 bg-slate-950/70 p-5 transition hover:border-violet-200 hover:shadow-lg"
        >
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-violet-100">{link.title}</h3>
          {link.description ? <p className="mt-2 text-sm text-slate-300 leading-relaxed">{link.description}</p> : null}
        </a>
      ))}
    </div>
  )
}

function BooksShelf({ books }: { books: BookResource[] }) {
  if (!books.length) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {books.map((book) => (
        <article
          key={book.title}
          className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5 text-slate-100 shadow-md"
        >
          <h3 className="text-lg font-semibold text-amber-200">{book.title}</h3>
          <p className="text-sm text-amber-100/90">{book.authors}</p>
          {book.year ? <p className="text-xs uppercase tracking-wide text-amber-200/80">{book.year}</p> : null}
          <p className="mt-3 text-sm leading-relaxed text-slate-100">{book.description}</p>
          <a
            href={book.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-sm font-semibold text-amber-200 hover:text-amber-100"
          >
            Открыть источник →
          </a>
        </article>
      ))}
    </div>
  )
}

export function ArmandoPrototypeView({
  meta,
  tags,
  description,
  structure,
  openings,
  sceneHighlights,
  example,
  videos,
  resources,
}: ArmandoPrototypeViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-20">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <Link
            href="/formats/armando"
            className="text-sm font-semibold text-violet-200 transition hover:text-violet-100"
          >
            ← Назад к текущей версии страницы
          </Link>
          <Link href="/" className="text-sm font-semibold text-violet-200 transition hover:text-violet-100">
            ← Каталог форматов
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-5">
              <span className="text-5xl" aria-hidden>
                {meta.emoji}
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-violet-200/80">Импровизационный формат</p>
                <h1 className="text-4xl font-black text-white">{meta.titleRu}</h1>
                <p className="text-lg text-violet-100">{meta.titleEn}</p>
              </div>
            </div>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-100/95">{meta.tagline}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/15 px-4 py-2 text-sm text-violet-50"
              >
                <span className="font-semibold text-violet-200/90">{tag.label}:</span> {tag.value}
              </span>
            ))}
          </div>

          <Link
            href="/prototype/armando/infographic"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/60 hover:text-emerald-50 md:w-auto"
          >
            <span aria-hidden>🗺️</span> Интерактивная инфографика формата
          </Link>
        </section>

        <Collapsible
          title={`📖 Подробное описание`}
          defaultOpen
          className="border-white/15 bg-white/5 backdrop-blur"
          contentClassName="text-slate-100"
          headerClassName="text-slate-100/90 hover:bg-violet-500/10"
          titleClassName="text-white drop-shadow-sm"
          chevronClassName="text-violet-100"
        >
          <div className="space-y-4 text-base leading-relaxed">
            {description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Collapsible>

        <Collapsible
          title={`🧭 Структура формата`}
          defaultOpen
          className="border-white/15 bg-white/5 backdrop-blur"
          contentClassName="space-y-6 text-slate-100"
          headerClassName="text-slate-100/90 hover:bg-violet-500/10"
          titleClassName="text-white drop-shadow-sm"
          chevronClassName="text-violet-100"
        >
          <p className="text-base leading-relaxed text-slate-100/90">{structure.overview}</p>
          <ArmandoFlowDiagram stages={structure.stages} />
          {structure.montage ? (
            <p className="rounded-2xl border border-violet-400/30 bg-violet-500/20 px-5 py-4 text-sm leading-relaxed text-violet-50">
              <strong className="text-violet-100">Монтаж:</strong> {structure.montage}
            </p>
          ) : null}
        </Collapsible>

        {openings.length ? (
          <Collapsible
            title={`🎤 Opening — монологические структуры`}
            defaultOpen
            className="border-white/15 bg-white/5 backdrop-blur"
            contentClassName="space-y-6 text-slate-100"
            headerClassName="text-slate-100/90 hover:bg-violet-500/10"
            titleClassName="text-white drop-shadow-sm"
            chevronClassName="text-violet-100"
          >
            <p className="text-base leading-relaxed text-slate-100/90">
              Armando начинается с монолога, который задаёт эмоциональный вектор шоу. Популярные подходы к построению монологов:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {openings.map((opening, index) => (
                <article
                  key={opening.name}
                  className="rounded-2xl border border-violet-400/40 bg-violet-500/15 p-5 shadow-lg"
                >
                  <h3 className="flex items-start gap-3 text-lg font-semibold text-white">
                    <span aria-hidden className="text-2xl">
                      {['🎙️', '👥', '🎭', '✨', '🎧', '🎞️'][index] ?? '🎙️'}
                    </span>
                    <span>{opening.name}</span>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-100/90">{opening.description}</p>
                  {opening.howItWorks ? (
                    <p className="mt-2 text-sm leading-relaxed text-violet-100/90">
                      <strong className="text-violet-50">Как работает:</strong> {opening.howItWorks}
                    </p>
                  ) : null}
                  {opening.example ? (
                    <p className="mt-2 text-sm italic leading-relaxed text-violet-100/80">Пример: {opening.example}</p>
                  ) : null}
                  {opening.result ? (
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-violet-200/70">
                      Результат: {opening.result}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </Collapsible>
        ) : null}

        <Collapsible
          title={`🎬 Основные сцены`}
          defaultOpen
          className="border-white/15 bg-white/5 backdrop-blur"
          contentClassName="space-y-8 text-slate-100"
          headerClassName="text-slate-100/90 hover:bg-violet-500/10"
          titleClassName="text-white drop-shadow-sm"
          chevronClassName="text-violet-100"
        >
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Что делает сцены Armando уникальными</h3>
            <ul className="space-y-2 text-sm leading-relaxed text-slate-100">
              {sceneHighlights.uniqueHighlights.map((rule) => (
                <li key={rule} className="flex gap-3">
                  <span className="mt-1 text-violet-200">•</span>
                  <span
                    className="[&_strong]:text-white [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: convertMarkdown(rule) }}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {sceneHighlights.components.map((component) => (
              <article
                key={component.name}
                className="rounded-2xl border border-white/15 bg-slate-950/70 p-5 shadow-lg"
              >
                <h4 className="text-lg font-semibold text-white">{component.name}</h4>
                {component.duration ? (
                  <p className="text-xs uppercase tracking-[0.35em] text-violet-200/70">{component.duration}</p>
                ) : null}
                <p className="mt-3 text-sm leading-relaxed text-slate-200">{component.description}</p>
                {component.example ? (
                  <p className="mt-3 text-sm leading-relaxed text-violet-100/90">
                    <strong className="text-violet-50">Пример сцены:</strong> {component.example.description}
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-violet-400/40 bg-violet-500/15 p-5 shadow-lg">
              <h4 className="text-lg font-semibold text-white">Навыки, которые тренирует формат</h4>
              <div className="mt-4 grid gap-3 text-sm text-slate-100 md:grid-cols-2">
                {sceneHighlights.skills.map((column, columnIndex) => (
                  <ul key={columnIndex} className="space-y-2">
                    {column.map((skill) => (
                      <li key={skill} className="flex gap-2">
                        <span className="text-violet-200">•</span>
                        <span className="capitalize">{skill.replace(/-/g, ' ')}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-violet-400/40 bg-violet-500/15 p-5 shadow-lg">
              <h4 className="text-lg font-semibold text-white">Педагогический фокус</h4>
              <p className="mt-3 text-sm leading-relaxed text-slate-100/90">{sceneHighlights.focus}</p>
              <div className="mt-3 space-y-2 text-sm text-violet-100/90">
                <p>
                  <strong className="text-violet-50">Вариации:</strong> {sceneHighlights.variations.join('; ')}
                </p>
                <p>
                  <strong className="text-violet-50">Похожие форматы:</strong> {sceneHighlights.similarTo.join('; ')}
                </p>
                <p>
                  <strong className="text-violet-50">Перед стартом:</strong> {sceneHighlights.prerequisites.join('; ')}
                </p>
              </div>
            </div>
          </div>

          {sceneHighlights.notes ? (
            <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5 text-amber-50 shadow-md">
              <h4 className="text-lg font-semibold">Практическая заметка</h4>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{sceneHighlights.notes}</p>
            </div>
          ) : null}
        </Collapsible>

        {example ? (
          <Collapsible
            title={`📝 Пример шоу от начала до конца`}
            defaultOpen
            className="border-white/15 bg-white/5 backdrop-blur"
            contentClassName="space-y-6 text-slate-100"
            headerClassName="text-slate-100/90 hover:bg-violet-500/10"
            titleClassName="text-white drop-shadow-sm"
            chevronClassName="text-violet-100"
          >
            <div className="flex flex-wrap gap-4">
              {example.theme ? (
                <div className="rounded-2xl border border-violet-400/40 bg-violet-500/15 px-5 py-4 text-sm text-violet-50">
                  <strong className="text-violet-100">Тема:</strong> {example.theme}
                </div>
              ) : null}
              {example.monologist ? (
                <div className="rounded-2xl border border-violet-400/40 bg-violet-500/15 px-5 py-4 text-sm text-violet-50">
                  <strong className="text-violet-100">Монологист:</strong> {example.monologist}
                </div>
              ) : null}
            </div>
            <div className="space-y-5">
              {example.rounds.map((round) => (
                <article key={round.number} className="rounded-3xl border border-white/15 bg-slate-950/70 p-6 shadow-xl">
                  <header className="flex items-center justify-between gap-4">
                    <h3 className="text-2xl font-semibold text-white">Раунд {round.number}</h3>
                    <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-violet-100">
                      Монолог {round.number} • {round.monologue.duration}
                    </span>
                  </header>
                  <p className="mt-4 text-base leading-relaxed text-slate-200">{round.monologue.summary}</p>
                  {round.monologue.keyDetails?.length ? (
                    <p className="mt-3 text-xs uppercase tracking-[0.35em] text-violet-200/80">
                      Ключевые детали: {round.monologue.keyDetails.join(', ')}
                    </p>
                  ) : null}
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {round.scenes.map((scene) => (
                      <div key={scene.number} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-200">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-100">
                          Сцена {scene.number}
                        </h4>
                        <p className="mt-2">{scene.description}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            {example.themes ? (
              <p className="rounded-2xl border border-violet-400/30 bg-violet-500/15 px-5 py-4 text-sm leading-relaxed text-violet-50">
                <strong className="text-violet-100">Общие темы:</strong> {example.themes}
              </p>
            ) : null}
          </Collapsible>
        ) : null}

        {(videos.featured.length > 0 || videos.fallback.length > 0) && (
          <Collapsible
            title={`🎥 Видео`}
            defaultOpen
            className="border-white/15 bg-white/5 backdrop-blur"
            contentClassName="space-y-6 text-slate-100"
            headerClassName="text-slate-100/90 hover:bg-violet-500/10"
            titleClassName="text-white drop-shadow-sm"
            chevronClassName="text-violet-100"
          >
            {videos.featured.length ? (
              <div className="grid gap-5 md:grid-cols-2">
                {videos.featured.map((video) => (
                  <VideoEmbedCard key={video.url} video={video} />
                ))}
              </div>
            ) : null}
            {videos.fallback.length ? (
              <div>
                <h3 className="text-lg font-semibold text-white">Дополнительные источники</h3>
                <ul className="mt-3 space-y-3">
                  {videos.fallback.map((url) => (
                    <FallbackVideoLink key={url} url={url} />
                  ))}
                </ul>
              </div>
            ) : null}
          </Collapsible>
        )}

        {(resources.links.length > 0 || resources.books.length > 0) && (
          <Collapsible
            title={`🔗 Ссылки и источники`}
            defaultOpen
            className="border-white/15 bg-white/5 backdrop-blur"
            contentClassName="space-y-6 text-slate-100"
            headerClassName="text-slate-100/90 hover:bg-violet-500/10"
            titleClassName="text-white drop-shadow-sm"
            chevronClassName="text-violet-100"
          >
            {resources.links.length ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Полезные ссылки</h3>
                <ResourcesGrid links={resources.links} />
              </div>
            ) : null}
            {resources.books.length ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Книги</h3>
                <BooksShelf books={resources.books} />
              </div>
            ) : null}
          </Collapsible>
        )}
      </main>
    </div>
  )
}

export default ArmandoPrototypeView
