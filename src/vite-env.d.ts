/// <reference types="vite/client" />

// Tipagem das variáveis de ambiente (declare aqui toda nova VITE_*).
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_EXIGIR_LOGIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
