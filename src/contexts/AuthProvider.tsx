import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { armazenamentoToken, EVENTO_NAO_AUTORIZADO } from '@/services'
import { AuthContext, type AuthContextValor } from './AuthContext'

/* ------------------------------------------------------------------
 * AuthProvider
 * Mantém apenas o ESTADO DA SESSÃO (token). A tela de login e a validação
 * de formulário NÃO ficam aqui: pertencem à página de Login.
 * ------------------------------------------------------------------ */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => armazenamentoToken.obter())

  const entrar = useCallback((novoToken: string) => {
    armazenamentoToken.salvar(novoToken)
    setToken(novoToken)
  }, [])

  const sair = useCallback(() => {
    armazenamentoToken.remover()
    setToken(null)
  }, [])

  // Se a API recusar o token (expirado/inválido), encerra a sessão.
  useEffect(() => {
    window.addEventListener(EVENTO_NAO_AUTORIZADO, sair)
    return () => window.removeEventListener(EVENTO_NAO_AUTORIZADO, sair)
  }, [sair])

  const valor = useMemo<AuthContextValor>(
    () => ({ autenticado: token !== null, entrar, sair }),
    [token, entrar, sair],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
