import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthError, Session, User } from '@supabase/supabase-js'
import { REMEMBER_ME_KEY, requireSupabase, supabase } from '@/services/supabase'
import { AuthContext, type AuthContextValue, type SignUpResult } from './authContext'

function friendlyError(error: AuthError | Error | null | undefined): string {
  if (!error) return 'Something went wrong. Please try again.'
  const message = error.message
  if (/invalid login credentials/i.test(message)) {
    return 'Incorrect email or password.'
  }
  if (/user already registered/i.test(message)) {
    return 'An account with that email already exists.'
  }
  if (/email not confirmed/i.test(message)) {
    return 'Please verify your email address before signing in.'
  }
  if (/user not found/i.test(message)) {
    return 'No account was found with that email.'
  }
  if (/token has expired or is invalid/i.test(message)) {
    return 'This link has expired or is invalid. Please try again.'
  }
  if (/password should be at least 6 characters/i.test(message)) {
    return 'Password must be at least 6 characters.'
  }
  if (/unable to validate email address/i.test(message)) {
    return 'Enter a valid email address.'
  }
  if (/signup disabled/i.test(message)) {
    return 'New sign-ups are currently disabled.'
  }
  return message
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [recovery, setRecovery] = useState(false)
  const [rememberMe, setRememberMeState] = useState(
    () => localStorage.getItem(REMEMBER_ME_KEY) !== 'false',
  )

  useEffect(() => {
    const client = supabase
    if (!client) {
      setLoading(false)
      return
    }

    let active = true

    client.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, currentSession) => {
      if (!active) return
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
      if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
      } else {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
      }
      if (
        event === 'INITIAL_SESSION' ||
        event === 'SIGNED_IN' ||
        event === 'SIGNED_OUT'
      ) {
        setLoading(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const setRememberMe = useCallback((value: boolean) => {
    localStorage.setItem(REMEMBER_ME_KEY, value ? 'true' : 'false')
    setRememberMeState(value)
  }, [])

  const signUp = useCallback<AuthContextValue['signUp']>(
    async (email, password): Promise<SignUpResult> => {
      const client = requireSupabase()
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/login?verified=1` },
      })
      if (error) throw new Error(friendlyError(error))
      return { needsEmailConfirmation: !data.session }
    },
    [],
  )

  const signIn = useCallback<AuthContextValue['signIn']>(async (email, password) => {
    const client = requireSupabase()
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) throw new Error(friendlyError(error))
  }, [])

  const signOut = useCallback<AuthContextValue['signOut']>(async () => {
    const client = requireSupabase()
    const { error } = await client.auth.signOut()
    if (error) throw new Error(friendlyError(error))
  }, [])

  const resetPasswordForEmail = useCallback<AuthContextValue['resetPasswordForEmail']>(
    async (email) => {
      const client = requireSupabase()
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw new Error(friendlyError(error))
    },
    [],
  )

  const updatePassword = useCallback<AuthContextValue['updatePassword']>(
    async (password) => {
      const client = requireSupabase()
      const { error } = await client.auth.updateUser({ password })
      if (error) throw new Error(friendlyError(error))
      setRecovery(false)
    },
    [],
  )

  const resendConfirmation = useCallback<AuthContextValue['resendConfirmation']>(
    async (email) => {
      const client = requireSupabase()
      const { error } = await client.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/login?verified=1` },
      })
      if (error) throw new Error(friendlyError(error))
    },
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      emailVerified: Boolean(user?.email_confirmed_at),
      recovery,
      rememberMe,
      setRememberMe,
      signUp,
      signIn,
      signOut,
      resetPasswordForEmail,
      updatePassword,
      resendConfirmation,
    }),
    [
      user,
      session,
      loading,
      recovery,
      rememberMe,
      setRememberMe,
      signUp,
      signIn,
      signOut,
      resetPasswordForEmail,
      updatePassword,
      resendConfirmation,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
