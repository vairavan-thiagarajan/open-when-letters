import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export const FEEDBACK_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScpR1WgoI5Kq40jStc9JZ8wk5bofS5HPhjhzi3r--jUK9EMwQ/viewform?usp=publish-editor'

interface ResourceItem {
  label: string
  description: string
  href: string
  external?: boolean
  icon: ReactNode
}

const iconClass = 'h-4.5 w-4.5'

const items: ResourceItem[] = [
  {
    label: 'FAQ',
    description: 'Answers to common questions',
    href: '/faq',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <path
          d="M8 10.5a4 4 0 1 1 6.6 3c-.8.6-1.1 1-1.1 2M12 19h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Feedback',
    description: 'Tell us what you think',
    href: FEEDBACK_URL,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <path
          d="M12 20.5C7 16.5 3 13 3 8.8 3 6 5.2 4 7.9 4c1.7 0 3.1.8 4.1 2.2C13 4.8 14.4 4 16.1 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 11.7Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'Terms of Service',
    description: 'How the service works',
    href: '/terms',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <path
          d="M8 3h6l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 3v4h4M10 12h6M10 16h6M10 8h2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

interface ResourcesListProps {
  onNavigate?: () => void
}

/** The three resource links — used in the desktop dropdown and the mobile menu. */
export function ResourcesList({ onNavigate }: ResourcesListProps) {
  const rowClass =
    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-blush/70'

  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => {
        const row = (
          <>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blush text-forest-ink">
              {item.icon}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium tracking-tight text-ink">
                {item.label}
              </span>
              <span className="block truncate text-xs text-mist">{item.description}</span>
            </span>
            {item.external && (
              <svg viewBox="0 0 24 24" fill="none" className="ml-auto h-3.5 w-3.5 text-mist" aria-hidden>
                <path
                  d="M7 17L17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </>
        )

        return item.external ? (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={rowClass}
            onClick={onNavigate}
          >
            {row}
          </a>
        ) : (
          <Link key={item.label} to={item.href} className={rowClass} onClick={onNavigate}>
            {row}
          </Link>
        )
      })}
    </div>
  )
}
