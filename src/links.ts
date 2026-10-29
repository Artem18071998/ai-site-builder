export function telegramUrl(value: string) {
  const s = value.trim()
  if (/^https?:\/\//i.test(s)) return s
  const handle = s.replace(/^@/, '').replace(/^t\.me\//i, '')
  return `https://t.me/${encodeURIComponent(handle)}`
}

export function phoneHref(value: string) {
  return `tel:${value.replace(/[^\d+]/g, '')}`
}

export function whatsappUrl(value: string) {
  const s = value.trim()
  if (/^https?:\/\//i.test(s)) return s
  return `https://wa.me/${s.replace(/\D/g, '')}`
}

export function instagramUrl(value: string) {
  const s = value.trim()
  if (/^https?:\/\//i.test(s)) return s
  const handle = s
    .replace(/^@/, '')
    .replace(/^(www\.)?instagram\.com\//i, '')
    .replace(/[/?#].*$/, '')
  return `https://instagram.com/${encodeURIComponent(handle)}`
}

export function mailtoHref(value: string) {
  const s = value.trim()
  return /^[^\s@?&]+@[^\s@?&]+\.[^\s@?&]+$/.test(s) ? `mailto:${s}` : '#'
}