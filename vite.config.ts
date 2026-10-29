import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { generateSite, GenerationError } from './server/generateSite.ts'

function apiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api/generate', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        const send = (status: number, body: unknown) => {
          res.statusCode = status
          res.end(JSON.stringify(body))
        }
        if (req.method !== 'POST') return send(405, { code: 'BAD_REQUEST', error: 'Method not allowed' })

        const headerKey = req.headers['x-user-api-key']
        const apiKey = (typeof headerKey === 'string' && headerKey.trim()) || env.GEMINI_API_KEY
        if (!apiKey) return send(500, { code: 'NOT_CONFIGURED', error: 'GEMINI_API_KEY is not set' })

        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const body = JSON.parse(Buffer.concat(chunks).toString() || '{}')
          const page = await generateSite(
            body,
            apiKey,
            env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
            env.GEMINI_FALLBACK_MODEL,
          )
          send(200, page)
        } catch (e) {
          if (e instanceof GenerationError) return send(e.status, { code: e.code, error: e.message })
          console.error(e)
          send(500, { code: 'INTERNAL', error: 'Internal server error' })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), apiPlugin(env)],
  }
})