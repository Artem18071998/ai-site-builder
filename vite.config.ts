import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// ...ваш импорт react-плагина остаётся как есть
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
        if (req.method !== 'POST') return send(405, { error: 'Метод не поддерживается' })
        if (!env.GEMINI_API_KEY) return send(500, { error: 'На сервере не задан GEMINI_API_KEY' })

        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const { description } = JSON.parse(Buffer.concat(chunks).toString() || '{}')
          const page = await generateSite(
            String(description ?? ''),
            env.GEMINI_API_KEY,
            env.GEMINI_MODEL || 'gemini-flash-latest',
          )
          send(200, page)
        } catch (e) {
          if (e instanceof GenerationError) return send(e.status, { error: e.message })
          console.error(e)
          send(500, { error: 'Внутренняя ошибка сервера' })
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