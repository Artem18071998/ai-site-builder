import { generateSite, GenerationError } from '../../server/generateSite'

type KV = {
  get(key: string): Promise<string | null>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
}

interface Env {
  GEMINI_API_KEY?: string
  GEMINI_MODEL?: string
  GEMINI_FALLBACK_MODEL?: string
  PER_IP_DAILY?: string
  GLOBAL_DAILY?: string
  LIMITS?: KV
}

// ЕС, ЕЭЗ, Швейцария, Великобритания: бесплатная квота Gemini API там не разрешена
const BLOCKED = new Set(
  'AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO CH GB'.split(
    ' ',
  ),
)

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

const fail = (status: number, code: string, error: string) => json(status, { code, error })

// Невалидное значение в настройках не должно отключать лимит
const num = (value: string | undefined, fallback: number) => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

async function fingerprint(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Счётчик в KV: не строго атомарный, для защиты от злоупотреблений хватает
async function bump(kv: KV, key: string, limit: number) {
  const current = Number((await kv.get(key)) ?? 0)
  if (current >= limit) return false
  await kv.put(key, String(current + 1), { expirationTtl: 90000 })
  return true
}

// Сколько раз посетители упёрлись в лимит: данные для решения о платных пакетах
async function countHit(kv: KV, code: string, day: string) {
  try {
    const key = `hits:${code}:${day}`
    const n = Number((await kv.get(key)) ?? 0)
    await kv.put(key, String(n + 1), { expirationTtl: 5184000 })
  } catch {
    /* статистика не должна ломать ответ */
  }
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return fail(403, 'FOREIGN_ORIGIN', 'A request from another site was rejected.')
  }

  const country = request.headers.get('cf-ipcountry')
  if (country && BLOCKED.has(country)) {
    return fail(451, 'REGION', 'The service is not available in your region yet.')
  }

  if (Number(request.headers.get('content-length') ?? 0) > 20_000) {
    return fail(413, 'TOO_LARGE', 'The request is too large.')
  }

  const userKey = request.headers.get('x-user-api-key')?.trim() ?? ''
  if (userKey && (userKey.length < 20 || userKey.length > 200 || /\s/.test(userKey))) {
    return fail(400, 'BAD_KEY', 'The API key looks invalid.')
  }

  const apiKey = userKey || env.GEMINI_API_KEY
  if (!apiKey) return fail(500, 'NOT_CONFIGURED', 'The service is not configured.')

  // Без хранилища счётчиков общую квоту не открываем
  if (!env.LIMITS && !userKey) {
    return fail(503, 'UNAVAILABLE', 'The service is temporarily unavailable.')
  }

  if (env.LIMITS) {
    const day = new Date().toISOString().slice(0, 10)
    const ip = await fingerprint(request.headers.get('cf-connecting-ip') ?? 'unknown')
    const perIp = userKey ? 30 : num(env.PER_IP_DAILY, 3)

    if (!(await bump(env.LIMITS, `ip:${userKey ? 'own' : 'shared'}:${ip}:${day}`, perIp))) {
      const code = userKey ? 'LIMIT_IP_OWN' : 'LIMIT_IP'
      await countHit(env.LIMITS, code, day)
      return fail(429, code, 'Daily request limit reached.')
    }
    if (!userKey && !(await bump(env.LIMITS, `global:${day}`, num(env.GLOBAL_DAILY, 150)))) {
      await countHit(env.LIMITS, 'LIMIT_GLOBAL', day)
      return fail(429, 'LIMIT_GLOBAL', 'Free generations for today are used up.')
    }
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return fail(400, 'BAD_REQUEST', 'Invalid request.')
  }

  try {
    const page = await generateSite(
      body,
      apiKey,
      env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
      env.GEMINI_FALLBACK_MODEL,
    )
    return json(200, page)
  } catch (e) {
    if (e instanceof GenerationError) return fail(e.status, e.code, e.message)
    console.error(e)
    return fail(500, 'INTERNAL', 'Internal server error.')
  }
}