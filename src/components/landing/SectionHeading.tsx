import { cn } from '@/utils/cn'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  text?: string
  align?: 'center' | 'left'
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
      )}
    >
      <p className="text-xs font-semibold tracking-widest font-mono text-forest-ink uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {text && <p className="mt-4 text-base leading-relaxed text-ink-soft">{text}</p>}
    </div>
  )
}
