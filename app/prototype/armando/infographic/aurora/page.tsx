import Link from 'next/link'
import { notFound } from 'next/navigation'

import { isStructuredFormat } from '@/lib/format-types'
import { getFormatById } from '@/lib/formats'

const orbitColors = ['from-violet-400/80 to-sky-400/40', 'from-emerald-400/70 to-teal-400/40', 'from-rose-400/80 to-orange-400/30', 'from-blue-400/80 to-indigo-400/40']

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
  emphasis?: string
}

export default function ArmandoAuroraPage() {
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
        'Короткая подсказка из зала становится зерном всего вечера.',
        'Фасилитатор фиксирует слово и передает монологисту импульс.',
      ],
      transitionNote: 'Стартовая искра',
    },
    {
      id: 'monologue-one',
      icon: '🎙️',
      title: 'Первый монолог',
      subtitle: monologueOne?.duration,
      description: monologueOne?.description,
      details: [
        'Реальная история с яркими деталями и эмоциями.',
        'Команда слушает, отмечая неожиданные нюансы и повороты.',
      ],
      transitionNote: 'Создаём вселенную',
    },
    {
      id: 'scenes-one',
      icon: '🎭',
      title: 'Первая орбита сцен',
      subtitle: scenesOne?.duration,
      description: scenesOne?.description,
      details: [
        'Сцены исследуют эмоции и отношения, а не сюжет монолога.',
        'Появляются персонажи-резонаторы и параллельные миры.',
      ],
      transitionNote: 'Переводим импульсы в действие',
    },
    {
      id: 'monologue-two',
      icon: '🔄',
      title: 'Новый монолог',
      subtitle: monologueTwo?.duration,
      description: monologueTwo?.description,
      details: [
        'Монологист реагирует на сцены или возвращает нас к исходной теме.',
        'Предлагает свежую волну образов и эмоций.',
      ],
      transitionNote: 'Перезагрузка энергии',
    },
    {
      id: 'scenes-two',
      icon: '🧵',
      title: 'Вторая орбита сцен',
      subtitle: scenesTwo?.duration,
      description: scenesTwo?.description,
      details: [
        'Возвраты, вариации и эмоциональные дуги переплетаются.',
        'Команда готовит почву для кульминации.',
      ],
      transitionNote: 'Соединяем паттерны',
    },
    {
      id: 'finale',
      icon: '🏁',
      title: 'Финальный цикл',
      subtitle: format.duration,
      description: cycle?.description,
      details: [
        'Команда чувствует общую вершину и завершает шоу органично.',
        'Последние сцены собирают все эмоциональные линии.',
      ],
      transitionNote: 'Выписываем точку',
    },
  ]

  const featureSections: FeatureSection[] = [
    {
      id: 'story',
      icon: '🧠',
      title: 'История как импульс',
      description: 'Монолог — не инструкция, а поле для исследования. Сцены подхватывают чувства, а не сюжет.',
      details: [
        'Собирайте текстуры: имена, запахи, мелкие подробности.',
        'Не бойтесь пауз: тишина — это тоже материал.',
        'Каждый монолог завершайте, когда энергия естественно «дышит».',
      ],
      emphasis: 'Тело истории важнее фабулы',
    },
    {
      id: 'ensemble',
      icon: '🤝',
      title: 'Ансамбль как оркестр',
      description: 'Игроки двигаются как созвездие — поддерживая и подхватывая импульсы друг друга.',
      details: [
        'После каждого монолога команда делает короткое «дыхание» вместе.',
        'В первой орбите ищите ширину тем, во второй — глубину персонажей.',
        'Коллбэки работают лучше, если возвращают чувство, а не шутку.',
      ],
      emphasis: 'Group mind формируется до шоу, а раскрывается на сцене',
    },
    {
      id: 'structure',
      icon: '🧭',
      title: 'Структура как карта',
      description: 'Армандо — цикл, где мы чувствуем момент для смены режима, а не сверяемся с таймером.',
      details: [
        'Повторяйте цикл монолог → сцены, пока импульс жив.',
        'В финале соединяйте линии через общие чувства или атмосферу.',
        'Монтируйте сцены разными способами: tag-out, sweep, вдох-выдох.',
      ],
      emphasis: 'Гибкость поддерживает подлинность',
    },
  ]

  const energyMoments = [
    {
      label: 'Исходная искра',
      description: 'Соберите чувство комнаты, чтобы монологист стартовал смело.',
    },
    {
      label: 'Экспансия тем',
      description: 'После первых сцен зафиксируйте, какие темы требуют углубления.',
    },
    {
      label: 'Перезапуск',
      description: 'Новый монолог меняет ритм и добавляет неожиданности.',
    },
    {
      label: 'Сплетение линий',
      description: 'Позвольте сценам переплестись, не стремясь к буквальному финалу.',
    },
    {
      label: 'Эхо финала',
      description: 'Соберите то, что отозвалось сильнее всего, и завершите на правде момента.',
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.35),_transparent_60%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[1200px] -translate-y-1/2 bg-gradient-to-br from-purple-900/40 via-slate-950 to-slate-950 blur-3xl" aria-hidden />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm font-semibold text-violet-200">
          <div className="flex items-center gap-4">
            <Link href="/prototype/armando" className="transition hover:text-violet-50">
              ← Назад к прототипу
            </Link>
            <span className="hidden text-violet-500/70 md:inline">/</span>
            <Link href="/prototype/armando/infographic" className="hidden transition hover:text-violet-50 md:inline">
              К классической инфографике
            </Link>
          </div>
          <Link href="/" className="transition hover:text-violet-50">
            Каталог форматов →
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-20 pt-16">
        <section className="relative grid gap-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_30px_120px_rgba(76,29,149,0.35)] backdrop-blur">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-400/40 via-sky-400/30 to-transparent blur-3xl" aria-hidden />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-400/30 via-cyan-400/20 to-transparent blur-3xl" aria-hidden />

          <div className="relative grid gap-12 lg:grid-cols-[1.3fr,1fr]">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-violet-200">
                Интерактивный прототип
              </p>
              <h1 className="text-4xl font-black text-white sm:text-5xl lg:text-6xl">Армандо · Орбитальная инфографика</h1>
              <p className="max-w-2xl text-lg text-slate-100/90 lg:text-xl">{format.shortDescription}</p>
              <div className="flex flex-wrap gap-4 text-sm text-violet-100/90">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/40 px-4 py-2">
                  <span className="text-violet-200/90">Длительность</span>
                  <span className="font-semibold text-white">{format.duration}</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/40 px-4 py-2">
                  <span className="text-violet-200/90">Игроки</span>
                  <span className="font-semibold text-white">{format.minPlayers}–{format.maxPlayers}</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/40 px-4 py-2">
                  <span className="text-violet-200/90">Цикл</span>
                  <span className="font-semibold text-white">Монолог → Сцены</span>
                </span>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-transparent blur-2xl" aria-hidden />
              <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-full border border-white/15 bg-slate-950/80 p-8">
                <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-100/80">
                  <span className="text-5xl">🌌</span>
                  <p className="mt-4 text-base font-semibold text-white">Формат развивается по орбитам</p>
                  <p className="mt-3 leading-relaxed">
                    Представьте каждую фазу как планету вокруг общего центра — правды момента. Мы вращаемся, пока энергия не соберётся в финал.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-16 lg:grid-cols-[1.4fr,1fr] lg:items-start">
          <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_20px_80px_rgba(76,29,149,0.25)] backdrop-blur">
            <header className="flex flex-col gap-2">
              <span className="text-sm uppercase tracking-[0.3em] text-violet-200/80">Орбита шоу</span>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Хореография этапов</h2>
              <p className="text-base text-slate-200/90">
                Расположите шаги по кругу, чтобы увидеть, как импульс движется по орбитам. Наведите курсор на элементы, чтобы читать подсказки.
              </p>
            </header>

            <div className="relative mx-auto aspect-square w-full max-w-3xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-white/20 bg-slate-950/80 text-center text-sm text-violet-100">
                  <div className="space-y-2 px-6">
                    <p className="text-lg font-semibold text-white">Центр импровизации</p>
                    <p>Правда момента + общее дыхание команды</p>
                  </div>
                </div>
              </div>

              {flowSteps.map((step, index) => {
                const angle = (index / flowSteps.length) * 360
                const rotation = angle - 90
                const radius = 230
                const transform = `rotate(${rotation}deg) translate(${radius}px) rotate(${-rotation}deg)`

                return (
                  <div
                    key={step.id}
                    className="absolute left-1/2 top-1/2 w-48 max-w-[11rem] text-center text-sm text-slate-100/90 transition hover:z-10 hover:scale-[1.02]"
                    style={{ transform }}
                  >
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur">
                      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-400/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" aria-hidden />
                      <div className="flex flex-col gap-2">
                        <p className="text-2xl" aria-hidden>
                          {step.icon}
                        </p>
                        <h3 className="text-base font-semibold text-white">{step.title}</h3>
                        {step.subtitle ? (
                          <p className="text-xs uppercase tracking-[0.2em] text-violet-200/70">{step.subtitle}</p>
                        ) : null}
                        {step.description ? (
                          <p className="text-xs leading-relaxed text-slate-200/80">{step.description}</p>
                        ) : null}
                        {step.transitionNote ? (
                          <div className="rounded-full border border-violet-400/40 bg-violet-500/15 px-3 py-1 text-[11px] font-medium text-violet-100">
                            {step.transitionNote}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="absolute inset-12 rounded-full border border-dashed border-violet-400/20" aria-hidden />
              <div className="absolute inset-24 rounded-full border border-dashed border-violet-400/10" aria-hidden />
              <div className="absolute inset-36 rounded-full border border-dashed border-violet-400/5" aria-hidden />
            </div>
          </div>

          <aside className="relative flex flex-col gap-6">
            <div className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-8 text-sm text-violet-100 shadow-[0_20px_70px_rgba(124,58,237,0.25)]">
              <p className="text-xs uppercase tracking-[0.3em] text-violet-100/70">Энергия цикла</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Контрольные точки</h3>
              <ul className="mt-6 space-y-4">
                {energyMoments.map((moment) => (
                  <li key={moment.label} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-sm font-semibold text-white">{moment.label}</p>
                    <p className="mt-2 text-xs leading-relaxed text-violet-100/90">{moment.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm leading-relaxed text-slate-200/90">
              <p>
                Поддерживайте зрителя в том же путешествии: что они чувствуют после каждой орбиты? Задавайте этот вопрос себе и команде во время шоу — он поможет удерживать энергию живой.
              </p>
            </div>
          </aside>
        </section>

        <section className="space-y-12 rounded-3xl border border-white/10 bg-slate-950/60 p-10 shadow-[0_30px_100px_rgba(15,23,42,0.45)]">
          <header className="flex flex-col gap-3">
            <span className="text-sm uppercase tracking-[0.3em] text-violet-200/80">Практикуем глубину</span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Тактика ансамбля</h2>
            <p className="max-w-3xl text-base text-slate-200/90">
              Используйте эти блоки как тренировочные карточки. Соберите свой собственный спринт подготовки к Армандо: выберите по одному пункту из каждой карточки и превращайте в упражнение.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            {featureSections.map((section, index) => (
              <div
                key={section.id}
                className={`group relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br ${orbitColors[index % orbitColors.length]} p-[1px]`}
              >
                <div className="relative flex h-full flex-col gap-5 rounded-[calc(theme(borderRadius.3xl)_-_.5rem)] bg-slate-950/80 p-6">
                  <div className="flex items-center justify-between text-sm text-violet-100/90">
                    <span className="text-3xl" aria-hidden>
                      {section.icon}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-violet-100/80">
                      Блок {index + 1}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                    {section.description ? (
                      <p className="text-sm leading-relaxed text-slate-200/90">{section.description}</p>
                    ) : null}
                  </div>
                  <ul className="space-y-3 text-sm text-slate-200/90">
                    {section.details.map((detail) => (
                      <li key={detail} className="flex gap-2 text-left">
                        <span className="mt-1 text-violet-300">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  {section.emphasis ? (
                    <div className="mt-auto rounded-2xl border border-violet-400/40 bg-violet-500/20 p-4 text-sm font-semibold text-white">
                      {section.emphasis}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400/10 via-transparent to-transparent" aria-hidden />
            <div className="relative flex h-full flex-col justify-between">
              <header className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-violet-100/70">Подготовка</p>
                <h2 className="text-3xl font-bold text-white">Ритуалы перед шоу</h2>
                <p className="text-sm text-slate-200/90">
                  Сформируйте короткий ритуал, который помогает команде настроиться на орбитальную структуру и общее дыхание.
                </p>
              </header>
              <ul className="mt-6 space-y-4 text-sm text-slate-200/90">
                <li className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="font-semibold text-white">Карта деталей</p>
                  <p className="mt-2 leading-relaxed">
                    Перед стартом возьмите случайное слово и сделайте 60-секундный мозговой штурм ассоциаций. Это разогревает внимание на деталях.
                  </p>
                </li>
                <li className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="font-semibold text-white">Синхронизация дыхания</p>
                  <p className="mt-2 leading-relaxed">
                    Встаньте в круг, закройте глаза, дышите в одном ритме и вслух проговаривайте эмоции, которые хотите исследовать.
                  </p>
                </li>
                <li className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="font-semibold text-white">Тренировка переходов</p>
                  <p className="mt-2 leading-relaxed">
                    Потренируйтесь в разных способах монтажа — sweep, tag-out, freeze — чтобы на сцене импульс не терялся на переходах.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-indigo-900/40 to-slate-950/80 p-10">
            <div className="absolute -top-10 right-16 h-32 w-32 rounded-full bg-gradient-to-br from-sky-400/30 via-violet-500/20 to-transparent blur-2xl" aria-hidden />
            <div className="relative space-y-8">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-violet-100/70">Визуальная подсказка</p>
                <h2 className="text-3xl font-bold text-white">Как ощущается идеальный Армандо</h2>
                <p className="text-sm text-slate-200/90">
                  Вообразите шоу как северное сияние: линия монолога — это магнитное поле, сцены — переливы света, а зритель — путешественник под этим небом.
                </p>
              </div>
              <div className="grid gap-4 text-sm text-violet-100/90 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-violet-200/80">Темп</p>
                  <p className="mt-2 font-semibold text-white">Глубокие вдохи</p>
                  <p className="mt-1 leading-relaxed">Замедляйтесь, когда история требует внимания, и ускоряйтесь на переходах.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-violet-200/80">Эмоции</p>
                  <p className="mt-2 font-semibold text-white">Честный спектр</p>
                  <p className="mt-1 leading-relaxed">Сцены могут быть нежными, острыми, абсурдными — но всегда честными.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-violet-200/80">Связи</p>
                  <p className="mt-2 font-semibold text-white">Орбиты и спирали</p>
                  <p className="mt-1 leading-relaxed">Повторяйте мотивы, расширяя их, как спирали света в небе.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-violet-200/80">Финал</p>
                  <p className="mt-2 font-semibold text-white">Резонанс</p>
                  <p className="mt-1 leading-relaxed">Завершайте, когда ощущаете общее «эхо» в зале и на сцене.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
