import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import type { LoginRequest, LoginResponse } from '@/types'
import { authService } from '@/services/authService'
import { armazenamentoToken } from '@/services/armazenamentoToken'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => armazenamentoToken.obter())
  const [usuario, setUsuario] = useState<LoginResponse | null>(null)

  const entrar = async (dados: LoginRequest) => {
    const resposta = await authService.login(dados)

    armazenamentoToken.salvar(resposta.token)

    setToken(resposta.token)
    setUsuario(null)
  }

  const sair = () => {
    armazenamentoToken.remover()
    localStorage.removeItem('usuario_logado')

    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider
      value={{
        autenticado: !!token,
        entrar,
        sair,
        usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
