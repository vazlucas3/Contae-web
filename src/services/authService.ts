import type { LoginRequest, LoginResponse } from '@/types'
import { http } from './http'

/* Autenticação — endpoint público da API: POST /api/auth/login */
export const authService = {
  login: (dados: LoginRequest) => http.post<LoginResponse>('/api/auth/login', dados),
}
