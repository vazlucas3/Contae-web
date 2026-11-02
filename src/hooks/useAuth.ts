import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

/** Acesso ao estado da sessão: const { autenticado, entrar, sair } = useAuth() */
export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>.')
  }
  return contexto
}
