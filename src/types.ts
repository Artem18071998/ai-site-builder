import { z } from 'zod'

export const SITE_LANGS = ['en', 'uk', 'ru', 'es', 'de', 'fr', 'pl', 'pt'] as const
export type SiteLang = (typeof SITE_LANGS)[number]

const heroSchema = z.object({
  type: z.literal('hero'),
    hidden: z.boolean().optional(),
  title: z.string().min(1),
  subtitle: z.string(),
  cta: z.string(),
})

const servicesSchema = z.object({
  type: z.literal('services'),
    hidden: z.boolean().optional(),
  title: z.string(),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.string().nullish(),
        description: z.string().nullish(),
      }),
    )
    .min(1)
    .max(8),
})

const featuresSchema = z.object({
  type: z.literal('features'),
    hidden: z.boolean().optional(),
  title: z.string(),
  items: z.array(z.object({ title: z.string(), text: z.string() })).min(1).max(6),
})

const contactsSchema = z.object({
  type: z.literal('contacts'),
    hidden: z.boolean().optional(),
  title: z.string(),
  address: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  whatsapp: z.string().nullish(),
  telegram: z.string().nullish(),
  instagram: z.string().nullish(),
  hours: z.string().nullish(),
})

export const blockSchema = z.discriminatedUnion('type', [
  heroSchema,
  servicesSchema,
  featuresSchema,
  contactsSchema,
])

export const sitePageSchema = z.object({
  businessName: z.string().min(1),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).catch('#2563eb'),
  theme: z.enum(['modern', 'warm', 'dark']).catch('modern'),
  lang: z.enum(SITE_LANGS).catch('en'),
  blocks: z.array(blockSchema).min(1).max(8),
})

export const businessInputSchema = z.object({
  description: z.string().trim().min(10).max(1500),
  name: z.string().trim().max(80).default(''),
  city: z.string().trim().max(60).default(''),
  phone: z.string().trim().max(30).default(''),
  email: z.string().trim().max(120).default(''),
  whatsapp: z.string().trim().max(40).default(''),
  telegram: z.string().trim().max(60).default(''),
  instagram: z.string().trim().max(60).default(''),
  address: z.string().trim().max(120).default(''),
  hours: z.string().trim().max(60).default(''),
  language: z.enum(SITE_LANGS).catch('en'),
  services: z
    .array(
      z.object({
        name: z.string().trim().max(80),
        price: z.string().trim().max(40).default(''),
      }),
    )
    .max(8)
    .default([]),
})

export type HeroBlock = z.infer<typeof heroSchema>
export type ServicesBlock = z.infer<typeof servicesSchema>
export type FeaturesBlock = z.infer<typeof featuresSchema>
export type ContactsBlock = z.infer<typeof contactsSchema>
export type Block = z.infer<typeof blockSchema>
export type SitePage = z.infer<typeof sitePageSchema>
export type BusinessInput = z.infer<typeof businessInputSchema>