"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import { Collapsible } from "@/components/ui/collapsible"

type Screenshot = {
  src: string
  alt: string
  caption: string
  link: string
}

type Reference = {
  id: string
  title: string
  description: string
  link: string
  screenshots: Screenshot[]
  uxPatterns: string[]
  uiNotes: string[]
  takeaways: string[]
}

type Section = {
  id: string
  title: string
  subtitle?: string
  kind: "text" | "references"
  content?: {
    intro?: string
    bullets?: string[]
    groups?: {
      title: string
      items: string[]
    }[]
  }
  references?: Reference[]
}

const placeholder = (label: string) =>
  `https://placehold.co/1200x675/png?text=${encodeURIComponent(label)}`

const explainerReferences: Reference[] = [
  {
    id: "miroverse",
    title: "Miroverse",
    description: "Карточка шаблона в Miroverse с героем, атрибутами и CTA",
    link: "https://miro.com/miroverse/",
    screenshots: [
      {
        src: placeholder("Miroverse — карточка шаблона"),
        alt: "Miroverse — карточка шаблона",
        caption: "Герой-блок шаблона с CTA и основными атрибутами",
        link: "https://miro.com/miroverse/",
      },
      {
        src: placeholder("Miroverse — блок How to use"),
        alt: "Miroverse — блок How to use",
        caption: "Структурированный блок How to use со списком шагов",
        link: "https://miro.com/miroverse/",
      },
    ],
    uxPatterns: [
      "Фиксированный шаблон карточки: название, автор, метрики и CTA",
      "Крупный герой с кнопкой \"Use template\" и визуальным превью",
      "Разделы About и How to use, описывающие шаги применения",
      "Теги и категории для фильтрации и навигации по коллекциям",
      "Блоки Related и Included in boards для перекрёстных рекомендаций",
      "Социальные доказательства: лайки, количество копий, автор профиля",
    ],
    uiNotes: [
      "Яркий акцент на CTA и контрастные чипы тегов",
      "Большие обложки с скриншотами шаблонов",
      "Сетка с просторными отступами и чёткой иерархией заголовков",
      "Иконки для метрик (лайки, копии) в серой палитре",
    ],
    takeaways: [
      "MVP: единый герой-блок карточки формата с CTA \"Добавить в сессию\"",
      "Версия 1.1+: социальные метрики и блок автора",
      "Быстрый выигрыш: блок \"Как использовать\" со структурированными шагами",
      "Риск: потребность в визуальных обложках — можно стартовать с пиктограмм",
    ],
  },
  {
    id: "sessionlab",
    title: "SessionLab",
    description: "Карточка метода с атрибутами, пошаговыми блоками и рекомендациями",
    link: "https://www.sessionlab.com/library",
    screenshots: [
      {
        src: placeholder("SessionLab — карточка упражнения"),
        alt: "SessionLab — карточка упражнения",
        caption: "Верхний блок с атрибутами Duration, Participants, Difficulty",
        link: "https://www.sessionlab.com/library",
      },
      {
        src: placeholder("SessionLab — шаги упражнения"),
        alt: "SessionLab — шаги упражнения",
        caption: "Пошаговая инструкция с таймингами и подсказками",
        link: "https://www.sessionlab.com/library",
      },
    ],
    uxPatterns: [
      "Панель атрибутов с длительностью, участниками, сложностью, материалами",
      "CTA \"Use method\" и \"Add to session\" рядом с названием",
      "Пошаговый сценарий с таймингами и чеклистами",
      "Теги и коллекции для навигации, боковая панель с фильтрами",
      "Секция Similar methods для рекомендаций",
      "Комментарии сообщества под карточкой",
      "Статусы пользователя: добавлено в библиотеку, избранное",
    ],
    uiNotes: [
      "Светлая палитра с карточками и мягкими тенями",
      "Иконки в бейджах для ключевых атрибутов",
      "Двухколоночная сетка с чёткими заголовками и аккордеонами",
      "Контрастные CTA зелёного/синего цвета",
    ],
    takeaways: [
      "MVP: верхний атрибутный бар (время, игроки, сложность, теги)",
      "Позже: пользовательские коллекции и комментарии",
      "Быстрый выигрыш: шаблон блоков Steps и Tips",
      "Риск: сложность поддержки таймингов — можно начать с простого списка",
    ],
  },
  {
    id: "boardgamegeek",
    title: "BoardGameGeek",
    description: "Страница игры с табами, сайдбаром атрибутов и связанными материалами",
    link: "https://boardgamegeek.com/",
    screenshots: [
      {
        src: placeholder("BoardGameGeek — профиль игры"),
        alt: "BoardGameGeek — профиль игры",
        caption: "Сайдбар с Players, Play Time, Age, Weight и CTA",
        link: "https://boardgamegeek.com/",
      },
      {
        src: placeholder("BoardGameGeek — табы и описания"),
        alt: "BoardGameGeek — табы и описания",
        caption: "Табы Description, Forums, Files и блок Linked Items",
        link: "https://boardgamegeek.com/",
      },
    ],
    uxPatterns: [
      "Сайдбар с основными атрибутами и быстрыми CTA",
      "Табы для описания, форумов, файлов и видео",
      "Структурированные блоки рейтингов и статистики",
      "Связанные материалы: expansions, similar games, linked videos",
      "Пользовательские рейтинги и агрегированные оценки",
    ],
    uiNotes: [
      "Плотная информационная сетка с чёткими линиями",
      "Иконки и бейджи для Players, Time, Weight",
      "Нейтральная палитра с цветными акцентами на значимые показатели",
      "Карточки и таблицы для структурирования объёмного текста",
    ],
    takeaways: [
      "MVP: сайдбар атрибутов и табы \"Описание / Видео / Обсуждение\"",
      "Позже: рейтинги сложности и пользовательские оценки",
      "Быстрый выигрыш: блок \"Похожие форматы\" и \"Связанные видео\"",
      "Риск: перегрузка информацией — нужна строгая визуальная иерархия",
    ],
  },
]

