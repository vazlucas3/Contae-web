import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import type { LoginRequestDTO, LoginResponseDTO } from '@/services/authService'
import { authService } from '@/services/authService'
import { armazenamentoToken } from '@/services/armazenamentoToken'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => armazenamentoToken.obter())
  const [usuario, setUsuario] = useState<LoginResponseDTO | null>(null)

  const entrar = async (dados: LoginRequestDTO) => {
    const resposta = await authService.login(dados)

    armazenamentoToken.salvar(resposta.token)
    setToken(resposta.token)
    setUsuario(resposta)
  }

  const sair = () => {
    armazenamentoToken.remover()
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider
      value={{
        autenticado: Boolean(token),
        entrar,
        sair,
        usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}