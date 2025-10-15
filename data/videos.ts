export type VideoResource = {
  id: string
  title: string
  url: string
  platform: 'YouTube' | 'VK Видео' | string
  previewImage?: string
  description?: string
  authorName?: string
  duration?: string
  metadataSource: 'oEmbed' | 'fallback'
}

type VideoSource = {
  url: string
  platform: VideoResource['platform']
  duration?: string
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

function extractVkId(url: string) {
  const match = url.match(/video-?\d+_\d+/)
  return match ? match[0] : url
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
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'vkvideo.ru') {
      parsed.hostname = 'vk.com'
    }
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString()
  } catch (error) {
    console.error('Failed to normalize VK url', error)
    return url
  }
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
      const canonicalUrl = normalizeVkUrl(source.url)
      const data = await fetchOEmbed(canonicalUrl, 'https://vk.com/oembed')
      return {
        id: extractVkId(canonicalUrl),
        title: data.title ?? source.url,
        url: source.url,
        platform: source.platform,
        previewImage: data.thumbnail_url ?? getFallbackPreview(source, extractVkId(canonicalUrl)),
        authorName: data.author_name,
        duration: source.duration,
        metadataSource: 'oEmbed'
      }
    }
  } catch (error) {
    console.error(error)
  }

  const canonicalUrl = source.platform === 'VK Видео' ? normalizeVkUrl(source.url) : source.url
  const id = source.platform === 'YouTube' ? extractYouTubeId(source.url) : extractVkId(canonicalUrl)

  return {
    id,
    title: `${source.platform} • ${id}`,
    url: source.url,
    platform: source.platform,
    previewImage: getFallbackPreview(source, id),
    duration: source.duration,
    metadataSource: 'fallback'
  }
}

export async function getVideos(): Promise<VideoResource[]> {
  return Promise.all(VIDEO_SOURCES.map((source) => resolveVideo(source)))
}
