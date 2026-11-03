/* ------------------------------------------------------------------
 * Variáveis de ambiente
 * Único ponto do projeto que lê "import.meta.env". O restante do código
 * importa "env" daqui, o que facilita trocar valores e testar.
 * ------------------------------------------------------------------ */
export const env = {
  /** URL base da API. Em dev sempre usa o proxy do Vite para evitar CORS. */
  apiUrl: (import.meta.env.DEV ? '/backend' : (import.meta.env.VITE_API_URL ?? '')).replace(
    /\/$/,
    '',
  ),

  /** Quando "true", as telas internas exigem token de login. */
  exigirLogin: import.meta.env.VITE_EXIGIR_LOGIN === 'true',
} as const
