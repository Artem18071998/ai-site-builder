import type { Key } from '../i18n'
import type { SitePage } from '../types'

type Props = {
  page: SitePage
  t: (key: Key) => string
  onChange: (blocks: SitePage['blocks']) => void
}

export default function BlockRail({ page, t, onChange }: Props) {
  const blocks = page.blocks

  const move = (from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return
    const next = [...blocks]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  const toggle = (i: number) =>
    onChange(blocks.map((b, j) => (j === i ? { ...b, hidden: !b.hidden } : b)))

  const arrow =
    'rounded px-1.5 text-mist transition hover:bg-black/5 hover:text-graphite disabled:opacity-30 disabled:hover:bg-transparent'

  return (
    <nav aria-label={t('rail.title')} className="rounded-xl bg-white/70 p-3 ring-1 ring-black/5">
      <h2 className="font-display text-sm font-semibold tracking-tight">{t('rail.title')}</h2>
      <ul className="mt-2 flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-visible xl:pb-0">
        {blocks.map((b, i) => (
          <li
            key={i}
            className="flex shrink-0 items-center gap-1 rounded-lg bg-white px-2 py-1.5 ring-1 ring-black/10"
          >
            <input
              type="checkbox"
              id={`blk-${i}`}
              checked={!b.hidden}
              onChange={() => toggle(i)}
              className="size-4 accent-[var(--ui-accent)]"
            />
            <label
              htmlFor={`blk-${i}`}
              className={`min-w-24 flex-1 cursor-pointer text-sm ${b.hidden ? 'text-mist line-through' : ''}`}
            >
              {t(`block.${b.type}` as Key)}
            </label>
            <button
              type="button"
              onClick={() => move(i, i - 1)}
              disabled={i === 0}
              aria-label={t('rail.up')}
              className={arrow}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, i + 1)}
              disabled={i === blocks.length - 1}
              aria-label={t('rail.down')}
              className={arrow}
            >
              ↓
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}