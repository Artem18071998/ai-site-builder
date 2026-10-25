export type HeroBlock = {
  type: 'hero'
  title: string
  subtitle: string
  cta: string
}

export type ServicesBlock = {
  type: 'services'
  title: string
  items: { name: string; price: string; description?: string }[]
}

export type FeaturesBlock = {
  type: 'features'
  title: string
  items: { title: string; text: string }[]
}

export type ContactsBlock = {
  type: 'contacts'
  title: string
  address: string
  phone: string
  hours: string
}

export type Block = HeroBlock | ServicesBlock | FeaturesBlock | ContactsBlock

export type SitePage = {
  businessName: string
  accent: string // цвет в формате #rrggbb
  blocks: Block[]
}