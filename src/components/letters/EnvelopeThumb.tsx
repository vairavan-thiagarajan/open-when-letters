import { useId } from 'react'
import { motion } from 'framer-motion'
import { COVERS } from '@/data/covers'
import { cn } from '@/utils/cn'
import { EASE } from '@/utils/anim'

interface EnvelopeThumbProps {
  cover: number
  locked: boolean
  className?: string
}

export function EnvelopeThumb({ cover, locked, className }: EnvelopeThumbProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const palette = COVERS[cover % COVERS.length]

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
          <stop offset="0" stopColor={palette.from} />
          <stop offset="1" stopColor={palette.to} />
        </linearGradient>
        <linearGradient id={`thumb-flap-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={palette.to} />
          <stop offset="1" stopColor={palette.from} />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="80" cy="112" rx="54" ry="6" fill="#46343b" opacity="0.07" />

      {/* envelope back */}
      <rect x="18" y="14" width="124" height="92" rx="12" fill={`url(#thumb-body-${uid})`} />

      {/* letter peek (visible when opened) */}
      <motion.g
        initial={false}
        animate={{ opacity: locked ? 0 : 1, y: locked ? -4 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <rect x="26" y="8" width="108" height="34" rx="6" fill="#fffdfa" stroke="#f0e4dd" />
        <rect x="40" y="18" width="42" height="3.5" rx="1.75" fill="#e9dcd5" />
        <rect x="40" y="27" width="64" height="3.5" rx="1.75" fill="#f0e4dd" />
      </motion.g>

      {/* front panel */}
      <rect x="18" y="40" width="124" height="66" rx="12" fill="#fffdfa" stroke="#f0e4dd" />

      {/* fold lines */}
      <path
        d="M28 94 L80 64 L132 94"
        stroke="#f0e4dd"
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

      {/* wax seal */}
      <motion.g
        initial={false}
        animate={{ opacity: locked ? 1 : 0, scale: locked ? 1 : 0.6 }}
        transition={{ duration: 0.4 }}
        style={{ originX: '80px', originY: '52px' }}
      >
        <circle cx="80" cy="52" r="9" fill="#1a3300" opacity="0.3" />
        <path
          d="M80 58 C 77.4 53.4 72.4 51 72.4 46.9 C 72.4 43.6 75.2 41.6 78 41.6 C 79.5 41.6 80 42.6 80 43.6 C 80 42.6 80.5 41.6 82 41.6 C 84.8 41.6 87.6 43.6 87.6 46.9 C 87.6 51 82.6 53.4 80 58 Z"
          fill="#1a3300"
        />
      </motion.g>
    </svg>
  )
}
