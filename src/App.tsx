import { useState, type ReactNode } from 'react'
import { downloadHtml } from './export'
import { CONTACT_EMAIL, CONTACT_TELEGRAM, CONTACT_UPWORK, CONTACT_WHATSAPP } from './config'
import { telegramUrl } from './links'
import { SITE_LANGUAGES, useI18n, type Key, type Lang } from './i18n'
import SiteRenderer from './components/SiteRenderer'
import type { Path } from './components/editContext'
import { themes, type ThemeName } from './themes'
import type { SiteLang, SitePage } from './types'

type Service = { name: string; price: string }
type Form = {
  description: string
  name: string
  city: string
  language: SiteLang
  phone: string
  email: string
  whatsapp: string
  telegram: string
  instagram: string
  address: string
  hours: string
  services: Service[]
}

type Err = { code: string; fallback?: string }

const emptyForm: Form = {
  description: '',
  name: '',
  city: '',
  language: 'en',
  phone: '',
  email: '',
  whatsapp: '',
  telegram: '',
  instagram: '',
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  )
}

function TextField(props: {
  label: string
  value: string
  onChange: (value: string) => void
  max: number
  placeholder?: string
  type?: string
}) {
  return (
    <Field label={props.label}>
      <input
        className={inputCls}
        type={props.type ?? 'text'}
        maxLength={props.max}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </Field>
  )
}