const catalogReferences: Reference[] = [
  {
    id: "notion",
    title: "Notion Template Gallery",
    description: "Каталог шаблонов Notion с категориями, поиском и карточками",
    link: "https://www.notion.so/templates",
    screenshots: [
      {
        src: placeholder("Notion — галерея шаблонов"),
        alt: "Notion — галерея шаблонов",
        caption: "Категории и поиск по шаблонам с сеткой карточек",
        link: "https://www.notion.so/templates",
      },
      {
        src: placeholder("Notion — карточка шаблона"),
        alt: "Notion — карточка шаблона",
        caption: "Карточка с обложкой, автором и кратким описанием",
        link: "https://www.notion.so/templates",
      },
    ],
    uxPatterns: [
      "Верхние категории Work/School/Life и подборки",
      "Поиск по названию и описанию",
      "Чипы-теги для фильтрации",
      "Карточки с автором, кратким описанием и CTA \"Use template\"",
      "Индикаторы платных/бесплатных шаблонов",
    ],
    uiNotes: [
      "Светлая сетка 3–4 колонки с большим воздухом",
      "Обложки с закруглёнными углами",
      "Минималистичная типографика и вторичные метаданные",
      "Акценты на активных фильтрах и CTA",
    ],
    takeaways: [
      "MVP: карточки форматов с иконкой/обложкой и чипами тегов",
      "Позже: подборки редакции и статусы платности",
      "Быстрый выигрыш: поиск и фильтры-чипы по целям",
      "Риск: потребность в визуальных обложках — можно стартовать с пиктограмм",
    ],
  },
  {
    id: "figma",
    title: "Figma Community Templates",
    description: "Витрина шаблонов Figma с секциями по сценариям и каруселями",
    link: "https://www.figma.com/community",
    screenshots: [
      {
        src: placeholder("Figma — витрина темплейтов"),
        alt: "Figma — витрина темплейтов",
        caption: "Секции по сценариям и блоки See more",
        link: "https://www.figma.com/community",
      },
      {
        src: placeholder("Figma — карточка темплейта"),
        alt: "Figma — карточка темплейта",
        caption: "Карточка с превью, бейджами и CTA Duplicate",
        link: "https://www.figma.com/community",
      },
    ],
    uxPatterns: [
      "Секции по сценариям: Brainstorming, Research, Wireframing",
      "Горизонтальные карусели See more внутри категорий",
      "Сортировка Trending/Top/New",
      "CTA Duplicate и авторские данные",
      "Блок Continue exploring для удержания",
    ],
    uiNotes: [
      "Контрастные карточки на тёмном фоне",
      "Яркие иллюстрации и бейджи состояния",
      "Чёткие ховеры и активные состояния",
      "Различные размеры карточек для выделения топовых",
    ],
    takeaways: [
      "MVP: разделы-подборки вроде \"Популярное\" и \"Новое\"",
      "Позже: персонализированные рекомендации",
      "Быстрый выигрыш: горизонтальные ленты для тематических подборок",
      "Риск: сложность каруселей на мобиле — важно протестировать",
    ],
  },
  {
    id: "masterclass",
    title: "MasterClass Browse",
    description: "Каталог курсов MasterClass с поиском, рекомендациями и прогрессом",
    link: "https://www.masterclass.com/classes",
    screenshots: [
      {
        src: placeholder("MasterClass — browse"),
        alt: "MasterClass — browse",
        caption: "Герой-блок с подборками и поиском",
        link: "https://www.masterclass.com/classes",
      },
      {
        src: placeholder("MasterClass — continue watching"),
        alt: "MasterClass — continue watching",
        caption: "Секция Continue watching и кураторские подборки",
        link: "https://www.masterclass.com/classes",
      },
    ],
    uxPatterns: [
      "Поиск и фильтры по жанрам и наставникам",
      "Персональные блоки Continue watching и Recommended",
      "Кураторские подборки по темам",
      "Чёткая структура карточек курсов",
      "Навигация по категориям сверху",
    ],
    uiNotes: [
      "Крупные hero-баннеры и видеопревью",
      "Тёмная премиальная палитра с золотыми акцентами",
      "Карточки с прогресс-барами",
      "Секции на 100% ширины с плавными переходами",
    ],
    takeaways: [
      "MVP: подборки и сохранение прогресса пока опционально",
      "Позже: персонализация и Continue watching",
      "Быстрый выигрыш: карусели тематических подборок",
      "Риск: избыточная персонализация для MVP",
    ],
  },
  {
    id: "ted",
    title: "TED Topics",
    description: "Тематики TED с алфавитным индексом и хабами тем",
    link: "https://www.ted.com/topics",
    screenshots: [
      {
        src: placeholder("TED — topics index"),
        alt: "TED — topics index",
        caption: "Алфавитный индекс тем и фильтрация",
        link: "https://www.ted.com/topics",
      },
      {
        src: placeholder("TED — topic hub"),
        alt: "TED — topic hub",
        caption: "Хаб темы с подборками видео и статей",
        link: "https://www.ted.com/topics",
      },
    ],
    uxPatterns: [
      "Алфавитный список тем и быстрые фильтры",
      "Хабы тем с описанием и связанными материалами",
      "Рекомендации по похожим темам",
      "Чёткая навигация через хлебные крошки",
      "Ссылки на плейлисты и коллекции",
    ],
    uiNotes: [
      "Минималистичная типографика и крупные заголовки",
      "Карточки с превью видео",
      "Акцентные красные CTA",
      "Простая сетка и много воздуха",
    ],
    takeaways: [
      "MVP: индекс по тегам и быстрые фильтры",
      "Позже: тематические хабы с подборками",
      "Быстрый выигрыш: блок \"Похожие теги\"",
      "Риск: поддержка большого количества тегов — требуется поиск",
    ],
  },
]

