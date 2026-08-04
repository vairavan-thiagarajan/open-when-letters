import { useEffect, useState } from 'react'
import { UNLOCK_META, formatUnlockDate } from '@/utils/schedule'
import type { LetterSchedule, UnlockType } from '@/services/types'
import { cn } from '@/utils/cn'

interface SchedulePickerProps {
  value: LetterSchedule
  onChange: (schedule: LetterSchedule) => void
}

const OPTIONS: Array<{ type: UnlockType }> = [
  { type: 'immediate' },
  { type: 'date' },
  { type: 'birthday' },
  { type: 'anniversary' },
]

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function toLocalInputValue(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10)
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function toDateTimeInputValue(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return toLocalInputValue(iso)
  return `${toLocalInputValue(iso)}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function SchedulePicker({ value, onChange }: SchedulePickerProps) {
  const [dateInput, setDateInput] = useState(
    value.type === 'date'
      ? toDateTimeInputValue(value.date)
      : toLocalInputValue(value.date),
  )

  useEffect(() => {
    setDateInput(
      value.type === 'date'
        ? toDateTimeInputValue(value.date)
        : toLocalInputValue(value.date),
    )
  }, [value.type, value.date])

  const setType = (type: UnlockType) => {
    if (type === value.type) return
    let date: string | null = null
    if (type !== 'immediate') {
      const fallback = new Date()
      if (type === 'date') {
        fallback.setDate(fallback.getDate() + 30)
        date = fallback.toISOString()
      } else {
        fallback.setFullYear(fallback.getFullYear() + 1)
        date = fallback.toISOString()
      }
      setDateInput(
        type === 'date'
          ? toDateTimeInputValue(date)
          : toLocalInputValue(date),
      )
    }
    onChange({ type, date })
  }

  const updateDate = (raw: string) => {
    setDateInput(raw)
    if (!raw) return
    const date =
      value.type === 'date'
        ? new Date(raw).toISOString()
        : new Date(`${raw}T00:00:00`).toISOString()
    onChange({ type: value.type, date })
  }

  const selectedMeta = UNLOCK_META[value.type]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="When does it open">
        {OPTIONS.map((option) => {
          const active = value.type === option.type
          const meta = UNLOCK_META[option.type]
          return (
            <button
              key={option.type}
              type="button"
              onClick={() => setType(option.type)}
              aria-pressed={active}
              title={meta.hint}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 min-h-11',
                active
                  ? 'border-ink bg-paper text-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                  : 'border-line bg-paper/60 text-ink-soft hover:border-highlighter-yellow',
              )}
            >
              {meta.label}
            </button>
          )
        })}
      </div>

      {value.type !== 'immediate' && (
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-line bg-cream/60 p-4 sm:flex-row sm:items-center">
          <input
            type={value.type === 'date' ? 'datetime-local' : 'date'}
            value={dateInput}
            onChange={(event) => updateDate(event.target.value)}
            className="w-full rounded-2xl border border-line bg-paper px-4 py-2.5 text-sm text-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] outline-none transition-colors focus:border-highlighter-yellow sm:w-auto"
            aria-label={selectedMeta.hint}
          />
          <p className="text-xs leading-relaxed text-mist sm:ml-1">
            {selectedMeta.hint}.{'\n'}
            {value.date && formatUnlockDate(value.date, value.type)}
          </p>
        </div>
      )}
    </div>
  )
}
