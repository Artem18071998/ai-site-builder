import type { CSSProperties } from 'react'
import type { SitePage } from './types'

export type ThemeName = SitePage['theme']

export const themes: Record<ThemeName, { label: string; vars: Record<string, string> }> = {
  modern: {
    label: 'Светлая',
    vars: {
      '--bg': '#ffffff',
      '--surface': '#f8fafc',
      '--text': '#0f172a',
      '--muted': '#64748b',
      '--border': '#e2e8f0',
      '--radius': '0.75rem',
      '--font': 'ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif',
      '--footer-bg': '#0f172a',
      '--footer-text': '#ffffff',
    },
  },
  warm: {
    label: 'Тёплая',
    vars: {
      '--bg': '#fffaf3',
      '--surface': '#f7efe3',
      '--text': '#3b2f2a',
      '--muted': '#8a7668',
      '--border': '#eadcc8',
      '--radius': '1.25rem',
      '--font': 'Georgia, "Times New Roman", serif',
      '--footer-bg': '#3b2f2a',
      '--footer-text': '#fffaf3',
    },
  },
  dark: {
    label: 'Тёмная',
    vars: {
      '--bg': '#0b0f19',
      '--surface': '#131a2a',
      '--text': '#f1f5f9',
      '--muted': '#94a3b8',
      '--border': '#1f2a40',
      '--radius': '0.5rem',
      '--font': 'ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif',
      '--footer-bg': '#05070d',
      '--footer-text': '#f1f5f9',
    },
  },
}

export function themeStyle(theme: ThemeName) {
  return themes[theme].vars as CSSProperties
}

// Цвет текста на кнопке акцентного цвета: тёмный на светлом фоне и наоборот
export function readableOn(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const r = n >> 16
  const g = (n >> 8) & 255
  const b = n & 255
  return (r * 299 + g * 587 + b * 114) / 1000 > 160 ? '#0f172a' : '#ffffff'
}