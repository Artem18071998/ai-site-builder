import type { SitePage } from '../types'
import { Hero, Services, Features, Contacts } from './Blocks'

export default function SiteRenderer({ page }: { page: SitePage }) {
  return (
    <div className="text-slate-900">
      <header className="border-b border-slate-100 px-8 py-4 text-lg font-bold">
        {page.businessName}
      </header>
      {page.blocks.map((block, i) => {
        switch (block.type) {
          case 'hero':
            return <Hero key={i} block={block} accent={page.accent} />
          case 'services':
            return <Services key={i} block={block} accent={page.accent} />
          case 'features':
            return <Features key={i} block={block} accent={page.accent} />
          case 'contacts':
            return <Contacts key={i} block={block} />
        }
      })}
    </div>
  )
}