const videoReferences: Reference[] = [
  {
    id: "coursera",
    title: "Coursera Video Player",
    description: "Плеер Coursera с транскриптом, заметками и структурой курса",
    link: "https://www.coursera.org/",
    screenshots: [
      {
        src: placeholder("Coursera — плеер"),
        alt: "Coursera — плеер",
        caption: "Видео-плеер с транскриптом и заметками",
        link: "https://www.coursera.org/",
      },
      {
        src: placeholder("Coursera — модульная навигация"),
        alt: "Coursera — модульная навигация",
        caption: "Структура курса и навигация по модулям",
        link: "https://www.coursera.org/",
      },
    ],
    uxPatterns: [
      "Плеер с синхронизированным транскриптом",
      "Возможность сохранять заметки с таймкодами",
      "Сайдбар с прогрессом по курсу",
      "Модульная структура уроков и практик",
      "Рекомендации следующих шагов после видео",
    ],
    uiNotes: [
      "Тёмная панель плеера с акцентами на контролах",
      "Двухколоночный layout: видео и транскрипт",
      "Интерактивные подсветки строк транскрипта",
      "Иконки для заметок, скорости и субтитров",
    ],
    takeaways: [
      "MVP: плеер с таймкодами и списком видео",
      "Позже: транскрипт и заметки, связанные с таймкодом",
      "Быстрый выигрыш: CTA \"Следующий шаг\" после просмотра",
      "Риск: сложность реализации заметок — отложить до версии 1.1",
    ],
  },
  {
    id: "skillshare",
    title: "Skillshare Class Page",
    description: "Страница курса Skillshare с табами Lessons, About, Discussion",
    link: "https://www.skillshare.com/",
    screenshots: [
      {
        src: placeholder("Skillshare — уроки"),
        alt: "Skillshare — уроки",
        caption: "Список уроков с прогрессом и доступом к ресурсам",
        link: "https://www.skillshare.com/",
      },
      {
        src: placeholder("Skillshare — about"),
        alt: "Skillshare — about",
        caption: "Табы Lessons, About, Projects, Discussion",
        link: "https://www.skillshare.com/",
      },
    ],
    uxPatterns: [
      "Табы Lessons/About/Discussion для разделения контента",
      "Список уроков с длительностью и прогрессом",
      "Блок проектов и ресурсов под видео",
      "Комментарии и Q&A рядом с уроками",
      "CTA \"Start class\" и \"Follow teacher\"",
    ],
    uiNotes: [
      "Тёмные карточки уроков на светлом фоне",
      "Прогресс-бары и иконки продолжительности",
      "Контрастные CTA и бейджи уровня",
      "Модульная сетка с табами",
    ],
    takeaways: [
      "MVP: табы Видео/Инструкции/Обсуждение",
      "Позже: прогресс и проекты пользователей",
      "Быстрый выигрыш: список видео с длительностью и типом",
      "Риск: поддержка комьюнити — требует модерации",
    ],
  },
  {
    id: "khan",
    title: "Khan Academy",
    description: "Обучающая платформа с связкой видео и практики",
    link: "https://www.khanacademy.org/",
    screenshots: [
      {
        src: placeholder("Khan Academy — урок"),
        alt: "Khan Academy — урок",
        caption: "Видео-урок с описанием и списком упражнений",
        link: "https://www.khanacademy.org/",
      },
      {
        src: placeholder("Khan Academy — прогресс"),
        alt: "Khan Academy — прогресс",
        caption: "Панель прогресса и рекомендации следующего шага",
        link: "https://www.khanacademy.org/",
      },
    ],
    uxPatterns: [
      "Связка видео → практика → обсуждение",
      "Прогресс и мастерство по темам",
      "Наглядная навигация по курсам и юнитам",
      "Рекомендации следующего шага на основе прогресса",
      "Персональные планы обучения",
    ],
    uiNotes: [
      "Яркие карточки модулей и прогресс-бары",
      "Интуитивные иконки для навыков",
      "Комбинация белого и фирменного синего",
      "Чёткие CTA для продолжения обучения",
    ],
    takeaways: [
      "MVP: простой список видео и базовый прогресс",
      "Позже: практика после просмотра",
      "Быстрый выигрыш: связка \"Следующее видео\" и \"Похожие форматы\"",
      "Риск: избыточные планы обучения для ранней версии",
    ],
  },
]

