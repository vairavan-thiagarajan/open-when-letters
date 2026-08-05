import { useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { EASE } from '@/utils/anim'

interface EnvelopeThumbProps {
  cover: number
  locked: boolean
  className?: string
}

/**
 * A mini replica of the reading envelope: kraft paper, front pocket, fold
 * lines and a terracotta heart wax seal — the same object the recipient
 * opens, scaled down for covers and collection cards.
 */
export function EnvelopeThumb({ cover: _cover, locked, className }: EnvelopeThumbProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  const flapClosed = 'M18 22 L142 22 L80 52 Z'
  const flapOpen = 'M18 22 L142 22 L80 8 Z'

  return (
    <svg
      viewBox="0 0 160 118"
      fill="none"
      className={cn('h-auto w-full', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`thumb-body-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9d9b8" />
          <stop offset="0.55" stopColor="#d8c39b" />
          <stop offset="1" stopColor="#c3a878" />
        </linearGradient>
        <linearGradient id={`thumb-pocket-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8c39b" />
          <stop offset="1" stopColor="#c3a878" />
        </linearGradient>
        <linearGradient id={`thumb-flap-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e9d9b8" />
          <stop offset="1" stopColor="#d8c39b" />
        </linearGradient>
        <linearGradient id={`thumb-seal-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cb5521" />
          <stop offset="1" stopColor="#a84317" />
        </linearGradient>
        <linearGradient id={`thumb-light-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.34" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="0.8" stopColor="#5a3c19" stopOpacity="0.06" />
          <stop offset="1" stopColor="#5a3c19" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="80" cy="112" rx="54" ry="6" fill="#46343b" opacity="0.08" />

      {/* envelope back — kraft paper */}
      <rect x="18" y="14" width="124" height="92" rx="12" fill={`url(#thumb-body-${uid})`} />

      {/* letter peek (visible when opened) */}
      <motion.g
        initial={false}
        animate={{ opacity: locked ? 0 : 1, y: locked ? -4 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <rect x="26" y="8" width="108" height="34" rx="6" fill="#fcfaf5" stroke="#e9d9b8" />
        <rect x="40" y="18" width="42" height="3.5" rx="1.75" fill="#e3d2b0" />
        <rect x="40" y="27" width="64" height="3.5" rx="1.75" fill="#e9d9b8" />
      </motion.g>

      {/* front pocket */}
      <rect
        x="18"
        y="40"
        width="124"
        height="66"
        rx="12"
        fill={`url(#thumb-pocket-${uid})`}
      />

      {/* fold lines */}
      <path
        d="M28 94 L80 64 L132 94"
        stroke="#4a3414"
        strokeOpacity="0.28"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* flap */}
      <motion.path
        initial={false}
        animate={{ d: locked ? flapClosed : flapOpen }}
        transition={{ duration: 0.5, ease: EASE }}
        fill={`url(#thumb-flap-${uid})`}
      />

      {/* heart wax seal */}
      <motion.g
        initial={false}
        animate={{ opacity: locked ? 1 : 0, scale: locked ? 1 : 0.6 }}
        transition={{ duration: 0.4 }}
        style={{ originX: '80px', originY: '52px' }}
      >
        <circle cx="80" cy="52" r="10" fill={`url(#thumb-seal-${uid})`} />
        <ellipse cx="80" cy="56.5" rx="9" ry="3.6" fill="#000" opacity="0.14" />
        <ellipse cx="77.2" cy="48.6" rx="5.4" ry="2.8" fill="#fff" opacity="0.3" />
        <g transform="translate(80 52) scale(0.55) translate(-12 -12.5)">
          <path
            d="M12 20.5C7 16.5 3 13 3 8.8 3 6 5.2 4 7.9 4c1.7 0 3.1.8 4.1 2.2C13 4.8 14.4 4 16.1 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 11.7Z"
            fill="#fcfaf5"
            fillOpacity="0.92"
          />
        </g>
      </motion.g>

      {/* lighting sweep — gives the kraft a dimensional read */}
      <rect x="18" y="14" width="124" height="92" rx="12" fill={`url(#thumb-light-${uid})`} />
    </svg>
  )
}
