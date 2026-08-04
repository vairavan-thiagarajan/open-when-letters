import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import type { ButtonProps } from '@/components/ui/Button'

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
}

/** Button that shows a loading state and disables itself while an async action runs. */
export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <motion.span className="flex items-center gap-1" aria-hidden>
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.14, ease: 'easeInOut' }}
                className="h-1.5 w-1.5 rounded-full bg-current"
              />
            ))}
          </motion.span>
          {loadingText && <span>{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
