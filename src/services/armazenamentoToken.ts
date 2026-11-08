
const CHAVE_TOKEN = 'contae:token'

export const armazenamentoToken = {
  obter(): string | null {
    try {
      return localStorage.getItem(CHAVE_TOKEN)
    } catch {
      return null
    }
  },

  salvar(token: string): void {
    try {
      localStorage.setItem(CHAVE_TOKEN, token)
    } catch {
      /* sem armazenamento disponível */
    }
  },

  remover(): void {
    try {
      localStorage.removeItem(CHAVE_TOKEN)
    } catch {
      /* nada a fazer */
    }
  },
}
