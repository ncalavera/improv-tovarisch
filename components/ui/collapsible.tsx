'use client'

import { useState, ReactNode } from 'react'

interface CollapsibleProps {
  title: string
  icon?: string
  children: ReactNode
  defaultOpen?: boolean
  variant?: 'default' | 'primary' | 'warning'
}

export function Collapsible({
  title,
  icon,
  children,
  defaultOpen = false,
  variant = 'default',
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const variantStyles = {
    default: {
      container: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      header: 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
      title: 'text-gray-900 dark:text-gray-100',
    },
    primary: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      header: 'hover:bg-blue-100 dark:hover:bg-blue-800/30',
      title: 'text-blue-900 dark:text-blue-100',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      header: 'hover:bg-yellow-100 dark:hover:bg-yellow-800/30',
      title: 'text-yellow-900 dark:text-yellow-100',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className={`rounded-lg border shadow-sm ${styles.container}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${styles.header}`}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <h2 className={`text-xl font-semibold text-left ${styles.title}`}>
            {title}
          </h2>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          } ${styles.title}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="px-6 pb-6 pt-2">{children}</div>}
    </div>
  )
}
