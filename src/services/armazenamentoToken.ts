/* ------------------------------------------------------------------
 * Armazenamento do token JWT no localStorage.
 * Concentrado aqui para que o restante do código não conheça a chave.
 * Todas as leituras/escritas ficam em try/catch (localStorage pode falhar).
 * ------------------------------------------------------------------ */
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
      /* sem armazenamento disponível: a sessão vale só até recarregar */
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
