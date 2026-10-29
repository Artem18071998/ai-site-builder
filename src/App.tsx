import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { downloadHtml } from './export'
import { CONTACT_EMAIL, CONTACT_TELEGRAM, CONTACT_UPWORK, CONTACT_WHATSAPP } from './config'
import { telegramUrl } from './links'
import { SITE_LANGUAGES, useI18n, type Key, type Lang } from './i18n'
import Logo from './components/Logo'
import DemoShowcase from './components/DemoShowcase'
import SiteRenderer from './components/SiteRenderer'
import type { Path } from './components/editContext'
import { readableOn, themes, type ThemeName } from './themes'
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

const fieldBase =
  'rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none transition focus-visible:border-black/40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ui-accent)]'
const field = `w-full ${fieldBase}`

const accentBtn =
  'bg-[var(--ui-accent)] text-[var(--ui-on-accent)] disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-black/40'

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
      <span className="text-xs font-medium text-mist">{label}</span>
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
        className={field}
        type={props.type ?? 'text'}
        maxLength={props.max}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </Field>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={title}
      className="space-y-3 border-t border-black/10 pt-4 first:border-t-0 first:pt-0"
    >
      <h2 className="font-display text-sm font-semibold tracking-tight">{title}</h2>
      {children}
    </div>
  )
}

