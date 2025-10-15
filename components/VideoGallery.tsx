import Link from 'next/link'

import type { VideoResource } from '@/data/videos'

function VideoCard({ video }: { video: VideoResource }) {
  const infoLine = video.duration ?? (video.authorName ? `Автор: ${video.authorName}` : undefined)
  const metadataNote =
    video.metadataSource === 'fallback'
      ? 'Не удалось получить метаданные, показано резервное превью'
      : 'Превью и описание загружены автоматически'

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700/60 dark:bg-gray-800">
      <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
        {video.previewImage ? (
          <img
            src={video.previewImage}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300">
            <span className="text-sm font-medium">Предпросмотр недоступен</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0" />
        <div className="pointer-events-none absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
          {video.platform}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">
            <Link href={video.url} target="_blank" rel="noreferrer" prefetch={false}>
              {video.title}
            </Link>
          </h3>
          {video.description ? (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{video.description}</p>
          ) : video.authorName ? (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Канал: {video.authorName}</p>
          ) : null}
        </div>
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            {infoLine ? <span>{infoLine}</span> : <span aria-hidden="true">&nbsp;</span>}
            <Link
              href={video.url}
              target="_blank"
              rel="noreferrer"
              prefetch={false}
              className="inline-flex items-center gap-1 text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Смотреть →
            </Link>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">{metadataNote}</p>
        </div>
      </div>
    </article>
  )
}

export function VideoGallery({ videos }: { videos: VideoResource[] }) {
  if (videos.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="video-gallery-heading" className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="video-gallery-heading" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Видео с импровизацией
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Подборка выступлений и разборов, которые помогают погрузиться в атмосферу импрова.
          </p>
        </div>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  )
}
