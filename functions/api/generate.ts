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

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json(403, { error: 'Запрос с чужого сайта отклонён.' })
  }

  const country = request.headers.get('cf-ipcountry')
  if (country && BLOCKED.has(country)) {
    return json(451, {
      code: 'REGION',
      error: 'Сервис пока недоступен в вашем регионе (ЕС, ЕЭЗ, Швейцария, Великобритания).',
    })
  }

  if (Number(request.headers.get('content-length') ?? 0) > 20_000) {
    return json(413, { error: 'Слишком большой запрос.' })
  }

  const userKey = request.headers.get('x-user-api-key')?.trim() ?? ''
  if (userKey && (userKey.length < 20 || userKey.length > 200 || /\s/.test(userKey))) {
    return json(400, { error: 'Ключ API выглядит неверно.' })
  }

  const apiKey = userKey || env.GEMINI_API_KEY
  if (!apiKey) return json(500, { error: 'Сервис не настроен.' })

  // Без хранилища счётчиков общую квоту не открываем
  if (!env.LIMITS && !userKey) {
    return json(503, { error: 'Сервис временно недоступен.' })
  }

  if (env.LIMITS) {
    const day = new Date().toISOString().slice(0, 10)
    const ip = await fingerprint(request.headers.get('cf-connecting-ip') ?? 'unknown')
    const perIp = userKey ? 30 : num(env.PER_IP_DAILY, 3)

    if (!(await bump(env.LIMITS, `ip:${userKey ? 'own' : 'shared'}:${ip}:${day}`, perIp))) {
      return json(429, {
        code: 'LIMIT_IP',
        error: userKey
          ? 'Дневной лимит запросов исчерпан. Попробуйте завтра.'
          : 'Вы использовали бесплатные генерации на сегодня. Вставьте свой ключ Gemini или попробуйте завтра.',
      })
    }
    if (!userKey && !(await bump(env.LIMITS, `global:${day}`, num(env.GLOBAL_DAILY, 150)))) {
      return json(429, {
        code: 'LIMIT_GLOBAL',
        error: 'Общий лимит бесплатных генераций на сегодня исчерпан. Вставьте свой ключ Gemini или зайдите завтра.',
      })
    }
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Некорректный запрос.' })
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
    if (e instanceof GenerationError) return json(e.status, { error: e.message })
    console.error(e)
    return json(500, { error: 'Внутренняя ошибка сервера.' })
  }
}