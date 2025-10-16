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

type FeatureSection = {
  id: string
  icon: string
  title: string
  description?: string
  details: string[]
  defaultOpen?: boolean
}

function FlowStepCard({ step, index, total }: { step: FlowStep; index: number; total: number }) {
  const title = `${step.icon} ${step.title}${step.subtitle ? ` · ${step.subtitle}` : ''}`

  return (
    <div className="relative pl-16">
      <div className="absolute left-2 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-violet-400/60 bg-slate-950/90 text-lg font-semibold text-violet-100 shadow-[0_10px_30px_rgba(124,58,237,0.25)]">
        {index + 1}
      </div>
      {index < total - 1 ? (
        <div className="absolute left-7 top-12 h-[calc(100%-16px)] w-px bg-gradient-to-b from-violet-400/60 via-violet-400/10 to-transparent" aria-hidden />
      ) : null}

      {step.transitionNote ? (
        <p className="mb-4 ml-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-200 shadow-sm">
          {step.transitionNote}
        </p>
      ) : null}

      <Collapsible
        title={title}
        defaultOpen={index === 0}
        className="border-white/15 bg-white/5 backdrop-blur"
        contentClassName="space-y-4 text-sm leading-relaxed text-slate-100"
        headerClassName="text-slate-100/90 hover:bg-violet-500/10"
        titleClassName="text-base font-semibold text-white"
        chevronClassName="text-violet-100"
      >
        {step.description ? <p className="text-slate-100/90">{step.description}</p> : null}
        {step.details?.length ? (
          <ul className="space-y-2 text-slate-100/90">
            {step.details.map((detail) => (
              <li key={detail} className="flex gap-2">
                <span className="mt-1 text-violet-300">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </Collapsible>
    </div>
  )
}

function FeatureSectionCard({ section }: { section: FeatureSection }) {
  return (
    <Collapsible
      title={`${section.icon} ${section.title}`}
      defaultOpen={section.defaultOpen}
      className="border-white/15 bg-white/5 backdrop-blur"
      contentClassName="space-y-3 text-sm leading-relaxed text-slate-100"
      headerClassName="text-slate-100/90 hover:bg-violet-500/10"
      titleClassName="text-base font-semibold text-white"
      chevronClassName="text-violet-100"
    >
      {section.description ? <p className="text-slate-100/90">{section.description}</p> : null}
      <ul className="space-y-2 text-slate-100/90">
        {section.details.map((detail) => (
          <li key={detail} className="flex gap-2">
            <span className="mt-1 text-violet-300">•</span>
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </Collapsible>
  )
}

export default function ArmandoInfographicPage() {
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
        'Одно слово или короткая фраза становится отправной точкой шоу.',
        'Ведущий или участник быстро фиксирует подсказку и передает её монологисту.',
      ],
    },
    {
      id: 'monologue-one',
      icon: '🎙️',
      title: 'Монолог',
      subtitle: monologueOne?.duration,
      description: monologueOne?.description,
      details: [
        'История должна быть реальной, насыщенной деталями, персонажами и эмоциями.',
        'Монологистом может быть приглашённый гость или любой участник команды.',
        'Команда внимательно слушает, не планируя сцены заранее, а отмечая вдохновляющие детали.',
      ],
    },
    {
      id: 'scenes-one',
      icon: '🎭',
      title: 'Серия сцен',
      subtitle: scenesOne?.duration,
      description: scenesOne?.description,
      details: [
        'Сцены расширяют темы, эмоции и детали монолога вместо буквального пересказа.',
        'Игроки ищут паттерны, образы и персонажей, которые можно развивать или контрастировать.',
        'Возвраты к монологу возможны через атмосферу, а не прямые цитаты.',
      ],
    },
    {
      id: 'monologue-two',
      icon: '🔄',
      title: 'Новый монолог',
      subtitle: monologueTwo?.duration,
      description: monologueTwo?.description,
      details: [
        'Монологист может поменяться: второй монолог реагирует на сыгранные сцены или возвращается к исходному слову.',
        'Новая волна тем и деталей вдохновляет следующую серию сцен.',
        'Монолог завершает или мягко монтируется, когда импульс исчерпан.',
      ],
      transitionNote: 'Энергия падает или требуется новый фокус? Включаем свежий монолог.',
    },
    {
      id: 'scenes-two',
      icon: '🧵',
      title: 'Новая серия сцен',
      subtitle: scenesTwo?.duration,
      description: scenesTwo?.description,
      details: [
        'Игроки возвращают любимые персонажи и темы, запускают коллбэки и вариации.',
        'Связи между сценами могут быть явными или тонкими — главное, чтобы развивалась эмоциональная линия.',
        'Команда чувствует общий импульс и подготавливает почву для финала.',
      ],
    },
    {
      id: 'finale',
      icon: '🏁',
      title: 'Финал',
      subtitle: format.duration,
      description: cycle?.description,
      details: [
        'Цикл «монолог → сцены» повторяется до естественной кульминации шоу (20–30 минут).',
        'Последние сцены собирают темы, эмоции и персонажей, предлагая эмоциональное завершение.',
        'Финал может объединить линии или оставить открытые вопросы — ориентируйтесь на правду момента.',
      ],
    },
  ]

  const featureSections: FeatureSection[] = [
    {
      id: 'monologue',
      icon: '🗣️',
      title: 'Монолог',
      details: [
        'Истории должны быть правдивыми и заканчиваться естественно, без форсированного финала.',
        'Рассказчик может меняться от монолога к монологу, реагируя на события сцен.',
        'Монологи работают как опенинг: они не задают директив, а предлагают вдохновение.',
        'Используйте детали — имена, локации, эмоции — чтобы подарить команде богатый материал.',
      ],
      defaultOpen: true,
    },
    {
      id: 'scenes',
      icon: '🎬',
      title: 'Сцены',
      details: [
        'Деконструируйте истории: ищите третий, менее очевидный ход вместо повторения сюжета.',
        'Сцены вдохновляются не только монологом, но и друг другом, позволяя паттернам расти органично.',
        'Коллбэки и возвраты появляются через групповое внимание, а не через заранее придуманные планы.',
        'Используйте разные типы монтажа — sweep, tag-out, transformation — чтобы поддерживать динамику.',
      ],
    },
    {
      id: 'structure',
      icon: '🧭',
      title: 'Структура',
      details: [
        'После 2–3 сцен команда возвращается к монологу, когда чувствует спад энергии.',
        'Гибкая длина выступления: обычно 20–30 минут, но ориентируйтесь на ощущение полного цикла.',
        'Финал соединяет ключевые темы и отношения, даже если сюжеты остаются открытыми.',
        'Методы редактирования должны быть понятны всем участникам заранее.',
      ],
    },
    {
      id: 'philosophy',
      icon: '🧠',
      title: 'Философия',
      details: [
        'Эмоциональная правда важнее буквальной шутки — реагируйте сердцем, а не только логикой.',
        'Слушайте глубже, чем понимаете: запоминайте чувства, паузы и образы.',
        "Third Thought — ищите не первую идею, а третью, более интересную и неожиданную.",
        'Group mind строится через доверие импульсам партнёров и готовность поддержать их.',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <Link
            href="/prototype/armando"
            className="text-sm font-semibold text-violet-200 transition hover:text-violet-100"
          >
            ← Назад к прототипу
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-violet-200 transition hover:text-violet-100"
          >
            ← Каталог форматов
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-5">
              <span className="text-5xl" aria-hidden>
                🎙️
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-violet-200/80">Интерактивная схема</p>
                <h1 className="text-4xl font-black text-white">Армандо — интерактивная инфографика</h1>
                <p className="text-lg text-violet-100">Монолог → Сцены → Цикл</p>
              </div>
            </div>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-100/95">{format.shortDescription}</p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/15 px-4 py-2 text-sm text-violet-50">
                <span className="font-semibold text-violet-200/90">Длительность:</span> {format.duration}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/15 px-4 py-2 text-sm text-violet-50">
                <span className="font-semibold text-violet-200/90">Игроки:</span> {format.minPlayers}–{format.maxPlayers}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/15 px-4 py-2 text-sm text-violet-50">
                <span className="font-semibold text-violet-200/90">Сложность:</span> Средний уровень
              </span>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Как развивается шоу</h2>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
              <div className="space-y-10">
                {flowSteps.map((step, index) => (
                  <FlowStepCard key={step.id} step={step} index={index} total={flowSteps.length} />
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Особенности формата</h2>
            <div className="space-y-5">
              {featureSections.map((section) => (
                <FeatureSectionCard key={section.id} section={section} />
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
