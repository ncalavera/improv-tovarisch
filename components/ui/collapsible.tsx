'use client'

import { useState, ReactNode } from 'react'

interface CollapsibleProps {
  title: string
  icon?: string
  children: ReactNode
  defaultOpen?: boolean
  variant?: 'default' | 'accent'
  className?: string
  contentClassName?: string
  headerClassName?: string
  titleClassName?: string
  chevronClassName?: string
}

export function Collapsible({
  title,
  icon,
  children,
  defaultOpen = false,
  variant = 'default',
  className,
  contentClassName,
  headerClassName,
  titleClassName,
  chevronClassName,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const variantStyles = {
    default: {
      container: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700',
      header: 'hover:bg-neutral-50 dark:hover:bg-neutral-800',
      title: 'text-neutral-900 dark:text-neutral-100',
      chevron: 'text-neutral-500 dark:text-neutral-300',
    },
    accent: {
      container:
        'bg-[color:color-mix(in_srgb,var(--accent)_8%,white)] dark:bg-[color:color-mix(in_srgb,var(--accent)_16%,black)] border border-[color:var(--accent)]',
      header:
        'hover:bg-[color:color-mix(in_srgb,var(--accent)_12%,white)] dark:hover:bg-[color:color-mix(in_srgb,var(--accent)_24%,black)]',
      title: 'text-[color:var(--accent)]',
      chevron: 'text-[color:var(--accent)]',
    },
  }

  const styles = variantStyles[variant]

  const composeClasses = (
    ...classes: Array<string | null | undefined | false>
  ) => classes.filter(Boolean).join(' ')

  const containerClasses = composeClasses('rounded-lg shadow-sm', styles.container, className)

  const headerClasses = composeClasses(
    'w-full px-6 py-4 flex items-center justify-between transition-colors',
    styles.header,
    headerClassName,
  )

  const titleClasses = composeClasses('text-xl font-semibold text-left', styles.title, titleClassName)

  const chevronClasses = composeClasses(
    'w-5 h-5 transition-transform',
    isOpen ? 'rotate-180' : '',
    styles.chevron,
    chevronClassName,
  )

  return (
    <div className={containerClasses}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={headerClasses}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <h2 className={titleClasses}>
            {title}
          </h2>
        </div>
        <svg
          className={chevronClasses}
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
      {isOpen && <div className={`px-6 pb-6 pt-2 ${contentClassName ?? ''}`}>{children}</div>}
    </div>
  )
}