function CustomSiteCta({ t }: { t: (key: Key) => string }) {
  const btn = 'rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20'
  return (
    <div className="mt-5 rounded-xl bg-graphite p-5 text-white">
      <p className="font-display text-base font-semibold tracking-tight">{t('cta.title')}</p>
      <p className="mt-1 max-w-md text-sm text-white/70">{t('cta.text')}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {CONTACT_EMAIL && (
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Custom website')}`}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-graphite transition hover:bg-white/85"
          >
            {t('cta.email')}
          </a>
        )}
        {CONTACT_WHATSAPP && (
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent('Hi! I need a custom website.')}`}
            target="_blank"
            rel="noreferrer"
            className={btn}
          >
            WhatsApp
          </a>
        )}
        {CONTACT_TELEGRAM && (
          <a href={telegramUrl(CONTACT_TELEGRAM)} target="_blank" rel="noreferrer" className={btn}>
            Telegram
          </a>
        )}
        {CONTACT_UPWORK && (
          <a href={CONTACT_UPWORK} target="_blank" rel="noreferrer" className={btn}>
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
  const [demoAccent, setDemoAccent] = useState('#2f6fed')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [err, setErr] = useState<Err | null>(null)
  const [editing, setEditing] = useState(false)
  const previewRef = useRef<HTMLElement>(null)
  const [userKey, setUserKey] = useState(() => {
    try {
      return localStorage.getItem('gemini-key') ?? ''
    } catch {
      return ''
    }
  })

  const accent = page?.accent ?? demoAccent
  const rootStyle = {
    '--ui-accent': accent,
    '--ui-on-accent': readableOn(accent),
  } as CSSProperties

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

  // На телефоне после создания прокручиваем к результату
  function scrollToPreview() {
    if (!window.matchMedia('(max-width: 1023px)').matches) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    previewRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

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
      requestAnimationFrame(scrollToPreview)
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

  const limitHit =
    err?.code === 'LIMIT_IP' || err?.code === 'LIMIT_GLOBAL' || err?.code === 'LIMIT_IP_OWN'

  return (
    <div
      className="chameleon min-h-screen bg-chalk font-sans text-graphite"
      style={rootStyle}
    >
      <header className="px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <Logo className="size-8" />
          <h1 className="font-display text-lg font-semibold tracking-tight">AI Site Builder</h1>
          <p className="hidden text-sm text-mist md:block">{t('tagline')}</p>
          <div className="ml-auto flex gap-1">
            {(['en', 'uk', 'ru'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  lang === l ? 'bg-graphite text-white' : 'bg-black/5 hover:bg-black/10'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 pb-10 lg:grid-cols-[400px_1fr]">
        <section className="space-y-5 rounded-2xl bg-white p-5 ring-1 ring-black/5">
          <Group title={t('g.business')}>
            <Field label={t('f.desc')}>
              <textarea
                rows={4}
                maxLength={1500}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder={t('f.desc.ph')}
                className={field}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <TextField label={t('f.name')} value={form.name} max={80} onChange={(v) => set('name', v)} />
              <TextField label={t('f.city')} value={form.city} max={60} onChange={(v) => set('city', v)} />
            </div>
            <Field label={t('f.siteLang')}>
              <select
                className={field}
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
          </Group>

          <Group title={t('f.services')}>
            {form.services.map((s, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  className={`${fieldBase} min-w-0 flex-1`}
                  placeholder={t('f.service.ph')}
                  maxLength={80}
                  value={s.name}
                  onChange={(e) => updateService(idx, { name: e.target.value })}
                />
                <input
                  className={`${fieldBase} w-28 shrink-0`}
                  placeholder={t('f.price.ph')}
                  maxLength={40}
                  value={s.price}
                  onChange={(e) => updateService(idx, { price: e.target.value })}
                />
                {form.services.length > 1 && (
                  <button
                    onClick={() => set('services', form.services.filter((_, i) => i !== idx))}
                    className="rounded-lg px-2 text-mist transition hover:bg-black/5 hover:text-graphite"
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
                className="text-sm font-medium underline underline-offset-4 hover:no-underline"
              >
                {t('f.addService')}
              </button>
            )}
          </Group>

          <Group title={t('g.contacts')}>
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
          </Group>

          <details className="rounded-lg border border-black/10 p-3 text-xs text-mist">
            <summary className="cursor-pointer font-medium text-graphite">{t('key.summary')}</summary>
            <ol className="mt-2 list-decimal space-y-1 pl-4 leading-relaxed">
              <li>
                {t('key.s1a')}{' '}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-graphite underline"
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
              className={`${field} mt-2`}
            />
          </details>

          <p className="text-xs leading-relaxed text-mist">{t('privacy')}</p>

          {err && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {te(err.code, err.fallback)}
            </p>
          )}

          <div className="sticky bottom-0 -mx-5 -mb-5 rounded-b-2xl border-t border-black/10 bg-white/95 px-5 py-4 backdrop-blur">
            <button
              onClick={handleGenerate}
              disabled={form.description.trim().length < 10 || loading || cooldown}
              className={`w-full rounded-xl px-4 py-3 font-semibold transition hover:brightness-95 ${accentBtn}`}
            >
              {loading ? t('btn.generating') : cooldown ? t('btn.wait') : t('btn.generate')}
            </button>
          </div>
        </section>

        <section ref={previewRef} className="scroll-mt-4 lg:sticky lg:top-6 lg:self-start">
          <div
            className="rounded-[2rem] p-4 sm:p-6"
            style={{ background: 'color-mix(in oklab, var(--ui-accent) 16%, white)' }}
          >
            <div className="overflow-hidden rounded-xl bg-white shadow-[6px_6px_0_0_var(--ui-accent)] ring-1 ring-black/10">
              <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-2.5 text-xs text-mist">
                <span className="truncate">{page ? page.businessName : t('preview')}</span>
                {!page && (
                  <span className="shrink-0 rounded-full bg-graphite px-2 py-0.5 font-medium text-white">
                    {t('demo.badge')}
                  </span>
                )}
              </div>

              {page && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-black/10 px-4 py-2.5 text-sm">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editing}
                      onChange={(e) => setEditing(e.target.checked)}
                      className="size-4 accent-[var(--ui-accent)]"
                    />
                    {t('edit')}
                  </label>
                  <div className="flex gap-1">
                    {(Object.keys(themes) as ThemeName[]).map((name) => (
                      <button
                        key={name}
                        onClick={() => setPage({ ...page, theme: name })}
                        aria-pressed={page.theme === name}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          page.theme === name ? 'bg-graphite text-white' : 'bg-black/5 hover:bg-black/10'
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
                      className="h-6 w-8 cursor-pointer rounded border border-black/20"
                    />
                  </label>
                  <button
                    onClick={() => downloadHtml(page)}
                    className={`ml-auto rounded-full px-4 py-1.5 text-xs font-semibold transition hover:brightness-95 ${accentBtn}`}
                  >
                    {t('download')}
                  </button>
                </div>
              )}

              <div className="max-h-[70vh] min-h-96 overflow-auto">
                {page ? (
                  <SiteRenderer page={page} editable={editing} onEdit={handleEdit} />
                ) : (
                  <DemoShowcase lang={lang} onAccent={setDemoAccent} />
                )}
              </div>
            </div>
          </div>

          {(page || limitHit) && <CustomSiteCta t={t} />}
        </section>
      </main>
    </div>
  )
}