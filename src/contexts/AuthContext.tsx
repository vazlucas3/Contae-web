import { createContext } from 'react'
import type { LoginRequestDTO, LoginResponseDTO } from '@/services/authService'

export interface AuthContextValor {
  autenticado: boolean
  entrar: (dados: LoginRequestDTO) => Promise<void>
  sair: () => void
  usuario: LoginResponseDTO | null
}

export const AuthContext = createContext<AuthContextValor | null>(null)
