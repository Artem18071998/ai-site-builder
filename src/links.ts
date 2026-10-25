export function telegramUrl(value: string) {
  const s = value.trim()
  if (/^https?:\/\//i.test(s)) return s
  const handle = s.replace(/^@/, '').replace(/^t\.me\//i, '')
  return `https://t.me/${encodeURIComponent(handle)}`
}

export function phoneHref(value: string) {
  return `tel:${value.replace(/[^\d+]/g, '')}`
}