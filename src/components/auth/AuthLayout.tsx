import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo } from '@/components/layout/Logo'
import { LetterScene } from '@/components/landing/LetterScene'
import { EASE } from '@/utils/anim'

interface AuthLayoutProps {
  children: ReactNode
}

/** Split-screen shell for authentication pages: form + a quiet letter scene. */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ambient background — soft forest/mint tones */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_18%_0%,#e8f8e0_0%,transparent_60%),radial-gradient(50%_45%_at_88%_15%,#fff9dc_0%,transparent_60%)]"
      />

      <header className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <Link
          to="/"
          className="text-sm font-medium text-ink-soft transition-colors hover:text-forest-ink"
        >
          Back to home
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-12 px-5 pt-6 pb-16 sm:px-8 lg:grid-cols-2">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto w-full max-w-md"
        >
          {children}
        </motion.main>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="hidden lg:block"
          aria-hidden
        >
          <LetterScene />
        </motion.div>
      </div>
    </div>
  )
}
