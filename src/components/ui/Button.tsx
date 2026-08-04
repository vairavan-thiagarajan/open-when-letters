import { forwardRef, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { useRipples, RippleLayer } from '@/components/ui/Ripple'
import { springs } from '@/utils/anim'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'ghost' | 'outline' | 'soft'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: Size
  children?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-forest-ink text-cream-paper hover:opacity-90 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]',
  soft: 'bg-sticky-note-mint text-forest-ink hover:bg-sticky-note-teal',
  outline:
    'border border-forest-ink text-forest-ink hover:bg-forest-ink hover:text-cream-paper',
  ghost: 'text-ink-soft hover:bg-blush hover:text-ink',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-base',
}

const gaps: Record<Size, string> = {
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2',
}

const rippleColors: Record<Variant, string> = {
  primary: 'rgba(255,255,255,0.3)',
  soft: 'rgba(26,51,0,0.12)',
  outline: 'rgba(26,51,0,0.1)',
  ghost: 'rgba(26,51,0,0.12)',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', onClick, children, ...props }, ref) => {
    const { add, ripples } = useRipples()

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={springs.snappy}
        onClick={(event) => {
          add(event)
          onClick?.(event)
        }}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden rounded-md font-medium tracking-tight transition-all duration-200 select-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'relative z-10 inline-flex items-center justify-center',
            gaps[size],
          )}
        >
          {children}
        </span>
        <RippleLayer ripples={ripples} color={rippleColors[variant]} className="rounded-md" />
      </motion.button>
    )
  },
)

Button.displayName = 'Button'
