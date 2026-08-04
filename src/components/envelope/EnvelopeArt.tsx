import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { EASE } from '@/utils/anim'

interface EnvelopeArtProps {
  className?: string
  animate?: boolean
}

export function EnvelopeArt({ className, animate = true }: EnvelopeArtProps) {
  return (
    <svg
      viewBox="0 0 220 150"
      fill="none"
      className={cn('h-auto w-full', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="env-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f1ea" />
          <stop offset="1" stopColor="#e3e1d5" />
        </linearGradient>
        <linearGradient id="env-flap" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f6f4ec" />
          <stop offset="1" stopColor="#e9e6d9" />
        </linearGradient>
      </defs>

      {/* soft ground shadow */}
      <ellipse cx="110" cy="142" rx="88" ry="9" fill="#46343b" opacity="0.08" />

      {/* envelope back */}
      <rect x="20" y="24" width="180" height="112" rx="16" fill="url(#env-back)" />

      {/* front panel */}
      <rect x="20" y="48" width="180" height="88" rx="16" fill="#fcfaf5" stroke="#cfcfcf" />

      {/* fold lines */}
      <path
        d="M36 118 L110 80 L184 118"
        stroke="#cfcfcf"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* flap */}
      <motion.path
        d="M20 48 L110 16 L200 48 L110 48 Z"
        fill="url(#env-flap)"
        initial={animate ? { pathLength: 0 } : false}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        strokeLinecap="round"
      />

      {/* heart wax seal */}
      <motion.g
        animate={
          animate
            ? { scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] }
            : undefined
        }
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '110px', originY: '52px' }}
      >
        <circle cx="110" cy="52" r="11" fill="#1a3300" opacity="0.15" />
        <path
          d="M110 60 C 106.5 54.5 99.5 51 99.5 45.5 C 99.5 41 103 38 106.7 38 C 108.9 38 110 39.6 110 41 C 110 39.6 111.1 38 113.3 38 C 117 38 120.5 41 120.5 45.5 C 120.5 51 113.5 54.5 110 60 Z"
          fill="#1a3300"
          opacity="0.6"
        />
      </motion.g>
    </svg>
  )
}
