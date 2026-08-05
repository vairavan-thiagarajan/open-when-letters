import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn('group flex items-center gap-2.5', className)}
      aria-label="Open When Letters home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-highlighter-yellow text-forest-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]">
        <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-5" aria-hidden>
          <rect x="2.5" y="5" width="19" height="14" rx="3.5" fill="currentColor" />
          <path
            d="M4 8l8 5.5L20 8"
            stroke="#fcfaf5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
      <span className="font-display text-[1.35rem] leading-none font-semibold tracking-tight text-ink">
        Open When
      </span>
    </Link>
  )
}