const sections: Section[] = [
  {
    id: "overview",
    title: "Контекст исследования",
    kind: "text",
    content: {
      intro:
        "Исследование собирает UX/UI-паттерны для каталога импровизационных форматов и видео-хаба проекта Improv Tovarisch.",
      bullets: [
        "Стек: Next.js 14 + TypeScript, данные форматов в JSON",
        "Цель: собрать лучшие примеры эксплейнер-страниц, каталогов и видео-платформ",
        "Формат результата: интерактивные слайды со скриншотами, паттернами и выводами",
      ],
    },
  },
  {
    id: "data-model",
    title: "Модель данных: Формат ↔ Видео",
    kind: "text",
    content: {
      intro: "Ключевые сущности и поля для связи форматов и видео в MVP.",
      groups: [
        {
          title: "Format",
          items: [
            "id (slug)",
            "title",
            "summary",
            "type",
            "goal[]",
            "duration_min",
            "players_min / players_max",
            "difficulty",
            "tags[]",
            "steps[]",
            "tips[]",
            "variations[]",
            "related_format_ids[]",
            "video_ids[]",
          ],
        },
        {
          title: "Video",
          items: [
            "id",
            "title",
            "source",
            "url",
            "format_ids[]",
            "tags[]",
            "length_sec",
            "chapters[]",
            "transcript_url",
            "notes_enabled",
          ],
        },
        {
          title: "Tag (опционально)",
          items: ["id", "label", "type", "description", "count"],
        },
      ],
    },
  },
  {
    id: "explainers",
    title: "Эксплейнер-страницы",
    subtitle: "Miroverse, SessionLab, BoardGameGeek",
    kind: "references",
    references: explainerReferences,
  },
  {
    id: "catalogs",
    title: "Каталоги и галереи",
    subtitle: "Notion Templates, Figma Community, MasterClass, TED Topics",
    kind: "references",
    references: catalogReferences,
  },
  {
    id: "video-hubs",
    title: "Видео-хабы",
    subtitle: "Coursera, Skillshare, Khan Academy",
    kind: "references",
    references: videoReferences,
  },
  {
    id: "patterns",
    title: "Сводные паттерны для Improv Tovarisch",
    kind: "text",
    content: {
      groups: [
        {
          title: "Каталог форматов",
          items: [
            "Фильтры: Тип, Цель, Сложность, Время, Количество игроков, Теги",
            "Поиск по названию, описанию, тегам",
            "Карточки: title, описание, иконки ⏱/👥/★ и бейджи-теги",
            "Подборки: Быстрые айсбрейкеры, Популярное, Новое",
          ],
        },
        {
          title: "Карточка формата",
          items: [
            "Верхний блок атрибутов + CTA \"Добавить в сессию\"",
            "Блоки: Кратко, Пошагово, Подсказки, Вариации, Когда не стоит",
            "Связанные форматы и видео",
          ],
        },
        {
          title: "Видео-хаб",
          items: [
            "Плеер + список/плейлист видео",
            "Табы: Видео, Инструкции, Комментарии",
            "Таймкоды как MVP, транскрипт и заметки позже",
            "Привязка видео к формату по ID и тегам",
          ],
        },
        {
          title: "UI-детали",
          items: [
            "Единые иконки для атрибутов (⏱, 👥, 🎯, ★)",
            "Карточки 3:1 с превью или пиктограммой",
            "Нейтральная палитра + акценты на CTA",
            "Статусы: Смотрел/Не смотрел, В избранном",
          ],
        },
      ],
    },
  },
  {
    id: "wireframes",
    title: "Рекомендованные вайрфреймы",
    kind: "text",
    content: {
      groups: [
        {
          title: "Каталог форматов",
          items: [
            "Хедер с фильтрами-чипами и поиском",
            "Герой-подборки и секции (Популярное, Новое)",
            "Грид карточек с атрибутами",
            "Сайдбар (опционально) для быстрого фильтра",
          ],
        },
        {
          title: "Карточка формата",
          items: [
            "Герой-блок: название, тип, цель, длительность, игроки, сложность",
            "CTA: Добавить в сессию, Сохранить",
            "Основной контент: кратко, шаги, подсказки, вариации",
            "Сайдбар: связанные форматы, связанные видео",
          ],
        },
        {
          title: "Видео-хаб",
          items: [
            "Плеер сверху, справа список видео/плейлист",
            "Табы: Видео, Инструкции, Обсуждение",
            "Блок таймкодов или заметок под плеером",
            "CTA: Добавить в избранное, Поделиться",
          ],
        },
      ],
    },
  },
  {
    id: "mvp",
    title: "MVP vs Later",
    kind: "text",
    content: {
      groups: [
        {
          title: "MVP 1.0",
          items: [
            "Каталог с фильтрами, поиском и подборками",
            "Карточка формата с блоками Кратко/Шаги/Подсказки",
            "Видео-хаб с плеером, плейлистом и таймкодами",
            "Связь формат ↔ видео через ID",
          ],
        },
        {
          title: "Версия 1.1+",
          items: [
            "Персонализация, Continue watching",
            "Транскрипты и заметки как в Coursera",
            "Комментарии и комьюнити",
            "Расширенные рекомендации и рейтинги",
          ],
        },
        {
          title: "Чего избегаем",
          items: [
            "Сложные ML-рекомендации",
            "Полные транскрипты и заметки в MVP",
            "Многоуровневые каталоги без необходимости",
          ],
        },
      ],
    },
  },
  {
    id: "next-steps",
    title: "Следующие шаги",
    kind: "text",
    content: {
      bullets: [
        "Подготовить реальные скриншоты для каждого референса и заменить плейсхолдеры",
        "Сверстать карточки форматов с единым набором атрибутов",
        "Реализовать фильтры и поиск по каталогу",
        "Настроить страницу видео с табами и плейлистом",
        "Синхронизировать данные форматов и видео по ID",
      ],
    },
  },
  {
    id: "links",
    title: "Полезные ссылки",
    kind: "text",
    content: {
      bullets: [
        "Miroverse — https://miro.com/miroverse/",
        "SessionLab — https://www.sessionlab.com/library",
        "BoardGameGeek — https://boardgamegeek.com/",
        "Notion Templates — https://www.notion.so/templates",
        "Figma Community — https://www.figma.com/community",
        "MasterClass — https://www.masterclass.com/classes",
        "TED Topics — https://www.ted.com/topics",
        "Coursera — https://www.coursera.org/",
        "Skillshare — https://www.skillshare.com/",
        "Khan Academy — https://www.khanacademy.org/",
      ],
    },
  },
]

