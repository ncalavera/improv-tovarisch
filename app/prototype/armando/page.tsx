import { notFound } from 'next/navigation'

import ArmandoPrototypeView, {
  ArmandoPrototypeViewProps,
  ExampleRound,
  Stage,
} from './ArmandoPrototypeView'

import { getFormatById } from '@/lib/formats'
import { isStructuredFormat } from '@/lib/format-types'

function buildStageSequence(
  components: Array<{ name: string; description: string; duration?: string }>,
): Stage[] {
  return components
    .filter((component) => !component.name.toLowerCase().includes('цикл'))
    .map((component, index) => ({
      id: `${index}-${component.name}`,
      title: component.name,
      subtitle: component.duration ?? undefined,
    }))
}

function toExampleRounds(rawRounds: unknown): ExampleRound[] {
  if (!Array.isArray(rawRounds)) {
    return []
  }

  return rawRounds.flatMap((round) => {
    if (typeof round !== 'object' || round === null) {
      return []
    }

    const { number, monologue, scenes } = round as {
      number?: unknown
      monologue?: {
        duration?: unknown
        summary?: unknown
        keyDetails?: unknown
      }
      scenes?: unknown
    }

    if (
      typeof number !== 'number' ||
      !monologue ||
      typeof monologue.duration !== 'string' ||
      typeof monologue.summary !== 'string' ||
      !Array.isArray(scenes)
    ) {
      return []
    }

    const typedScenes = scenes.flatMap((scene) => {
      if (typeof scene !== 'object' || scene === null) {
        return []
      }

      const { number: sceneNumber, description } = scene as {
        number?: unknown
        description?: unknown
      }

      if (typeof sceneNumber !== 'number' || typeof description !== 'string') {
        return []
      }

      return [{ number: sceneNumber, description }]
    })

    return [
      {
        number,
        monologue: {
          duration: monologue.duration,
          summary: monologue.summary,
          keyDetails: Array.isArray(monologue.keyDetails)
            ? monologue.keyDetails.filter((detail): detail is string => typeof detail === 'string')
            : undefined,
        },
        scenes: typedScenes,
      },
    ]
  })
}

function splitSkills(skills: string[]): string[][] {
  const columnLength = Math.ceil(skills.length / 2)
  return [skills.slice(0, columnLength), skills.slice(columnLength)]
}

function pickSceneHighlights(
  components: Array<{ name: string; description: string; duration?: string }>,
  exampleRounds: ExampleRound[],
) {
  const exampleScenes = exampleRounds.flatMap((round) => round.scenes)

  return components
    .filter((component) => component.name.toLowerCase().includes('сцен'))
    .map((component, index) => ({
      name: component.name,
      description: component.description,
      duration: component.duration,
      example: exampleScenes[index],
    }))
}

function filterVideoResources(
  videos: ArmandoPrototypeViewProps['videos']['featured'],
): ArmandoPrototypeViewProps['videos']['featured'] {
  return videos.filter((video) => !video.url.includes('search?'))
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

  const description = format.fullDescription.split('\n\n')

  const structure = {
    overview:
      'Формат строится на чередовании правдивых монологов и импровизированных сцен. Участники возвращаются к монологисту, когда группе требуется новое вдохновение, поддерживая динамику и эмоциональное напряжение шоу.',
    stages: buildStageSequence(format.components),
    montage: format.montageRules,
  }

  const exampleRounds = toExampleRounds(format.example?.rounds)

  const sceneHighlights = {
    uniqueHighlights: format.keyRules ?? [],
    components: pickSceneHighlights(format.components, exampleRounds),
    skills: splitSkills(format.skills),
    focus: format.focus,
    variations: format.variations,
    similarTo: format.similarTo,
    prerequisites: format.prerequisites,
    notes: format.notes,
  }

  const videos = {
    featured: filterVideoResources(format.resources?.videos ?? []),
    fallback: format.sourceVideos,
  }

  const resources = {
    links: format.resources?.links ?? [],
    books: format.resources?.books ?? [],
  }

  const viewProps: ArmandoPrototypeViewProps = {
    meta,
    tags,
    description,
    structure,
    openings: format.openings ?? [],
    sceneHighlights,
    example: format.example
      ? {
          theme: format.example.theme,
          monologist: format.example.monologist,
          rounds: exampleRounds,
          themes: format.example.themes,
        }
      : undefined,
    videos,
    resources,
  }

  return <ArmandoPrototypeView {...viewProps} />
}
