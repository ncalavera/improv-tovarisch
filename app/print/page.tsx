import Link from 'next/link'
import { getFormats } from '@/lib/formats'
import { PrintButton } from '@/components/PrintButton'

export default function PrintMainPage() {
  const formats = getFormats()

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .no-print {
              display: none !important;
            }
            .page-break {
              page-break-after: always;
            }
          }
        `
      }} />
      <div className="min-h-screen bg-white p-8 print:p-0">
        {/* Print Button */}
        <div className="no-print mb-4 flex gap-4">
          <PrintButton />
        <Link
          href="/"
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          ← Назад
        </Link>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Импров Товарищ
          </h1>
          <p className="text-xl text-gray-600">
            Библиотека форматов импровизации
          </p>
        </header>

        <div className="space-y-6">
          {formats.map((format, idx) => (
            <div key={format.id} className={`border-l-4 pl-4 py-3 ${idx > 0 && idx % 10 === 0 ? 'page-break' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {format.name}
                </h2>
                <span className={`text-xs px-2 py-1 rounded ${
                  format.difficulty === 'beginner'
                    ? 'bg-green-100 text-green-800'
                    : format.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {format.difficulty === 'beginner' && 'Начальный'}
                  {format.difficulty === 'intermediate' && 'Средний'}
                  {format.difficulty === 'advanced' && 'Продвинутый'}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-2">
                {format.shortDescription}
              </p>

              <div className="flex gap-4 text-xs text-gray-500">
                <span>👥 {format.minPlayers}–{format.maxPlayers} чел.</span>
                <span>⏱️ {format.duration}</span>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
          <p>Всего форматов: {formats.length}</p>
          <p>Импров Товарищ - {new Date().getFullYear()}</p>
        </footer>
      </main>
      </div>
    </>
  )
}
