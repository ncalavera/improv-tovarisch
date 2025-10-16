import { Metadata } from "next"
import Link from "next/link"

import { UXReferenceDeck } from "@/components/research/UXReferenceDeck"

export const metadata: Metadata = {
  title: "Improv Tovarisch — UX/UI референсы",
  description:
    "Интерактивная подборка паттернов эксплейнер-страниц, каталогов и видео-хабов для проекта Improv Tovarisch.",
}

export default function UXResearchPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-10 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-300">
            Главная
          </Link>
          <span aria-hidden>›</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">UX/UI референсы</span>
        </div>
        <UXReferenceDeck />
      </div>
    </div>
  )
}
