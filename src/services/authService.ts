
import { http } from './http'

export interface LoginRequestDTO {
  email: string
  senha: string
}

export interface LoginResponseDTO {
  token: string
  tipo: string
}

export const authService = {
  async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    return http.post<LoginResponseDTO>(
      '/api/auth/login',
      credentials,
      false
    )
  },
}
