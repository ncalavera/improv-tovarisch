'use client'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      🖨️ Печать / Сохранить PDF
    </button>
  )
}
