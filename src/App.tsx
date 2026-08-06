import { lazy, Suspense, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AnimatedRoutes } from '@/components/layout/AnimatedRoutes'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { SplashScreen } from '@/components/splash/SplashScreen'
import {
  AccountPageSkeleton,
  AuthPageSkeleton,
  BuilderPageSkeleton,
  CollectionPageSkeleton,
  CollectionsPageSkeleton,
  RouteFallback,
} from '@/components/ui/PageSkeletons'
import { SetupScreen } from '@/components/ui/SetupScreen'
import { AuthProvider } from '@/context/AuthProvider'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { isSupabaseConfigured } from '@/services/supabase'

const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((module) => ({ default: module.LandingPage })),
)
const AboutPage = lazy(() =>
  import('@/pages/AboutPage').then((module) => ({ default: module.AboutPage })),
)
const DesignPage = lazy(() =>
  import('@/pages/DesignPage').then((module) => ({ default: module.DesignPage })),
)
const FaqPage = lazy(() =>
  import('@/pages/FaqPage').then((module) => ({ default: module.FaqPage })),
)
const TermsPage = lazy(() =>
  import('@/pages/TermsPage').then((module) => ({ default: module.TermsPage })),
)
const PrivacyPage = lazy(() =>
  import('@/pages/PrivacyPage').then((module) => ({ default: module.PrivacyPage })),
)
const CreateCollectionPage = lazy(() =>
  import('@/pages/CreateCollectionPage').then((module) => ({
    default: module.CreateCollectionPage,
  })),
)
const BuilderPage = lazy(() =>
  import('@/pages/BuilderPage').then((module) => ({ default: module.BuilderPage })),
)
const CollectionPage = lazy(() =>
  import('@/pages/CollectionPage').then((module) => ({ default: module.CollectionPage })),
)
const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })),
)
const SignupPage = lazy(() =>
  import('@/pages/SignupPage').then((module) => ({ default: module.SignupPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('@/pages/ForgotPasswordPage').then((module) => ({
    default: module.ForgotPasswordPage,
  })),
)
const ResetPasswordPage = lazy(() =>
  import('@/pages/ResetPasswordPage').then((module) => ({
    default: module.ResetPasswordPage,
  })),
)
const CollectionsPage = lazy(() =>
  import('@/pages/CollectionsPage').then((module) => ({ default: module.CollectionsPage })),
)
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((module) => ({ default: module.ProfilePage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

const withFallback = (element: React.ReactNode, fallback: React.ReactNode = <RouteFallback />) => (
  <Suspense fallback={fallback}>{element}</Suspense>
)

export default function App() {
  const [showSplash, setShowSplash] = useState(isSupabaseConfigured)
  const [appReady, setAppReady] = useState(!isSupabaseConfigured)

  return (
    <>
      <ScrollToTop />
      <AnimatePresence onExitComplete={() => setAppReady(true)}>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>
      {appReady &&
        (isSupabaseConfigured ? (
          <AuthProvider>
            <AnimatedRoutes>
              <Routes>
                <Route path="/" element={withFallback(<LandingPage />)} />
                <Route path="/about" element={withFallback(<AboutPage />)} />
                <Route path="/design" element={withFallback(<DesignPage />)} />
                <Route path="/faq" element={withFallback(<FaqPage />)} />
                <Route path="/terms" element={withFallback(<TermsPage />)} />
                <Route path="/privacy" element={withFallback(<PrivacyPage />)} />
                <Route path="/create" element={withFallback(<CreateCollectionPage />)} />
                <Route
                  path="/edit/:token"
                  element={
                    withFallback(
                      <ProtectedRoute>
                        <BuilderPage />
                      </ProtectedRoute>,
                      <BuilderPageSkeleton />,
                    )
                  }
                />
                <Route
                  path="/open/:slug"
                  element={withFallback(<CollectionPage />, <CollectionPageSkeleton />)}
                />
                <Route path="/login" element={withFallback(<LoginPage />, <AuthPageSkeleton />)} />
                <Route path="/signup" element={withFallback(<SignupPage />, <AuthPageSkeleton />)} />
                <Route
                  path="/forgot-password"
                  element={withFallback(<ForgotPasswordPage />, <AuthPageSkeleton />)}
                />
                <Route
                  path="/reset-password"
                  element={withFallback(<ResetPasswordPage />, <AuthPageSkeleton />)}
                />
                <Route
                  path="/collections"
                  element={
                    withFallback(
                      <ProtectedRoute>
                        <CollectionsPage />
                      </ProtectedRoute>,
                      <CollectionsPageSkeleton />,
                    )
                  }
                />
                <Route
                  path="/profile"
                  element={
                    withFallback(
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>,
                      <AccountPageSkeleton />,
                    )
                  }
                />
                <Route
                  path="/settings"
                  element={
                    withFallback(
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>,
                      <AccountPageSkeleton />,
                    )
                  }
                />
                <Route path="*" element={withFallback(<NotFoundPage />)} />
              </Routes>
            </AnimatedRoutes>
          </AuthProvider>
        ) : (
          <SetupScreen />
        ))}
    </>
  )
}
