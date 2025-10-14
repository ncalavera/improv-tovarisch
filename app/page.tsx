import Link from 'next/link'
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
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Все форматы
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Найдено форматов: {formats.length}
          </p>
        </div>

        {/* Formats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formats.map((format) => (
            <Link
              key={format.id}
              href={`/formats/${format.id}`}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 h-full">
                {/* Badges */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        format.difficulty === 'beginner'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : format.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {format.difficulty === 'beginner' && 'Начальный'}
                      {format.difficulty === 'intermediate' && 'Средний'}
                      {format.difficulty === 'advanced' && 'Продвинутый'}
                    </span>
                    {format.explored && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        ⭐ Детально изучено
                      </span>
                    )}
                  </div>
                </div>

                {/* Format Name */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {format.name}
                </h3>

                {/* Short Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {format.shortDescription}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>
                      {format.minPlayers}-{format.maxPlayers} игроков
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{format.duration}</span>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {format.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {format.skills.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{format.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {formats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Форматы не найдены
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
