import Link from 'next/link'

import { FormatsExplorer } from '@/components/FormatsExplorer'
import { StickFigureIcon } from '@/components/StickFigureIcon'
import { getFormats } from '@/lib/formats'

export default function Home() {
  const formats = getFormats()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              Импров Товарищ
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 p-1">
                <StickFigureIcon className="h-8 w-8" />
                <span className="sr-only">Улыбающийся человечек</span>
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Библиотека импровизационных форматов
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-blue-500 bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Форматы
              </Link>
              <Link
                href="/videos"
                className="inline-flex items-center justify-center rounded-full border border-blue-500 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/40"
              >
                Видео
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section aria-labelledby="formats-heading" className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 id="formats-heading" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Форматы и разминки
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Исследуйте коллекцию импровизационных игр, упражнений и длинных форм, упорядоченных по сложности, длительности и
              размеру команды.
            </p>
          </div>

          <FormatsExplorer formats={formats} />
        </section>
      </main>
    </div>
  )
}