export function UXReferenceDeck() {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "overview")

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeId) ?? sections[0],
    [activeId],
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-10 text-white shadow-xl">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-widest">
            Исследование
          </span>
          <div>
            <h1 className="text-4xl font-bold leading-tight">Improv Tovarisch — UX/UI референсы</h1>
            <p className="mt-4 text-lg text-slate-100/80">
              Интерактивная версия презентации со ссылками на лучшие практики эксплейнер-страниц, каталогов и видео-хабов для
              импровизационных форматов.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#links"
              onClick={() => setActiveId("links")}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Список ссылок
            </Link>
            <Link
              href="#next-steps"
              onClick={() => setActiveId("next-steps")}
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Следующие шаги
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <nav className="sticky top-24 self-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <ul className="space-y-2 text-sm font-semibold">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(section.id)}
                  className={`w-full rounded-xl px-3 py-2 text-left transition ${
                    activeId === section.id
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="block text-sm font-semibold">{section.title}</span>
                  {section.subtitle ? (
                    <span className="block text-xs font-normal opacity-80">{section.subtitle}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <article className="space-y-10">
          <header className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 id={activeSection.id} className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {activeSection.title}
            </h2>
            {activeSection.subtitle ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{activeSection.subtitle}</p>
            ) : null}
            {activeSection.content?.intro ? (
              <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{activeSection.content.intro}</p>
            ) : null}
          </header>

          {activeSection.kind === "text" && (
            <section className="space-y-8">
              {activeSection.content?.bullets ? (
                <ul className="space-y-2 rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {activeSection.content.bullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 flex-none rounded-full bg-indigo-500" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {activeSection.content?.groups?.map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{group.title}</h3>
                  <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1 h-2 w-2 flex-none rounded-full bg-slate-400" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {activeSection.kind === "references" && activeSection.references ? (
            <section className="space-y-10">
              {activeSection.references.map((reference) => (
                <div
                  key={reference.id}
                  className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{reference.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{reference.description}</p>
                    </div>
                    <Link
                      href={reference.link}
                      className="inline-flex items-center justify-center rounded-full border border-indigo-500 px-4 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-900/40"
                    >
                      Открыть источник
                    </Link>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {reference.screenshots.map((shot) => (
                      <figure key={shot.caption} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                        <a href={shot.link} target="_blank" rel="noreferrer">
                          <img src={shot.src} alt={shot.alt} className="h-48 w-full object-cover" loading="lazy" />
                        </a>
                        <figcaption className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                          <p>{shot.caption}</p>
                          <Link
                            href={shot.link}
                            className="mt-1 inline-flex items-center text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-300"
                          >
                            {shot.link}
                          </Link>
                        </figcaption>
                      </figure>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <Collapsible
                      title="UX-паттерны"
                      defaultOpen
                      className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                      headerClassName="px-4 py-3"
                      titleClassName="text-base font-semibold"
                      contentClassName="px-4 pb-4"
                    >
                      <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        {reference.uxPatterns.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-1 h-2 w-2 flex-none rounded-full bg-indigo-500" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Collapsible>

                    <Collapsible
                      title="UI-наблюдения"
                      className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                      headerClassName="px-4 py-3"
                      titleClassName="text-base font-semibold"
                      contentClassName="px-4 pb-4"
                    >
                      <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        {reference.uiNotes.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-1 h-2 w-2 flex-none rounded-full bg-amber-500" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Collapsible>

                    <Collapsible
                      title="Выводы для проекта"
                      className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                      headerClassName="px-4 py-3"
                      titleClassName="text-base font-semibold"
                      contentClassName="px-4 pb-4"
                    >
                      <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        {reference.takeaways.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-500" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Collapsible>
                  </div>
                </div>
              ))}
            </section>
          ) : null}
        </article>
      </div>
    </div>
  )
}
