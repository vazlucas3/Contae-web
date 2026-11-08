
export const env = {
  apiUrl: (import.meta.env.DEV ? '/backend' : (import.meta.env.VITE_API_URL ?? '')).replace(
    /\/$/,
    '',
  ),

  exigirLogin: import.meta.env.VITE_EXIGIR_LOGIN !== 'false',
} as const