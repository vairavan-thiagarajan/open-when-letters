import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'
import { removeDecorAsset, uploadDecorAudio } from '@/services/letterDecorStorage'

interface AudioAttachmentProps {
  /** Current audio URL ('' when none is set). */
  value: string
  /** Letter id used for the storage path. */
  letterId: string
  /** When provided the editor controls are shown; without it it's read-only. */
  onChange?: (url: string) => void
}

type Status = 'idle' | 'uploading' | 'error' | 'mic-denied' | 'unsupported'

const ACCEPTED_AUDIO = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/aac',
  'audio/ogg',
  'audio/webm',
  'audio/mp4',
  'audio/x-m4a',
]

const MAX_AUDIO_BYTES = 10 * 1024 * 1024

/**
 * Recording codecs in order of preference. Safari/iOS only supports MP4/AAC,
 * so it must be requested explicitly — otherwise the platform default differs
 * and the file can't be used everywhere.
 */
const AUDIO_MIME_CANDIDATES = [
  'audio/mp4;codecs=mp4a.40.2',
  'audio/mp4',
  'audio/aac',
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
]

function pickAudioMimeType(): string {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return ''
  return AUDIO_MIME_CANDIDATES.find((candidate) => MediaRecorder.isTypeSupported(candidate)) ?? ''
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const whole = Math.floor(seconds)
  const minutes = Math.floor(whole / 60)
  const rest = whole % 60
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

/** Minimal, reusable player — never autoplays. */
export function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      void audio.play()
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3 py-2 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Pause letter music' : 'Play letter music'}
        className={cn(
          'grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors',
          playing ? 'bg-forest-ink text-cream-paper' : 'bg-blush text-forest-ink',
        )}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
            <path d="M7 4.5v15l13-7.5-13-7.5z" />
          </svg>
        )}
      </button>
      <span className="text-xs font-semibold tracking-wide text-ink">Letter music</span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={current}
        aria-label="Seek"
        onChange={(event) => {
          const audio = audioRef.current
          if (!audio) return
          const next = Number(event.target.value)
          audio.currentTime = next
          setCurrent(next)
        }}
        className="h-1.5 min-w-0 flex-1 cursor-pointer accent-forest-ink"
      />
      <span className="w-14 shrink-0 text-right text-xs tabular-nums text-mist">
        {formatTime(current)} / {formatTime(duration)}
      </span>
    </div>
  )
}

/**
 * Optional per-letter audio. Upload or record in the editor; a read-only
 * player in the reader. Audio is never autoplayed and is stored in the
 * `letter-decor` bucket (no data-URL fallback — see service).
 */
export function AudioAttachment({ value, letterId, onChange }: AudioAttachmentProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    return () => {
      mediaRef.current?.stream.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const upload = useCallback(
    async (blob: Blob) => {
      if (!onChange) return
      setStatus('uploading')
      try {
        const previousUrl = value
        const url = await uploadDecorAudio(blob, letterId)
        onChange(url)
        setStatus('idle')
        if (previousUrl && previousUrl !== url) {
          removeDecorAsset(previousUrl).catch(() => {})
        }
      } catch {
        setStatus('error')
      }
    },
    [onChange, letterId, value],
  )

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return
      if (!ACCEPTED_AUDIO.includes(file.type)) {
        setStatus('error')
        return
      }
      if (file.size > MAX_AUDIO_BYTES) {
        setStatus('error')
        return
      }
      void upload(file)
    },
    [upload],
  )

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setStatus('unsupported')
      return
    }
    setStatus('idle')

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (error) {
      const name = error instanceof DOMException ? error.name : ''
      setStatus(name === 'NotAllowedError' || name === 'PermissionDeniedError' ? 'mic-denied' : 'error')
      return
    }

    try {
      const mimeType = pickAudioMimeType()
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      chunksRef.current = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        const type = (mimeType || recorder.mimeType || 'audio/mp4').split(';')[0].trim()
        const blob = new Blob(chunksRef.current, { type })
        stream.getTracks().forEach((track) => track.stop())
        mediaRef.current = null
        setRecording(false)
        if (blob.size > 0) void upload(blob)
      }
      mediaRef.current = recorder
      recorder.start()
      setRecording(true)
    } catch {
      stream.getTracks().forEach((track) => track.stop())
      setStatus('error')
    }
  }, [upload])

  const stopRecording = useCallback(() => {
    mediaRef.current?.stop()
  }, [])

  const cancelRecording = useCallback(() => {
    const recorder = mediaRef.current
    if (!recorder) return
    recorder.stream.getTracks().forEach((track) => track.stop())
    recorder.onstop = null
    mediaRef.current = null
    setRecording(false)
  }, [])

  const remove = useCallback(() => {
    if (value) removeDecorAsset(value).catch(() => {})
    onChange?.('')
    if (inputRef.current) inputRef.current.value = ''
  }, [onChange, value])

  const editor = Boolean(onChange)

  return (
    <div>
      {editor && (
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_AUDIO.join(',')}
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      )}

      {value ? (
        <div className="space-y-2">
          <AudioPlayer src={value} />
          {editor && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={status === 'uploading'}
                className="min-h-11 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-highlighter-yellow disabled:opacity-40"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={remove}
                className="min-h-11 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-highlighter-yellow"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ) : editor ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === 'uploading'}
            className="min-h-11 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-highlighter-yellow disabled:opacity-40"
          >
            Upload audio
          </button>
          {recording ? (
            <>
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                Stop &amp; add
              </button>
              <button
                type="button"
                onClick={cancelRecording}
                className="min-h-11 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-highlighter-yellow"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="min-h-11 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-highlighter-yellow"
            >
              Record
            </button>
          )}
        </div>
      ) : null}

      {status === 'uploading' && (
        <p className="mt-2 flex items-center gap-2 text-xs font-medium text-ink-soft">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest-ink" />
          Uploading audio…
        </p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-xs font-medium text-terracotta">
          That audio couldn't be used. Try an MP3, WAV or AAC file under 10&nbsp;MB.
        </p>
      )}
      {status === 'mic-denied' && (
        <p className="mt-2 text-xs font-medium text-terracotta">
          Microphone access was blocked. Allow the mic in your browser settings, then try again.
        </p>
      )}
      {status === 'unsupported' && (
        <p className="mt-2 text-xs font-medium text-terracotta">
          Live recording isn't supported in this browser — upload an audio file instead.
        </p>
      )}
      {editor && !value && status === 'idle' && (
        <p className="mt-2 text-xs leading-relaxed text-mist">
          One song or voice note per letter · never plays automatically.
        </p>
      )}
    </div>
  )
}
