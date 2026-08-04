import { motion } from 'framer-motion'
import { EASE } from '@/utils/anim'

export function SetupScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-xl"
      >
        <div className="rounded-[2rem] border border-line bg-paper p-6 text-center shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px] sm:p-10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-xl bg-blush">
            <span className="h-4 w-4 rounded-sm bg-forest-ink" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink">
            Connect your Supabase project
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Open When Letters stores collections in Supabase. It needs a project
            to talk to before anything will work.
          </p>

          <ol className="mt-8 space-y-4 text-left">
            {[
              ['Create a project', 'Go to supabase.com and create a free project.'],
              [
                'Run the schema',
                'Open the SQL editor and paste the contents of supabase/schema.sql.'],
              [
                'Add the keys',
                'Copy the project URL and anon key into a .env file as VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).',
              ],
              ['Restart the dev server', 'Then refresh this page.'],
            ].map(([title, text], index) => (
              <li key={index} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush font-display text-base font-semibold text-forest-ink">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-ink">{title}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 break-all rounded-2xl bg-cream p-4 text-left font-mono text-xs text-ink-soft">
            <p>VITE_SUPABASE_URL=https://xxxx.supabase.co</p>
            <p>VITE_SUPABASE_ANON_KEY=your-anon-public-key</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
