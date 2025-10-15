export type VideoResource = {
  id: string
  title: string
  url: string
  platform: 'YouTube' | 'VK Видео' | string
  previewImage?: string
  description?: string
  authorName?: string
  duration?: string
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

async function resolveVideo(source: VideoSource): Promise<VideoResource | null> {
  try {
    if (source.platform === 'YouTube') {
      const data = await fetchOEmbed(source.url, 'https://www.youtube.com/oembed')
      return {
        id: extractYouTubeId(source.url),
        title: data.title ?? source.url,
        url: source.url,
        platform: source.platform,
        previewImage: data.thumbnail_url,
        authorName: data.author_name,
        duration: source.duration
      }
    }

    if (source.platform === 'VK Видео') {
      const data = await fetchOEmbed(source.url, 'https://vk.com/oembed')
      return {
        id: extractVkId(source.url),
        title: data.title ?? source.url,
        url: source.url,
        platform: source.platform,
        previewImage: data.thumbnail_url,
        authorName: data.author_name,
        duration: source.duration
      }
    }
  } catch (error) {
    console.error(error)
  }

  return null
}

export async function getVideos(): Promise<VideoResource[]> {
  const videos = await Promise.all(VIDEO_SOURCES.map((source) => resolveVideo(source)))
  return videos.filter((video): video is VideoResource => Boolean(video))
}
