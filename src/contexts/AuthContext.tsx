import React, { createContext, useContext, useState, useEffect } from 'react'
import { configurarSessaoHttp } from '@/services/http'

export interface AuthContextValor {
  autenticado: boolean
  entrar: (token: string) => void
  sair: () => void
}

export const AuthContext = createContext<AuthContextValor | null>(null)

// Chave usada para salvar o token no localStorage
const CHAVE_TOKEN = '@contae:token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Inicializa o token buscando do localStorage (se houver)
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(CHAVE_TOKEN)
  })

  const entrar = (novoToken: string) => {
    localStorage.setItem(CHAVE_TOKEN, novoToken)
    setToken(novoToken)
  }

  const sair = () => {
    localStorage.removeItem(CHAVE_TOKEN)
    setToken(null)
  }

  // ------------------------------------------------------------------
  // PASSO 5: Integração do token e do logout automático com o Axios
  // ------------------------------------------------------------------
  useEffect(() => {
    configurarSessaoHttp({
      obterToken: () => token,
      aoExpirarSessao: sair,
    })
  }, [token])

  const valor: AuthContextValor = {
    autenticado: !!token,
    entrar,
    sair,
  }

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para facilitar o uso do contexto nas telas
export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return contexto
}