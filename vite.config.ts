import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

/* ------------------------------------------------------------------
 * Configuração do Vite
 *
 * - Alias "@" aponta para a pasta "src" (ex.: import x from '@/utils/...').
 * - Proxy de desenvolvimento: a contae-api NÃO possui CORS configurado,
 *   então, em dev, o navegador chama "/backend/..." no próprio Vite e ele
 *   repassa para a API (removendo o prefixo "/backend").
 *   Usamos um prefixo porque as rotas da API ("/contas", "/categorias")
 *   colidem com as rotas das telas do frontend.
 * ------------------------------------------------------------------ */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const alvoApi = env.VITE_API_PROXY_TARGET || env.VITE_API_URL || 'http://localhost:8080'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/backend': {
          target: alvoApi,
          changeOrigin: true,
          rewrite: (caminho) => caminho.replace(/^\/backend/, ''),
        },
      },
    },
  }
})
