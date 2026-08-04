export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  const intervals: Array<[number, string]> = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]

  for (const [secondsPer, label] of intervals) {
    const count = Math.floor(seconds / secondsPer)
    if (count >= 1) return `${count} ${label}${count === 1 ? '' : 's'} ago`
  }

  return 'just now'
}
