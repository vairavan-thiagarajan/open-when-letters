import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

/** Renders a QR code to a data URL in the brand palette. */
export function QRCodeCard({ value, size = 140, className }: QRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    if (!value) return
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#46343b', light: '#fffdfa' },
    })
      .then((url) => {
        if (alive) setDataUrl(url)
      })
      .catch(() => {
        if (alive) setDataUrl(null)
      })
    return () => {
      alive = false
    }
  }, [value, size])

  return (
    <div
      className={cn(
        'grid place-items-center rounded-2xl border border-line bg-paper p-3 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]',
        className,
      )}
    >
      {dataUrl ? (
        <img
          src={dataUrl}
          alt="QR code that opens this collection"
          width={size}
          height={size}
          loading="lazy"
          className="h-auto w-full max-w-[140px] rounded-lg"
        />
      ) : (
        <Skeleton className="h-28 w-28 rounded-lg" />
      )}
    </div>
  )
}
