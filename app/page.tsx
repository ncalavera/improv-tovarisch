import Link from 'next/link'

import { FormatsExplorer } from '@/components/FormatsExplorer'
import { StickFigureIcon } from '@/components/StickFigureIcon'
import { getFormats } from '@/lib/formats'

export default function Home() {
  const formats = getFormats()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:bg-[url('/grid-dark.svg')]"></div>
        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 sm:pt-24 sm:pb-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-blue-500/10 ring-1 ring-gray-200 dark:ring-gray-800">
              <StickFigureIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Импров Товарищ
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Большая библиотека импровизационных форматов. <br className="hidden sm:block" />
            Игры, упражнения и длинные формы для вашей команды.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 p-6 sm:p-8">
          <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Коллекция форматов
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Используйте фильтры, чтобы найти идеальный формат для вашей репетиции или шоу.
            </p>
          </div>

          <FormatsExplorer formats={formats} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Импров Товарищ. Создано для сообщества.</p>
        </div>
      </footer>
    </div>
  )
}
