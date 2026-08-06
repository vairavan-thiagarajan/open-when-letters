/**
 * Server-side environment access for the email system.
 *
 * These values come from the Vercel dashboard (NOT .env, and never
 * VITE_-prefixed) so the Resend API key is never shipped to the browser.
 * Supabase values fall back to the VITE_-prefixed ones for convenience.
 */

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing server environment variable: ${name}`)
  return value
}

export const serverEnv = {
  get resendApiKey(): string {
    return requireEnv('RESEND_API_KEY')
  },
  get emailFrom(): string {
    return requireEnv('EMAIL_FROM')
  },
  get appUrl(): string {
    return requireEnv('APP_URL')
  },
  get supabaseUrl(): string {
    return process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? ''
  },
  get supabaseAnonKey(): string {
    return process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? ''
  },
  /** Optional but recommended — grants the server access to email_log (RLS). */
  get supabaseServiceRoleKey(): string {
    return process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  },
}
