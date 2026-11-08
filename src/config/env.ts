/* ------------------------------------------------------------------
- Variáveis de ambiente
- Único ponto do projeto que lê "import.meta.env". O restante do código
- importa "env" daqui, o que facilita trocar valores e testar.
- ------------------------------------------------------------------ */

export const env = {
  /** URL base da API. Em produção, VITE_API_URL não deve terminar em /api. */
  apiUrl: (import.meta.env.DEV ? '/backend' : (import.meta.env.VITE_API_URL ?? '')).replace(
    /\/$/,
    '',
  ),

  /** Quando diferente de "false", as telas internas exigem token de login. */
  exigirLogin: import.meta.env.VITE_EXIGIR_LOGIN !== 'false',


} as const
