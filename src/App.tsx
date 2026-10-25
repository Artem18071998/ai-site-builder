import { useState } from 'react'
import SiteRenderer from './components/SiteRenderer'
import { sampleBarbershop } from './sampleData'
import type { SitePage } from './types'

export default function App() {
  const [description, setDescription] = useState('')
  const [page, setPage] = useState<SitePage | null>(null)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold">AI Site Builder</h1>
        <p className="text-sm text-slate-500">Опишите бизнес, получите сайт-визитку</p>
      </header>

      <main className="grid gap-6 p-6 md:grid-cols-[360px_1fr]">
        <section className="space-y-3">
          <label htmlFor="description" className="block text-sm font-medium">
            Опишите ваш бизнес
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            placeholder="Барбершоп в Киеве, 3 мастера, стрижка от 500 грн, работаем с 10 до 20"
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={() => setPage(sampleBarbershop)}
            disabled={!description.trim()}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Сгенерировать
          </button>
          <p className="text-xs text-slate-400">
            Пока подставляется тестовый пример. AI подключим на следующем шаге.
          </p>
        </section>

        <section className="min-h-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {page ? (
            <SiteRenderer page={page} />
          ) : (
            <p className="p-6 text-slate-400">
              Здесь появится ваша страница. Напишите описание слева.
            </p>
          )}
        </section>
      </main>
    </div>
  )
}