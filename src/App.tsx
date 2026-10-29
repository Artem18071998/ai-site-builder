import { useState } from 'react'
import { downloadHtml } from './export'
import { CONTACT_TELEGRAM } from './config'
import { telegramUrl } from './links'
import SiteRenderer from './components/SiteRenderer'
import type { Path } from './components/editContext'
import { sampleBarbershop } from './sampleData'
import { themes, type ThemeName } from './themes'
import type { SitePage } from './types'

type Service = { name: string; price: string }
type Form = {
  description: string
  name: string
  city: string
  phone: string
  telegram: string
  address: string
  hours: string
  services: Service[]
}

const emptyForm: Form = {
  description: '',
  name: '',
  city: '',
  phone: '',
  telegram: '',
  address: '',
  hours: '',
  services: [{ name: '', price: '' }],
}

const baseInput =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
const inputCls = `w-full ${baseInput}`

function setIn(node: unknown, path: Path, value: string): unknown {
  if (path.length === 0) return value
  const [key, ...rest] = path
  if (Array.isArray(node)) {
    const copy = [...node]
    copy[key as number] = setIn(node[key as number], rest, value)
    return copy
  }
  const obj = node as Record<string, unknown>
  return { ...obj, [key]: setIn(obj[key], rest, value) }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  )
}

