import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getFormatById } from '@/lib/formats'
import { PrintButton } from '@/components/PrintButton'
import fs from 'fs'
import path from 'path'

// Convert markdown bold and italic to HTML
function convertMarkdown(text: string): string {
  let result = text
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  return result
}

// Load extended Harold data
function getHaroldExtendedData() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'harold-extended.json')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    return null
  }
}

export default async function PrintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id} = await params
  const format = getFormatById(id)

  if (!format) {
    notFound()
  }

  const isHarold = id === '1'
  const haroldData = isHarold ? getHaroldExtendedData() : null

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
            .page-break-before {
              page-break-before: always;
            }
          }
        `
      }} />
      <div className="min-h-screen bg-white p-8 print:p-0">
        {/* Print Button */}
        <div className="no-print mb-4 flex gap-4">
          <PrintButton />
          <Link
            href={`/formats/${id}`}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            ← Назад
          </Link>
        </div>

        {/* Content */}
        <main className="max-w-5xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌀 {format.name}
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            {format.shortDescription}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm mb-8">
            <div>
              <p className="text-gray-500">Игроки</p>
              <p className="font-semibold">{format.minPlayers}–{format.maxPlayers} человек</p>
            </div>
            <div>
              <p className="text-gray-500">Длительность</p>
              <p className="font-semibold">{format.duration}</p>
            </div>
          </div>

          {/* Description */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">📖 Описание</h2>
            <div className="space-y-3">
              {format.fullDescription.split('\n\n').map((paragraph: string, idx: number) => (
                <p key={idx} className="text-gray-700 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Harold specific content */}
          {isHarold && haroldData && (
            <>
              <section className="mb-8 page-break-before">
                <h2 className="text-2xl font-bold mb-4">🧱 Структура сцен</h2>
                <Image
                  src="/harold-diagram.svg"
                  alt="Диаграмма структуры Harold"
                  width={800}
                  height={500}
                  className="w-full mb-4"
                />
                <div className="space-y-2 text-sm">
                  <p>• <strong>A, B, C</strong> — три параллельные линии с разными персонажами</p>
                  <p>• <strong>A2 / B2 / C2</strong> — новые вариации той же темы</p>
                  <p>• <strong>A3 / B3 / C3</strong> — финальный блок</p>
                  <p>• <strong>Group Games</strong> — групповые игры</p>
                </div>
              </section>

              <section className="mb-8 page-break-before">
                <h2 className="text-2xl font-bold mb-4">🔓 Форматы открытий</h2>
                {haroldData.openings.map((opening: any, idx: number) => (
                  <div key={idx} className="mb-6 border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-bold mb-2">{opening.name}</h3>
                    <p className="mb-2">{opening.description}</p>
                    {opening.howItWorks && <p className="mb-2">{opening.howItWorks}</p>}
                    {opening.result && <p className="text-blue-600">→ {opening.result}</p>}
                  </div>
                ))}
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">⚙️ Ключевые правила</h2>
                <ul className="space-y-2">
                  {haroldData.keyRules.map((rule: string, idx: number) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: '• ' + convertMarkdown(rule) }} />
                  ))}
                </ul>
              </section>

              <section className="mb-8 page-break-before">
                <h2 className="text-2xl font-bold mb-4">📘 Книги</h2>
                {haroldData.resources.books.map((book: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <h3 className="font-bold">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.authors}</p>
                    <p className="text-sm">{book.description}</p>
                    {book.url && <p className="text-sm text-blue-600">{book.url}</p>}
                  </div>
                ))}
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">🔗 Полезные ссылки</h2>
                <ul className="space-y-1">
                  {haroldData.resources.links.map((link: any, idx: number) => (
                    <li key={idx}>• {link.title}: {link.url}</li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {format.notes && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">💡 Заметки</h2>
              <p className="whitespace-pre-line">{format.notes}</p>
            </section>
          )}
        </main>
      </div>
    </>
  )
}