function CustomSiteCta({ t }: { t: (key: Key) => string }) {
  const btn = 'rounded-full px-4 py-2 text-sm font-medium transition'
  return (
    <div className="mt-4 rounded-2xl bg-indigo-600 p-5 text-center text-white shadow-sm">
      <p className="font-semibold">{t('cta.title')}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-indigo-100">{t('cta.text')}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {CONTACT_EMAIL && (
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Custom website')}`}
            className={`${btn} bg-white text-indigo-700 hover:bg-indigo-50`}
          >
            {t('cta.email')}
          </a>
        )}
        {CONTACT_WHATSAPP && (
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent('Hi! I need a custom website.')}`}
            target="_blank"
            rel="noreferrer"
            className={`${btn} bg-emerald-500 hover:bg-emerald-400`}
          >
            WhatsApp
          </a>
        )}
        {CONTACT_TELEGRAM && (
          <a
            href={telegramUrl(CONTACT_TELEGRAM)}
            target="_blank"
            rel="noreferrer"
            className={`${btn} bg-indigo-500 hover:bg-indigo-400`}
          >
            Telegram
          </a>
        )}
        {CONTACT_UPWORK && (
          <a
            href={CONTACT_UPWORK}
            target="_blank"
            rel="noreferrer"
            className={`${btn} bg-indigo-500 hover:bg-indigo-400`}
          >
            Upwork
          </a>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const { lang, setLang, t, te } = useI18n()
  const [form, setForm] = useState<Form>(() => ({ ...emptyForm, language: lang }))
  const [page, setPage] = useState<SitePage | null>(null)
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [err, setErr] = useState<Err | null>(null)
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
    setErr(null)
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
      if (!res.ok) {
        setErr({ code: data.code ?? 'UNKNOWN', fallback: data.error })
        return
      }
      setPage(data as SitePage)
    } catch {
      setErr({ code: 'NETWORK' })
    } finally {
      setLoading(false)
      setCooldown(true)
      setTimeout(() => setCooldown(false), 15000)
    }
  }

  const handleEdit = (path: Path, value: string) =>
    setPage((p) => (p ? (setIn(p, path, value) as SitePage) : p))

  const limitHit = err?.code === 'LIMIT_IP' || err?.code === 'LIMIT_GLOBAL' || err?.code === 'LIMIT_IP_OWN'

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <img src="/public/favicon.svg" alt="" className="size-8" />
          <h1 className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent">
            AI Site Builder
          </h1>
          <p className="hidden text-sm text-slate-500 sm:block">{t('tagline')}</p>
          <div className="ml-auto flex gap-1">
            {(['en', 'uk', 'ru'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  lang === l
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[400px_1fr]">
        <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <Field label={t('f.desc')}>
            <textarea
              rows={4}
              maxLength={1500}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder={t('f.desc.ph')}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <TextField label={t('f.name')} value={form.name} max={80} onChange={(v) => set('name', v)} />
            <TextField label={t('f.city')} value={form.city} max={60} onChange={(v) => set('city', v)} />
          </div>

          <Field label={t('f.siteLang')}>
            <select
              className={inputCls}
              value={form.language}
              onChange={(e) => set('language', e.target.value as SiteLang)}
            >
              {SITE_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-600">{t('f.services')}</span>
            {form.services.map((s, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  className={`${baseInput} min-w-0 flex-1`}
                  placeholder={t('f.service.ph')}
                  maxLength={80}
                  value={s.name}
                  onChange={(e) => updateService(idx, { name: e.target.value })}
                />
                <input
                  className={`${baseInput} w-28 shrink-0`}
                  placeholder={t('f.price.ph')}
                  maxLength={40}
                  value={s.price}
                  onChange={(e) => updateService(idx, { price: e.target.value })}
                />
                {form.services.length > 1 && (
                  <button
                    onClick={() => set('services', form.services.filter((_, i) => i !== idx))}
                    className="rounded-lg px-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={t('f.removeService')}
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
                {t('f.addService')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextField label={t('f.phone')} value={form.phone} max={30} placeholder="+1 ..." onChange={(v) => set('phone', v)} />
            <TextField label={t('f.email')} value={form.email} max={120} type="email" placeholder="hello@example.com" onChange={(v) => set('email', v)} />
            <TextField label={t('f.whatsapp')} value={form.whatsapp} max={40} placeholder="+44 7700 900123" onChange={(v) => set('whatsapp', v)} />
            <TextField label={t('f.telegram')} value={form.telegram} max={60} placeholder="@username" onChange={(v) => set('telegram', v)} />
            <TextField label={t('f.instagram')} value={form.instagram} max={60} placeholder="@username" onChange={(v) => set('instagram', v)} />
            <TextField label={t('f.address')} value={form.address} max={120} onChange={(v) => set('address', v)} />
            <div className="col-span-2">
              <TextField label={t('f.hours')} value={form.hours} max={60} placeholder={t('f.hours.ph')} onChange={(v) => set('hours', v)} />
            </div>
          </div>

          <details className="rounded-lg border border-slate-200 p-3 text-xs text-slate-600">
            <summary className="cursor-pointer font-medium">{t('key.summary')}</summary>
            <ol className="mt-2 list-decimal space-y-1 pl-4 leading-relaxed">
              <li>
                {t('key.s1a')}{' '}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-600 underline"
                >
                  Google AI Studio
                </a>{' '}
                {t('key.s1b')}
              </li>
              <li>{t('key.s2')}</li>
              <li>{t('key.s3')}</li>
            </ol>
            <p className="mt-2 leading-relaxed">{t('key.stored')}</p>
            <input
              type="password"
              autoComplete="off"
              value={userKey}
              onChange={(e) => saveKey(e.target.value)}
              placeholder="AIza..."
              className={`${inputCls} mt-2`}
            />
          </details>

          <p className="text-xs leading-relaxed text-slate-500">{t('privacy')}</p>

          <button
            onClick={handleGenerate}
            disabled={form.description.trim().length < 10 || loading || cooldown}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? t('btn.generating') : cooldown ? t('btn.wait') : t('btn.generate')}
          </button>

          {err && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{te(err.code, err.fallback)}</p>
          )}
        </section>

        <section className="lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs text-slate-400">{t('preview')}</span>
            </div>

            {page && (
              <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 px-4 py-2.5 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={editing} onChange={(e) => setEditing(e.target.checked)} />
                  {t('edit')}
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
                      {t(`theme.${name}` as Key)}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2">
                  {t('color')}
                  <input
                    type="color"
                    value={page.accent}
                    onChange={(e) => setPage({ ...page, accent: e.target.value })}
                    className="h-6 w-8 cursor-pointer rounded border border-slate-300"
                  />
                </label>
                <button
                  onClick={() => downloadHtml(page)}
                  className="ml-auto rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700"
                >
                  {t('download')}
                </button>
              </div>
            )}

            <div className="max-h-[75vh] min-h-96 overflow-auto">
              {page ? (
                <SiteRenderer page={page} editable={editing} onEdit={handleEdit} />
              ) : (
                <p className="p-8 text-slate-400">{t('empty')}</p>
              )}
            </div>
          </div>

          {(page || limitHit) && <CustomSiteCta t={t} />}
        </section>
      </main>
    </div>
  )
}