export default function App() {
  const [form, setForm] = useState<Form>(emptyForm)
  const [page, setPage] = useState<SitePage | null>(null)
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDemo, setIsDemo] = useState(false)
  const [editing, setEditing] = useState(false)
  const [userKey, setUserKey] = useState(() => {
    try {
      return localStorage.getItem('gemini-key') ?? ''
    } catch {
      return ''
    }
  })

  function saveKey(value: string) {
    setUserKey(value)
    try {
      if (value.trim()) localStorage.setItem('gemini-key', value.trim())
      else localStorage.removeItem('gemini-key')
    } catch {
      /* хранилище недоступно: работаем без сохранения */
    }
  }

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const updateService = (idx: number, patch: Partial<Service>) =>
    set(
      'services',
      form.services.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
    )

  async function handleGenerate() {
    if (cooldown || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userKey.trim() ? { 'x-user-api-key': userKey.trim() } : {}),
        },
        body: JSON.stringify({
          ...form,
          services: form.services.filter((s) => s.name.trim()),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Ошибка генерации')
      setPage(data as SitePage)
      setIsDemo(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Неизвестная ошибка')
      setPage(sampleBarbershop)
      setIsDemo(true)
    } finally {
      setLoading(false)
      setCooldown(true)
      setTimeout(() => setCooldown(false), 15000)
    }
  }

  const handleEdit = (path: Path, value: string) =>
    setPage((p) => (p ? (setIn(p, path, value) as SitePage) : p))

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
  <img src="/favicon.svg" alt="" className="size-8" />
  <h1 className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent">
    AI Site Builder
  </h1>
  <p className="text-sm text-slate-500">Сайт-визитка за пару минут</p>
</div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[400px_1fr]">
        <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <Field label="Чем вы занимаетесь *">
            <textarea
              rows={4}
              maxLength={1500}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Веб-студия: делаем сайты и интернет-магазины, поддержка после запуска"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Название">
              <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field label="Город">
              <input className={inputCls} value={form.city} onChange={(e) => set('city', e.target.value)} />
            </Field>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-600">Услуги и цены</span>
            {form.services.map((s, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  className={`${baseInput} min-w-0 flex-1`}
                  placeholder="Услуга"
                  value={s.name}
                  onChange={(e) => updateService(idx, { name: e.target.value })}
                />
                <input
                  className={`${baseInput} w-28 shrink-0`}
                  placeholder="Цена"
                  value={s.price}
                  onChange={(e) => updateService(idx, { price: e.target.value })}
                />
                {form.services.length > 1 && (
                  <button
                    onClick={() => set('services', form.services.filter((_, i) => i !== idx))}
                    className="rounded-lg px-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Удалить услугу"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {form.services.length < 8 && (
              <button
                onClick={() => set('services', [...form.services, { name: '', price: '' }])}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                + Добавить услугу
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Телефон">
              <input className={inputCls} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+380..." />
            </Field>
            <Field label="Telegram">
              <input className={inputCls} value={form.telegram} onChange={(e) => set('telegram', e.target.value)} placeholder="@username" />
            </Field>
            <Field label="Адрес">
              <input className={inputCls} value={form.address} onChange={(e) => set('address', e.target.value)} />
            </Field>
            <Field label="График">
              <input className={inputCls} value={form.hours} onChange={(e) => set('hours', e.target.value)} placeholder="Пн-Пт 10:00-19:00" />
            </Field>
          </div>

          <details className="rounded-lg border border-slate-200 p-3 text-xs text-slate-600">
            <summary className="cursor-pointer font-medium">
              Свой ключ Gemini (если бесплатный лимит исчерпан)
            </summary>
            <p className="mt-2 leading-relaxed">
              Бесплатный ключ создаётся в Google AI Studio. Он хранится только в вашем браузере и
              отправляется вместе с запросом, на нашем сервере не сохраняется.
            </p>
            <input
              type="password"
              autoComplete="off"
              value={userKey}
              onChange={(e) => saveKey(e.target.value)}
              placeholder="AIza..."
              className={`${inputCls} mt-2`}
            />
          </details>

          <p className="text-xs leading-relaxed text-slate-500">
            Текст из поля «Чем вы занимаетесь» обрабатывается сервисом Google AI, не пишите там
            личные данные. Телефон, адрес и Telegram в AI не отправляются. Страницы мы не
            сохраняем. Для лимитов на сутки временно хранится обезличенный отпечаток IP-адреса.
          </p>

          <button
            onClick={handleGenerate}
            disabled={form.description.trim().length < 10 || loading || cooldown}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? 'Генерирую...' : cooldown ? 'Подождите немного...' : 'Сгенерировать'}
          </button>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error} Показан пример страницы.
            </p>
          )}
        </section>

        <section className="lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs text-slate-400">превью</span>
            </div>

            {page && (
              <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 px-4 py-2.5 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={editing} onChange={(e) => setEditing(e.target.checked)} />
                  Править текст
                </label>
                <div className="flex gap-1">
                  {(Object.keys(themes) as ThemeName[]).map((name) => (
                    <button
                      key={name}
                      onClick={() => setPage({ ...page, theme: name })}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        page.theme === name
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {themes[name].label}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2">
                  Цвет
                  <input
                    type="color"
                    value={page.accent}
                    onChange={(e) => setPage({ ...page, accent: e.target.value })}
                    className="h-6 w-8 cursor-pointer rounded border border-slate-300"
                  />
                </label>
                {!isDemo && (
                  <button
                    onClick={() => downloadHtml(page)}
                    className="ml-auto rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700"
                  >
                    Скачать сайт (HTML)
                  </button>
                )}
              </div>
            )}

            {isDemo && (
              <p className="bg-amber-50 px-4 py-2 text-xs text-amber-800">
                Это пример, а не ваша страница.
              </p>
            )}

            <div className="max-h-[75vh] min-h-96 overflow-auto">
              {page ? (
                <SiteRenderer page={page} editable={editing} onEdit={handleEdit} />
              ) : (
                <p className="p-8 text-slate-400">
                  Здесь появится ваша страница. Заполните форму слева и нажмите «Сгенерировать».
                </p>
              )}
            </div>
          </div>

          {page && !isDemo && (
            <a
              href={telegramUrl(CONTACT_TELEGRAM)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block rounded-2xl bg-indigo-600 p-4 text-center text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              Нужен многостраничный сайт, магазин или доработка? Напишите мне в Telegram
            </a>
          )}
        </section>
      </main>
    </div>
  )
}