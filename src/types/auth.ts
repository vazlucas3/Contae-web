/* Contratos de autenticação — espelham LoginRequestDTO / LoginResponseDTO. */

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
  /** Sempre "Bearer". */
  tipo: string
}
