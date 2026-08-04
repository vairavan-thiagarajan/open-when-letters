import { useRef } from 'react'
import { motion, useMotionValue, type PanInfo } from 'framer-motion'
import type { ReactNode } from 'react'
import { clampPercent } from '@/utils/markup'
import { cn } from '@/utils/cn'

interface MovableDecorProps {
  /** Paper-relative center position in %. */
  x: number
  y: number
  rotation: number
  scale: number
  readOnly?: boolean
  onCommit?: (patch: { x: number; y: number }) => void
  onSelect?: () => void
  selected?: boolean
  children: ReactNode
  className?: string
}

/**
 * A single draggable sticker/photo on the letter paper.
 *
 * An outer plain-positioned div holds the paper-relative % position and
 * centers the item with a CSS transform; the inner motion.div owns the framer
 * drag offset, rotation and scale. Keeping the two transforms on separate
 * elements avoids any framer/CSS-transform conflict, so items drag freely to
 * any spot on the paper (no snapping). The letter area is measured from a
 * ref on commit, never from event.currentTarget.
 */
export function MovableDecor({
  x,
  y,
  rotation,
  scale,
  readOnly = false,
  onCommit,
  onSelect,
  selected = false,
  children,
  className,
}: MovableDecorProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const offsetX = useMotionValue(0)
  const offsetY = useMotionValue(0)
  const start = useRef({ x, y })

  const handleDragStart = () => {
    start.current = { x, y }
  }

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    offsetX.set(info.offset.x)
    offsetY.set(info.offset.y)
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const rect = wrapRef.current?.parentElement?.getBoundingClientRect()
    if (rect && onCommit && (info.offset.x !== 0 || info.offset.y !== 0)) {
      onCommit({
        x: clampPercent(start.current.x + (info.offset.x / rect.width) * 100),
        y: clampPercent(start.current.y + (info.offset.y / rect.height) * 100),
      })
    }
    offsetX.set(0)
    offsetY.set(0)
  }

  return (
    <div
      ref={wrapRef}
      style={{ left: `${x}%`, top: `${y}%` }}
      onPointerDown={(event) => {
        if (readOnly) return
        event.stopPropagation()
        onSelect?.()
      }}
      className={cn(
        'absolute z-10 -translate-x-1/2 -translate-y-1/2',
        readOnly ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing',
        selected && !readOnly && 'z-20',
        className,
      )}
    >
      <motion.div
        drag={readOnly ? false : true}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileHover={readOnly ? undefined : { scale: scale * 1.05 }}
        whileTap={readOnly ? undefined : { scale: scale * 0.97 }}
        style={{
          rotate: rotation,
          scale,
          x: offsetX,
          y: offsetY,
          touchAction: 'none',
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
