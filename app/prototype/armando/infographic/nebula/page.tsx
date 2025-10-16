import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Collapsible } from '@/components/ui/collapsible'
import { isStructuredFormat } from '@/lib/format-types'
import { getFormatById } from '@/lib/formats'

type FlowStep = {
  id: string
  icon: string
  title: string
  subtitle?: string
  description?: string
  details?: string[]
  transitionNote?: string
}

type InsightCluster = {
  id: string
  title: string
  accent: string
  bullets: string[]
}

type AtmosphereCard = {
  id: string
  title: string
  description: string
  tags: string[]
}

function FlowOrbit({ steps }: { steps: FlowStep[] }) {
  const radiusLayers = [32, 40, 46, 38, 44, 36]

  return (
    <div className="relative mx-auto aspect-square w-full max-w-3xl">
      <div className="absolute inset-14 rounded-[50%] border border-white/10 bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent" aria-hidden />
      <div className="absolute inset-6 rounded-[50%] border border-violet-500/30 opacity-60" aria-hidden />
      <div className="absolute inset-1 rounded-[50%] border border-white/5" aria-hidden />
      <div className="absolute inset-0 animate-[spin_40s_linear_infinite] rounded-[50%] border border-violet-400/20" aria-hidden />

      <div className="absolute inset-[22%] rounded-[50%] border border-dashed border-violet-400/30 opacity-70" aria-hidden />
      <div className="absolute inset-[46%] rounded-[50%] border border-dashed border-violet-400/30 opacity-50" aria-hidden />

      <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[40%] border border-white/10 bg-violet-500/15 text-center shadow-[0_0_50px_rgba(139,92,246,0.25)]">
        <span className="text-4xl" aria-hidden>
          🌌
        </span>
        <p className="text-xs uppercase tracking-[0.35em] text-violet-200/80">Пульс шоу</p>
        <p className="text-base font-semibold text-white">Монолог ↔ Сцены</p>
      </div>

      {steps.map((step, index) => {
        const angle = (index / steps.length) * Math.PI * 2 - Math.PI / 2
        const radius = radiusLayers[index % radiusLayers.length]
        const x = 50 + radius * Math.cos(angle)
        const y = 50 + radius * Math.sin(angle)

        return (
          <div
            key={step.id}
            style={{ top: `${y}%`, left: `${x}%` }}
            className="group absolute flex w-48 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
          >
            <div className="mb-3 flex items-center gap-2 rounded-full border border-violet-500/30 bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-violet-200/90 shadow-lg">
              <span className="text-base">{index + 1}</span>
              <span className="font-semibold">Этап</span>
            </div>
            <Collapsible
              title={`${step.icon} ${step.title}${step.subtitle ? ` · ${step.subtitle}` : ''}`}
              defaultOpen={index === 0}
              className="w-full border-white/15 bg-slate-950/80 backdrop-blur"
              contentClassName="space-y-3 text-sm leading-relaxed text-slate-100"
              headerClassName="rounded-2xl text-white transition hover:bg-violet-500/15"
              titleClassName="text-sm font-semibold"
              chevronClassName="text-violet-100"
            >
              {step.description ? <p className="text-slate-100/90">{step.description}</p> : null}
              {step.details?.length ? (
                <ul className="space-y-2 text-left text-slate-100/90">
                  {step.details.map(detail => (
                    <li key={detail} className="flex gap-2">
                      <span className="text-violet-300">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {step.transitionNote ? (
                <p className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                  {step.transitionNote}
                </p>
              ) : null}
            </Collapsible>
          </div>
        )
      })}
    </div>
  )
}

function InsightMosaic({ clusters }: { clusters: InsightCluster[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {clusters.map(cluster => (
        <div
          key={cluster.id}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-950/60 to-slate-900/70 p-6 shadow-xl backdrop-blur"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.25),_transparent_60%)]" aria-hidden />
          <div className="flex items-center gap-3">
            <span className="text-3xl">{cluster.accent}</span>
            <h3 className="text-lg font-semibold text-white">{cluster.title}</h3>
          </div>
          <ul className="mt-5 space-y-3 text-sm text-slate-100/90">
            {cluster.bullets.map(bullet => (
              <li key={bullet} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-violet-400" aria-hidden />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function AtmosphereGrid({ cards }: { cards: AtmosphereCard[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(card => (
        <div
          key={card.id}
          className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/20 via-violet-500/10 to-slate-950/90 p-6 shadow-2xl backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_40px_120px_rgba(139,92,246,0.45)]"
        >
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-400/20 blur-3xl transition duration-300 group-hover:scale-150" aria-hidden />
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">{card.title}</h4>
            <p className="text-sm leading-relaxed text-violet-100/90">{card.description}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {card.tags.map(tag => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ArmandoInfographicNebulaPage() {
  const format = getFormatById('armando')

  if (!format || !isStructuredFormat(format)) {
    notFound()
  }

  const [suggestion, monologueOne, scenesOne, monologueTwo, scenesTwo, cycle] = format.components

  const flowSteps: FlowStep[] = [
    {
      id: 'suggestion',
      icon: '💡',
      title: 'Подсказка от зала',
      subtitle: suggestion?.duration,
      description: suggestion?.description,
      details: [
        'Одно слово или короткая фраза становятся импульсом и атмосферой вечера.',
        'Ведущий быстро фиксирует подсказку и передаёт её монологисту без обсуждений.',
      ],
    },
    {
      id: 'monologue-one',
      icon: '🎙️',
      title: 'Первый монолог',
      subtitle: monologueOne?.duration,
      description: monologueOne?.description,
      details: [
        'История должна быть правдивой и наполненной текстурами реальности: запахи, детали, имена.',
        'Монологистом может стать приглашённый гость или любой игрок, который почувствовал импульс.',
        'Команда слушает без планов — только с открытыми антеннами к вдохновляющим моментам.',
      ],
    },
    {
      id: 'scenes-one',
      icon: '🎭',
      title: 'Орбита сцен',
      subtitle: scenesOne?.duration,
      description: scenesOne?.description,
      details: [
        'Сцены реагируют на эмоцию, ритм или образ, а не на дословные события монолога.',
        'Игроки ищут неожиданные паттерны и могут запускать мини-циклы внутри серии.',
        'Возможны мягкие возвраты к монологу через атмосферу, музыку речи, жесты.',
      ],
    },
    {
      id: 'monologue-two',
      icon: '🔄',
      title: 'Новый монолог',
      subtitle: monologueTwo?.duration,
      description: monologueTwo?.description,
      details: [
        'Монологист может поменяться: второй монолог отражает сыгранные сцены или переосмысляет исходное слово.',
        'Он запускает новую волну тем и деталей, подсказывая свежие связи.',
      ],
      transitionNote: 'Когда импульс сцен снижает скорость — возвращаемся к голосу рассказчика.',
    },
    {
      id: 'scenes-two',
      icon: '🌀',
      title: 'Вторая орбита',
      subtitle: scenesTwo?.duration,
      description: scenesTwo?.description,
      details: [
        'Коллектив подхватывает любимых персонажей, позволяет коллбэкам и контрастам разворачиваться.',
        'Связи между сценами могут быть видимыми или едва ощутимыми — важно ощущение общего поля.',
      ],
    },
    {
      id: 'cycle',
      icon: '🏁',
      title: 'Цикл и финал',
      subtitle: format.duration,
      description: cycle?.description,
      details: [
        'Цикл «монолог → сцены» повторяется, пока группа чувствует нарастание или мягкое завершение.',
        'Финал собирает ключевые темы, оставляя зрителя в эмоции, а не в объяснении.',
      ],
    },
  ]

  const insightClusters: InsightCluster[] = [
    {
      id: 'story',
      title: 'Глубина монолога',
      accent: '🗣️',
      bullets: [
        'Собирайте биографические детали, чтобы игроки могли играть «большими мазками».',
        'Позвольте истории закончиться естественно — пауза иногда громче punchline.',
        'Меняйте рассказчиков, чтобы вся команда ощущала ответственность за ритм.',
      ],
    },
    {
      id: 'montage',
      title: 'Монтаж как дыхание',
      accent: '🎬',
      bullets: [
        'Чередуйте sweep, tag-out и тихие переходы, реагируя на энергию зала.',
        'Планируйте «третью мысль»: ищите неожиданные углы вместо прямой иллюстрации.',
        'Используйте групповую игру и фоновые картинки, чтобы расширять мир.',
      ],
    },
    {
      id: 'mindset',
      title: 'Психология команды',
      accent: '🧠',
      bullets: [
        'Слушайте глубже, чем понимаете: фиксируйте эмоции, повторы, паузы.',
        'Доверяйте импульсам партнёров и поддерживайте их, даже если путь кажется странным.',
        'Готовьте коллективную культуру быстрых возвратов и смелых заявок.',
      ],
    },
  ]

  const atmosphereCards: AtmosphereCard[] = [
    {
      id: 'tone',
      title: 'Тон вечера',
      description: 'Правда и юмор сосуществуют — мы смеёмся над искренностью, а не над персонажем.',
      tags: ['правда', 'отклик зала'],
    },
    {
      id: 'space',
      title: 'Пространство сцены',
      description: 'Игроки создают визуальные композиции, опираясь на воображение: не бойтесь пустоты.',
      tags: ['визуальность', 'композиция'],
    },
    {
      id: 'music',
      title: 'Музыкальность речи',
      description: 'Монологи звучат как песни — с ритмом, повторениями, динамикой, даже если без аккомпанемента.',
      tags: ['ритм', 'интонация'],
    },
    {
      id: 'audience',
      title: 'Связь с залом',
      description: 'Подсказка — не формальность, а приглашение зрителей участвовать эмоционально.',
      tags: ['интерактив', 'энергия'],
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.35),_transparent_60%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.25),_transparent_55%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,_rgba(15,23,42,0.9),_rgba(15,23,42,0.6))]" aria-hidden />

      <header className="relative z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <Link href="/prototype/armando" className="text-sm font-semibold text-violet-200 transition hover:text-violet-100">
            ← Назад к прототипу
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-semibold text-violet-200 transition hover:text-violet-100">
              Каталог форматов
            </Link>
            <span className="rounded-full border border-violet-500/40 bg-violet-500/15 px-4 py-1 text-xs uppercase tracking-[0.35em] text-violet-100/80">
              Nebula версия
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-violet-500/20 via-slate-950/80 to-slate-950/95 p-10 shadow-[0_60px_140px_rgba(139,92,246,0.35)]">
          <div className="absolute -left-20 top-1/2 h-60 w-60 -translate-y-1/2 rounded-full bg-violet-400/20 blur-3xl" aria-hidden />
          <div className="absolute -right-24 -top-16 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" aria-hidden />
          <div className="grid gap-10 lg:grid-cols-[1.4fr,1fr] lg:items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="text-5xl" aria-hidden>
                  🎇
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.5em] text-violet-200/80">Армандо</p>
                  <h1 className="text-4xl font-black text-white md:text-5xl">Инфографика Nebula</h1>
                </div>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-slate-100/90">
                {format.shortDescription}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-violet-50">
                  <span className="font-semibold text-violet-200/90">Длительность:</span> {format.duration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-violet-50">
                  <span className="font-semibold text-violet-200/90">Игроки:</span> {format.minPlayers}–{format.maxPlayers}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-violet-50">
                  <span className="font-semibold text-violet-200/90">Сложность:</span> Средний уровень
                </span>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="absolute inset-6 rounded-[30%] border border-violet-400/30" aria-hidden />
              <div className="relative w-full max-w-sm rounded-[30%] border border-white/15 bg-slate-950/80 p-8 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-violet-200/70">Миссия шоу</p>
                <p className="mt-4 text-2xl font-semibold text-white">Включить коллективное воображение через живую историю и мгновенные связи.</p>
                <p className="mt-6 text-sm text-slate-100/80">
                  Монолог задаёт орбиту, сцены меняют гравитацию, финал собирает эмоцию вечера.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-12 lg:grid-cols-[1.3fr,1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-violet-500/20 text-center text-2xl leading-10" aria-hidden>
                ☄️
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-violet-200/70">Орбитальная схема</p>
                <h2 className="text-3xl font-bold text-white">Как двигается Армандо</h2>
              </div>
            </div>
            <FlowOrbit steps={flowSteps} />
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-slate-900/80 p-8 shadow-2xl">
            <div className="absolute -right-10 top-16 h-32 w-32 rounded-full bg-violet-400/20 blur-3xl" aria-hidden />
            <div className="absolute -left-16 bottom-0 h-36 w-36 rounded-full bg-sky-400/10 blur-3xl" aria-hidden />
            <h3 className="text-lg font-semibold text-white">Энергия цикла</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-100/90">
              Пульс формата — возвращение к голосу рассказчика всякий раз, когда сцены выдыхаются или требуют нового фокуса.
              Используйте короткие паузы, свет или музыку, чтобы обозначить смену орбиты.
            </p>
            <div className="mt-6 space-y-4 text-sm text-slate-100/80">
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-violet-200/70">Триггеры возврата</p>
                <ul className="mt-2 space-y-2">
                  <li>• Упала энергия и смех зала стал редким.</li>
                  <li>• Появилась сцена, просящая комментария «из жизни».</li>
                  <li>• Игроки почувствовали готовность сменить перспективу.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-violet-200/70">Для ведущего</p>
                <p className="mt-2">Следите за дыханием зала, сигналами команды и будьте готовы пригласить нового монологиста в любой момент.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-violet-500/20 text-center text-2xl leading-10" aria-hidden>
              🔮
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-violet-200/70">Режиссёрские точки</p>
              <h2 className="text-3xl font-bold text-white">Команда на одной волне</h2>
            </div>
          </div>
          <InsightMosaic clusters={insightClusters} />
        </section>

        <section className="space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-violet-500/20 text-center text-2xl leading-10" aria-hidden>
              🌠
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-violet-200/70">Атмосфера шоу</p>
              <h2 className="text-3xl font-bold text-white">Как звучит и ощущается Армандо</h2>
            </div>
          </div>
          <AtmosphereGrid cards={atmosphereCards} />
        </section>
      </main>
    </div>
  )
}
