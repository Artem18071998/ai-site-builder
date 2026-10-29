import { useEffect, useState } from 'react'
import SiteRenderer from './SiteRenderer'
import { DEMO_COUNT, demoPage } from '../demo'
import type { Lang } from '../i18n'

type Props = { lang: Lang; onAccent: (color: string) => void }

export default function DemoShowcase({ lang, onAccent }: Props) {
  const [index, setIndex] = useState(0)
  const page = demoPage(index, lang)

  useEffect(() => {
    onAccent(page.accent)
  }, [page.accent, onAccent])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % DEMO_COUNT), 5500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div key={index} className="demo-in pointer-events-none select-none" aria-hidden="true">
      <SiteRenderer page={page} />
    </div>
  )
}