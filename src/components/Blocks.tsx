import type { HeroBlock, ServicesBlock, FeaturesBlock, ContactsBlock } from '../types'

export function Hero({ block, accent }: { block: HeroBlock; accent: string }) {
  return (
    <section className="px-8 py-20 text-center">
      <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight">{block.title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">{block.subtitle}</p>
      <button
        className="mt-8 rounded-full px-8 py-3 font-medium text-white shadow-sm transition hover:opacity-90"
        style={{ backgroundColor: accent }}
      >
        {block.cta}
      </button>
    </section>
  )
}

export function Services({ block, accent }: { block: ServicesBlock; accent: string }) {
  return (
    <section className="bg-slate-50 px-8 py-16">
      <h3 className="mb-8 text-center text-2xl font-semibold">{block.title}</h3>
      <ul className="mx-auto max-w-xl divide-y divide-slate-200 rounded-xl bg-white shadow-sm">
        {block.items.map((item) => (
          <li key={item.name} className="flex items-start justify-between gap-4 p-5">
            <div>
              <p className="font-medium">{item.name}</p>
              {item.description && <p className="text-sm text-slate-500">{item.description}</p>}
            </div>
            <span className="whitespace-nowrap font-semibold" style={{ color: accent }}>
              {item.price && (
  <span className="whitespace-nowrap font-semibold" style={{ color: accent }}>
    {item.price}
  </span>
)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Features({ block, accent }: { block: FeaturesBlock; accent: string }) {
  return (
    <section className="px-8 py-16">
      <h3 className="mb-8 text-center text-2xl font-semibold">{block.title}</h3>
      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
        {block.items.map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-200 p-5">
            <div className="mb-3 h-1 w-8 rounded" style={{ backgroundColor: accent }} />
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-slate-600">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Contacts({ block }: { block: ContactsBlock }) {
  return (
    <section className="bg-slate-900 px-8 py-16 text-center text-white">
      <h3 className="mb-6 text-2xl font-semibold">{block.title}</h3>
      {block.address && <p>{block.address}</p>}
      {block.phone && <p className="mt-1">{block.phone}</p>}
      {block.hours && <p className="mt-1 text-slate-400">{block.hours}</p>}
    </section>
  )
}