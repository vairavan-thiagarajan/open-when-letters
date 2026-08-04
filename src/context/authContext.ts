import { createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export interface SignUpResult {
  /** True when email confirmation is required and no session was created. */
  needsEmailConfirmation: boolean
}

export interface AuthContextValue {
  user: User | null
  session: Session | null
  /** True until the persisted session has been restored on first load. */
  loading: boolean
  emailVerified: boolean
  /** True while a password-recovery link is being processed. */
  recovery: boolean
  rememberMe: boolean
  setRememberMe: (value: boolean) => void
  signUp: (email: string, password: string) => Promise<SignUpResult>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPasswordForEmail: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  resendConfirmation: (email: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

/** Access the full auth API. Must be used inside an AuthProvider. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/** Convenience hook returning the signed-in user (or null). */
export function useUser(): User | null {
  return useAuth().user
}
