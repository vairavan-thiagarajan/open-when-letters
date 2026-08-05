import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from './Logo'
import { ResourcesList } from './ResourcesMenu'
import { useAuth } from '@/context/authContext'
import { useToast } from '@/components/ui/toastContext'
import { cn } from '@/utils/cn'
import { EASE, springs } from '@/utils/anim'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/design', label: 'Design' },
  { to: '/login', label: 'Log in' },
]

const accountLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/collections', label: 'Collections' },
  { to: '/profile', label: 'Profile' },
  { to: '/design', label: 'Design' },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M9 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Navbar() {
  const { user, loading, signOut } = useAuth()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
    setResourcesOpen(false)
  }, [location.pathname])

  const links = user ? accountLinks : publicLinks

  const resourcesActive =
    location.pathname === '/faq' || location.pathname === '/terms'

  const handleLogout = async () => {
    setSigningOut(true)
    try {
      await signOut()
      navigate('/', { replace: true })
    } catch {
      setSigningOut(false)
      toast('Could not sign you out. Please try again.')
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <nav
        className={cn(
          'mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-full border border-line bg-cream/85 px-4 shadow-lift backdrop-blur-xl sm:px-5',
          open && 'bg-cream/95',
        )}
      >
        <Logo />

        {/* Desktop — segmented pill nav with CTA inside the same group */}
        <div className="hidden items-center md:flex">
          <div className="flex items-center gap-0.5">
            {!loading &&
              links.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'} className="relative">
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-pill"
                          transition={springs.snappy}
                          className="absolute inset-0 rounded-full bg-forest-ink shadow-soft"
                        />
                      )}
                      <span
                        className={cn(
                          'relative z-10 block rounded-full px-3.5 py-1.5 text-sm font-medium tracking-tight transition-colors duration-200',
                          isActive ? 'text-cream-paper' : 'text-ink-soft hover:text-ink',
                        )}
                      >
                        {link.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            {!loading && (
              <div
                className="relative"
                onMouseEnter={() => setResourcesOpen(true)}
                onMouseLeave={() => setResourcesOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setResourcesOpen((value) => !value)}
                  aria-haspopup="menu"
                  aria-expanded={resourcesOpen}
                  className="relative rounded-full px-3.5 py-1.5 text-sm font-medium tracking-tight transition-colors duration-200"
                >
                  {resourcesActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={springs.snappy}
                      className="absolute inset-0 rounded-full bg-forest-ink shadow-soft"
                    />
                  )}
                  <span
                    className={cn(
                      'relative z-10 inline-flex items-center gap-1 transition-colors duration-200',
                      resourcesActive
                        ? 'text-cream-paper'
                        : 'text-ink-soft hover:text-ink',
                    )}
                  >
                    Resources
                    <motion.svg
                      viewBox="0 0 24 24"
                      fill="none"
                      animate={{ rotate: resourcesOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="h-3.5 w-3.5"
                      aria-hidden
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </span>
                </button>

                <AnimatePresence>
                  {resourcesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: EASE }}
                      role="menu"
                      className="absolute top-full left-0 z-50 mt-2 w-72 rounded-2xl border border-line bg-cream/95 p-2 shadow-lift backdrop-blur-xl"
                    >
                      <ResourcesList />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          {!loading && (
            <>
              <span aria-hidden className="mx-2 h-5 w-px bg-line" />
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={signingOut}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium tracking-tight text-ink-soft transition-colors duration-200 hover:bg-blush hover:text-ink disabled:opacity-40"
                >
                  {signingOut ? 'Signing out…' : 'Log out'}
                  {!signingOut && <LogoutIcon />}
                </button>
              ) : (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  transition={springs.snappy}
                  onClick={() => navigate('/signup')}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-highlighter-yellow px-4 text-sm font-medium tracking-tight text-forest-ink shadow-soft transition-colors duration-200 hover:bg-blush"
                >
                  Get started
                  <ArrowIcon />
                </motion.button>
              )}
            </>
          )}
        </div>

        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          whileTap={{ scale: 0.92 }}
          transition={springs.snappy}
          className={cn(
            'grid h-11 w-11 place-items-center rounded-full text-ink transition-colors duration-200 md:hidden',
            open ? 'bg-blush' : 'hover:bg-blush/70',
          )}
        >
          <span className="relative block h-3.5 w-4.5">
            <motion.span
              animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="absolute top-0 left-0 block h-0.5 w-full rounded-full bg-current"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="absolute top-1.5 left-0 block h-0.5 w-full rounded-full bg-current"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="absolute bottom-0 left-0 block h-0.5 w-full rounded-full bg-current"
            />
          </span>
        </motion.button>
      </nav>

      {/* Mobile — floating pill menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl border border-line bg-cream/95 p-2 shadow-lift backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1">
              {!loading &&
                links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'rounded-xl px-4 py-3 text-base font-medium tracking-tight transition-colors',
                        isActive
                          ? 'bg-forest-ink text-cream-paper'
                          : 'text-ink-soft hover:bg-blush/70 hover:text-ink',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              {!loading && (
                <div className="mt-1 border-t border-line pt-2">
                  <p className="px-4 pt-1 pb-2 text-[11px] font-semibold tracking-widest font-mono text-mist uppercase">
                    Resources
                  </p>
                  <ResourcesList onNavigate={() => setOpen(false)} />
                </div>
              )}
              {!loading &&
                (user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={signingOut}
                    className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-blush px-4 py-3 text-base font-medium tracking-tight text-forest-ink transition-colors hover:bg-blush-deep disabled:opacity-40"
                  >
                    {signingOut ? 'Signing out…' : 'Log out'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-highlighter-yellow px-4 py-3 text-base font-medium tracking-tight text-forest-ink transition-colors hover:bg-blush"
                  >
                    Get started
                    <ArrowIcon />
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
