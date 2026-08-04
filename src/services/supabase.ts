import {
  createClient,
  type SupabaseClient,
  type SupportedStorage,
} from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

/**
 * Auth "remember me" flag. When it is anything other than "false", the session
 * is kept in localStorage and survives a full browser restart. When "false",
 * the session is kept in sessionStorage and only survives the current tab.
 */
export const REMEMBER_ME_KEY = 'ow_remember_me'

function rememberSession(): boolean {
  return localStorage.getItem(REMEMBER_ME_KEY) !== 'false'
}

/** Routes Supabase session persistence to localStorage or sessionStorage. */
const rememberStorageAdapter: SupportedStorage = {
  getItem(key: string): string | null {
    return rememberSession() ? localStorage.getItem(key) : sessionStorage.getItem(key)
  },
  setItem(key: string, value: string): void {
    const target = rememberSession() ? localStorage : sessionStorage
    target.setItem(key, value)
  },
  removeItem(key: string): void {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  },
}

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: rememberStorageAdapter,
      },
    })
  : null

/** Throws a helpful error when Supabase has not been configured. */
export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
    )
  }
  return supabase
}
