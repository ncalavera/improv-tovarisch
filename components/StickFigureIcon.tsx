import { SVGProps } from 'react'

export function StickFigureIcon(props: SVGProps<SVGSVGElement>) {
  const { className, ...rest } = props

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <circle cx="12" cy="6" r="3" />
      <path d="M9 5.75c.6.75 1.5 1.25 3 1.25s2.4-.5 3-1.25" />
      <path d="M12 9v6.5" />
      <path d="M7.5 12.5 12 11l4.5 1.5" />
      <path d="M8.5 21 12 15l3.5 6" />
    </svg>
  )
}
