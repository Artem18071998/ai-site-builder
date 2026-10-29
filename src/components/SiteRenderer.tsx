import type { CSSProperties, ReactNode } from 'react'
import type { ContactsBlock, SitePage } from '../types'
import { mailtoHref, phoneHref, telegramUrl, whatsappUrl } from '../links'
import { readableOn, themeStyle } from '../themes'
import { Hero, Services, Features, Contacts } from './Blocks'
import { Editable } from './Editable'
import { EditContext, type Path } from './editContext'

type Props = {
  page: SitePage
  editable?: boolean
  onEdit?: (path: Path, value: string) => void
  assemble?: boolean
}

function ctaLink(c?: ContactsBlock) {
  if (c?.phone) return phoneHref(c.phone)
  if (c?.whatsapp) return whatsappUrl(c.whatsapp)
  if (c?.telegram) return telegramUrl(c.telegram)
  if (c?.email) return mailtoHref(c.email)
  return '#contacts'
}

export default function SiteRenderer({
  page,
  editable = false,
  onEdit = () => {},
  assemble = false,
}: Props) {
  const contacts = page.blocks.find((b): b is ContactsBlock => b.type === 'contacts')
  const style = {
    ...themeStyle(page.theme),
    '--accent': page.accent,
    '--on-accent': readableOn(page.accent),
    fontFamily: 'var(--font)',
  } as CSSProperties

  return (
    <EditContext.Provider value={{ editable, onEdit }}>
      <div style={style} className="bg-[var(--bg)] text-[color:var(--text)]">
        <header className="border-b border-[color:var(--border)] px-8 py-4 text-lg font-bold">
          <Editable path={['businessName']} value={page.businessName} />
        </header>
        {page.blocks.map((block, i) => {
          if (block.hidden) return null

          const wrap = (node: ReactNode) => (
            <div
              key={i}
              className={assemble ? 'assemble' : undefined}
              style={assemble ? { animationDelay: `${i * 140}ms` } : undefined}
            >
              {node}
            </div>
          )

          switch (block.type) {
            case 'hero':
              return wrap(<Hero block={block} i={i} ctaHref={ctaLink(contacts)} />)
            case 'services':
              return wrap(<Services block={block} i={i} />)
            case 'features':
              return wrap(<Features block={block} i={i} />)
            case 'contacts':
              if (
                !block.address &&
                !block.phone &&
                !block.email &&
                !block.whatsapp &&
                !block.telegram &&
                !block.instagram &&
                !block.hours
              ) {
                return null
              }
              return wrap(<Contacts block={block} i={i} />)
          }
        })}
      </div>
    </EditContext.Provider>
  )
}