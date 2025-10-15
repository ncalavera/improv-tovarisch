export async function fetchVkEmbedMetadata(embedUrl: string) {
  if (typeof window === 'undefined') {
    console.log('[VK META] skipped (server environment)')
    return null
  }

  console.log('[VK META] fetching in browser:', embedUrl)

  try {
    const res = await fetch(embedUrl)
    console.log('[VK META] response status', res.status)
    const html = await res.text()
    console.log('[VK META] html snippet', html.slice(0, 200))

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
  } catch (err) {
    console.error('[VK META] fetch error', err)
    return null
  }
}
