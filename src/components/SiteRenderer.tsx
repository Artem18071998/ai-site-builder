import type { CSSProperties } from 'react'
import type { ContactsBlock, SitePage } from '../types'
import { phoneHref, telegramUrl } from '../links'
import { readableOn, themeStyle } from '../themes'
import { Hero, Services, Features, Contacts } from './Blocks'
import { Editable } from './Editable'
import { EditContext, type Path } from './editContext'

type Props = {
  page: SitePage
  editable?: boolean
  onEdit?: (path: Path, value: string) => void
}

function ctaLink(contacts?: ContactsBlock) {
  if (contacts?.phone) return phoneHref(contacts.phone)
  if (contacts?.telegram) return telegramUrl(contacts.telegram)
  return '#contacts'
}

export default function SiteRenderer({ page, editable = false, onEdit = () => {} }: Props) {
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
          switch (block.type) {
            case 'hero':
              return <Hero key={i} block={block} i={i} ctaHref={ctaLink(contacts)} />
            case 'services':
              return <Services key={i} block={block} i={i} />
            case 'features':
              return <Features key={i} block={block} i={i} />
            case 'contacts':
              if (!block.address && !block.phone && !block.telegram && !block.hours) return null
              return <Contacts key={i} block={block} i={i} />
          }
        })}
      </div>
    </EditContext.Provider>
  )
}