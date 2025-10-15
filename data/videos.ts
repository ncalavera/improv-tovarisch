export type VideoResource = {
  id: string
  title: string
  url: string
  platform: 'YouTube' | 'VK Видео' | string
  previewImage?: string
  description?: string
  authorName?: string
  duration?: string
  metadataSource: 'oEmbed' | 'embed' | 'fallback'
}

type VideoSource = {
  url: string
  platform: VideoResource['platform']
  duration?: string
}

type VkVideoIdentifiers = {
  ownerId: string
  videoId: string
  contentId: string
  canonicalUrl: string
  embedUrl: string
}

const VIDEO_SOURCES: VideoSource[] = [
  {
    url: 'https://vkvideo.ru/video-229967683_456239039',
    platform: 'VK Видео'
  },
  {
    url: 'https://vk.com/video-100024679_456239126',
    platform: 'VK Видео'
  },
  {
    url: 'https://www.youtube.com/watch?v=sVKInDHnsSU',
    platform: 'YouTube'
  },
  {
    url: 'https://www.youtube.com/watch?v=Ri5nU6FDi3w',
    platform: 'YouTube'
  }
]

function extractYouTubeId(url: string) {
  const pattern = /(?:v=|youtu\.be\/)([\w-]{11})/
  const match = url.match(pattern)
  return match ? match[1] : url
}

function parseVkVideoIdentifiers(url: string): VkVideoIdentifiers | undefined {
  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'vkvideo.ru' || parsed.hostname === 'm.vk.com') {
      parsed.hostname = 'vk.com'
    }

    const match = parsed.pathname.match(/video(-?\d+)_(\d+)/)

    if (!match) {
      return undefined
    }

    const [, ownerId, videoId] = match
    const contentId = `video${ownerId}_${videoId}`

    return {
      ownerId,
      videoId,
      contentId,
      canonicalUrl: `https://vk.com/${contentId}`,
      embedUrl: `https://vk.com/video_ext.php?oid=${ownerId}&id=${videoId}&hd=2`
    }
  } catch (error) {
    console.error('Failed to parse VK video url', error)
    return undefined
  }
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function extractMetaContent(html: string, property: string) {
  const tagPattern = new RegExp(`<meta[^>]+property=["']${property}["'][^>]*>`, 'i')
  const tagMatch = html.match(tagPattern)

  if (!tagMatch) {
    return undefined
  }

  const contentMatch = tagMatch[0].match(/content=["']([^"']+)["']/i)

  if (!contentMatch) {
    return undefined
  }

  return decodeHtmlEntities(contentMatch[1])
}

async function fetchVkEmbedMetadata(embedUrl: string) {
  const response = await fetch(embedUrl, {
    next: { revalidate: 3600 }
  })

  if (!response.ok) {
    throw new Error(`Failed to load VK embed HTML for ${embedUrl}`)
  }

  const html = await response.text()

  return {
    title: extractMetaContent(html, 'og:title'),
    description: extractMetaContent(html, 'og:description'),
    thumbnail: extractMetaContent(html, 'og:image'),
    player: extractMetaContent(html, 'og:video')
  }
}

function extractVkId(url: string) {
  const identifiers = parseVkVideoIdentifiers(url)
  return identifiers ? identifiers.contentId : url
}

function escapeSvgText(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toBase64(value: string) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value).toString('base64')
  }

  if (typeof btoa !== 'undefined') {
    return btoa(value)
  }

  throw new Error('Base64 encoding is not supported in this environment')
}

function createSvgPreview({
  title,
  subtitle,
  accent = '#2563eb',
  background = '#0f172a'
}: {
  title: string
  subtitle?: string
  accent?: string
  background?: string
}) {
  const safeTitle = escapeSvgText(title)
  const safeSubtitle = subtitle ? escapeSvgText(subtitle) : undefined
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="${safeTitle}">
  <defs>
    <linearGradient id="grad" x1="0%" x2="100%" y1="0%" y2="100%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${background}" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="${background}"/>
  <rect width="640" height="360" fill="url(#grad)"/>
  <g fill="rgba(255,255,255,0.9)" font-family="'Inter', 'Arial', sans-serif">
    <text x="40" y="210" font-size="42" font-weight="700">${safeTitle}</text>
    ${safeSubtitle ? `<text x="40" y="260" font-size="28" font-weight="500" fill="rgba(255,255,255,0.8)">${safeSubtitle}</text>` : ''}
  </g>
</svg>`

  const base64 = toBase64(svg)
  return `data:image/svg+xml;base64,${base64}`
}

function getFallbackPreview(source: VideoSource, id: string) {
  if (source.platform === 'YouTube') {
    const videoId = extractYouTubeId(source.url)
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  }

  if (source.platform === 'VK Видео') {
    return createSvgPreview({
      title: 'VK Видео',
      subtitle: id,
      accent: '#2787f5',
      background: '#0b1120'
    })
  }

  return createSvgPreview({
    title: source.platform,
    subtitle: id
  })
}

function normalizeVkUrl(url: string) {
  const identifiers = parseVkVideoIdentifiers(url)
  return identifiers ? identifiers.canonicalUrl : url
}

async function fetchOEmbed(url: string, endpoint: string) {
  const oEmbedUrl = `${endpoint}?format=json&url=${encodeURIComponent(url)}`
  const response = await fetch(oEmbedUrl, {
    next: { revalidate: 3600 }
  })

  if (!response.ok) {
    throw new Error(`Failed to load oEmbed data for ${url}`)
  }

  return response.json() as Promise<{
    title?: string
    author_name?: string
    thumbnail_url?: string
  }>
}

async function resolveVideo(source: VideoSource): Promise<VideoResource> {
  try {
    if (source.platform === 'YouTube') {
      const data = await fetchOEmbed(source.url, 'https://www.youtube.com/oembed')
      return {
        id: extractYouTubeId(source.url),
        title: data.title ?? source.url,
        url: source.url,
        platform: source.platform,
        previewImage: data.thumbnail_url ?? getFallbackPreview(source, extractYouTubeId(source.url)),
        authorName: data.author_name,
        duration: source.duration,
        metadataSource: 'oEmbed'
      }
    }

    if (source.platform === 'VK Видео') {
      const identifiers = parseVkVideoIdentifiers(source.url)

      if (!identifiers) {
        throw new Error(`Не удалось распознать идентификаторы VK для ${source.url}`)
      }

      const metadata = await fetchVkEmbedMetadata(identifiers.embedUrl)

      const previewImage = metadata.thumbnail ?? getFallbackPreview(source, identifiers.contentId)
      const title = metadata.title ?? identifiers.canonicalUrl
      const description = metadata.description

      return {
        id: identifiers.contentId,
        title,
        url: identifiers.canonicalUrl,
        platform: source.platform,
        previewImage,
        description,
        duration: source.duration,
        metadataSource: 'embed'
      }
    }
  } catch (error) {
    console.error(error)
  }

  const canonicalUrl = source.platform === 'VK Видео' ? normalizeVkUrl(source.url) : source.url
  const fallbackUrl = source.platform === 'VK Видео' ? canonicalUrl : source.url
  const id = source.platform === 'YouTube' ? extractYouTubeId(source.url) : extractVkId(canonicalUrl)

  return {
    id,
    title: `${source.platform} • ${id}`,
    url: fallbackUrl,
    platform: source.platform,
    previewImage: getFallbackPreview(source, id),
    duration: source.duration,
    metadataSource: 'fallback'
  }
}

export async function getVideos(): Promise<VideoResource[]> {
  return Promise.all(VIDEO_SOURCES.map((source) => resolveVideo(source)))
}
