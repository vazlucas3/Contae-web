import { createContext } from 'react'
import type { LoginRequestDTO, LoginResponseDTO } from '@/services/authService'

/* Contrato do contexto de autenticação (o que as telas podem usar). */
export interface AuthContextValor {
  /** true quando existe um token salvo. */
  autenticado: boolean
  /** Guarda o token recebido no login. */
  entrar: (dados: LoginRequestDTO) => Promise<void>
  /** Remove o token (logout). */
  sair: () => void
  /** Dados retornados pela API no login, quando disponíveis. */
  usuario: LoginResponseDTO | null
}

export const AuthContext = createContext<AuthContextValor | null>(null)
