import Link from 'next/link'

import { FormatsExplorer } from '@/components/FormatsExplorer'
import { getFormats } from '@/lib/formats'

export default function Home() {
  const formats = getFormats()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Импров Товарищ
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Библиотека импровизационных форматов
              </p>
            </div>
            <Link
              href="/print"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              🖨️ Версия для печати
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <FormatsExplorer formats={formats} />
      </main>
    </div>
  )
}
