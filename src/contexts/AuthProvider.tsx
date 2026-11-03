
import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import type { LoginRequestDTO, LoginResponseDTO } from '@/services/authService'
import { authService } from '@/services/authService'
import { armazenamentoToken } from '@/services/armazenamentoToken'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [usuario, setUsuario] = useState<LoginResponseDTO | null>(null)

  useEffect(() => {
    const tokenSalvo = armazenamentoToken.obter()
    setToken(tokenSalvo)
  }, [])

  const entrar = async (dados: LoginRequestDTO) => {
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
