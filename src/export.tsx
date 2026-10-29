import { renderToStaticMarkup } from 'react-dom/server'
import SiteRenderer from './components/SiteRenderer'
import type { SitePage } from './types'

function collectCss() {
  return Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n')
      } catch {
        return ''
      }
    })
    .join('\n')
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function buildHtml(page: SitePage) {
  const body = renderToStaticMarkup(<SiteRenderer page={page} />)
  return `<!doctype html>
<html lang="${escapeHtml(page.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(page.businessName)}</title>
<style>${collectCss()}</style>
</head>
<body style="margin:0">${body}</body>
</html>`
}

export function downloadHtml(page: SitePage) {
  const name =
    page.businessName
      .toLowerCase()
      .replace(/[^a-z0-9а-яіїєґ]+/gi, '-')
      .replace(/^-|-$/g, '') || 'site'
  const blob = new Blob([buildHtml(page)], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.html`
  a.click()
  URL.revokeObjectURL(url)
}