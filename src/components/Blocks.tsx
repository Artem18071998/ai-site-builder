import { useContext } from 'react'
import type { HeroBlock, ServicesBlock, FeaturesBlock, ContactsBlock } from '../types'
import { phoneHref, telegramUrl } from '../links'
import { Editable } from './Editable'
import { EditContext } from './editContext'

const card = 'rounded-[var(--radius)] border border-[color:var(--border)] bg-[var(--bg)]'

export function Hero({ block, i, ctaHref }: { block: HeroBlock; i: number; ctaHref: string }) {
  const { editable } = useContext(EditContext)
  const btn =
    'mt-8 inline-block rounded-full bg-[var(--accent)] px-8 py-3 font-medium text-[color:var(--on-accent)] shadow-sm transition hover:opacity-90'
  return (
    <section className="px-8 py-20 text-center">
      <Editable
        as="h2"
        path={['blocks', i, 'title']}
        value={block.title}
        className="mx-auto block max-w-2xl text-4xl font-bold tracking-tight"
      />
      <Editable
        as="p"
        path={['blocks', i, 'subtitle']}
        value={block.subtitle}
        className="mx-auto mt-4 block max-w-xl text-lg text-[color:var(--muted)]"
      />
      {editable ? (
        <span className={btn}>
          <Editable path={['blocks', i, 'cta']} value={block.cta} />
        </span>
      ) : (
        <a href={ctaHref} className={btn}>
          {block.cta}
        </a>
      )}
    </section>
  )
}

export function Services({ block, i }: { block: ServicesBlock; i: number }) {
  return (
    <section id="services" className="bg-[var(--surface)] px-8 py-16">
      <Editable
        as="h3"
        path={['blocks', i, 'title']}
        value={block.title}
        className="mb-8 block text-center text-2xl font-semibold"
      />
      <ul
        className={`mx-auto max-w-xl divide-y divide-[color:var(--border)] shadow-sm ${card}`}
      >
        {block.items.map((item, j) => (
          <li key={j} className="flex items-start justify-between gap-4 p-5">
            <div>
              <Editable
                as="p"
                path={['blocks', i, 'items', j, 'name']}
                value={item.name}
                className="block font-medium"
              />
              {item.description && (
                <Editable
                  as="p"
                  path={['blocks', i, 'items', j, 'description']}
                  value={item.description}
                  className="block text-sm text-[color:var(--muted)]"
                />
              )}
            </div>
            {item.price && (
              <Editable
                path={['blocks', i, 'items', j, 'price']}
                value={item.price}
                className="whitespace-nowrap font-semibold text-[color:var(--accent)]"
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Features({ block, i }: { block: FeaturesBlock; i: number }) {
  return (
    <section className="px-8 py-16">
      <Editable
        as="h3"
        path={['blocks', i, 'title']}
        value={block.title}
        className="mb-8 block text-center text-2xl font-semibold"
      />
      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
        {block.items.map((item, j) => (
          <div key={j} className={`p-5 ${card}`}>
            <div className="mb-3 h-1 w-8 rounded bg-[var(--accent)]" />
            <Editable
              as="p"
              path={['blocks', i, 'items', j, 'title']}
              value={item.title}
              className="block font-medium"
            />
            <Editable
              as="p"
              path={['blocks', i, 'items', j, 'text']}
              value={item.text}
              className="mt-1 block text-sm text-[color:var(--muted)]"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export function Contacts({ block, i }: { block: ContactsBlock; i: number }) {
  const { editable } = useContext(EditContext)
  const link = 'underline-offset-4 hover:underline'
  return (
    <section
      id="contacts"
      className="bg-[var(--footer-bg)] px-8 py-16 text-center text-[color:var(--footer-text)]"
    >
      <Editable
        as="h3"
        path={['blocks', i, 'title']}
        value={block.title}
        className="mb-6 block text-2xl font-semibold"
      />
      {block.address && (
        <Editable as="p" path={['blocks', i, 'address']} value={block.address} className="block" />
      )}
      {block.phone && (
        <p className="mt-1">
          {editable ? (
            <Editable path={['blocks', i, 'phone']} value={block.phone} />
          ) : (
            <a href={phoneHref(block.phone)} className={link}>
              {block.phone}
            </a>
          )}
        </p>
      )}
      {block.telegram && (
        <p className="mt-1">
          {editable ? (
            <Editable path={['blocks', i, 'telegram']} value={block.telegram} />
          ) : (
            <a href={telegramUrl(block.telegram)} className={link} target="_blank" rel="noreferrer">
              Telegram: {block.telegram}
            </a>
          )}
        </p>
      )}
      {block.hours && (
        <Editable
          as="p"
          path={['blocks', i, 'hours']}
          value={block.hours}
          className="mt-1 block opacity-70"
        />
      )}
    </section>
  )
}