export async function fetchVkEmbedMetadata(embedUrl: string) {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const res = await fetch(embedUrl)
    const html = await res.text()

    const extract = (prop: string) =>
      html.match(
        new RegExp(
          `<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`,
          'i'
        )
      )?.[1]

    return {
      title: extract('og:title') ?? 'VK Видео',
      thumbnail: extract('og:image') ?? undefined,
      description: extract('og:description') ?? undefined
    }
  } catch {
    return null
  }
}
