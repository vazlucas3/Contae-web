/* Contratos de usuário — espelham UsuarioRequestDTO / UsuarioResponseDTO. */

export interface UsuarioRequest {
  nome: string
  email: string
  /** Mínimo de 6 caracteres (validado pela API). */
  senha: string
}

export interface UsuarioResponse {
  id: number
  nome: string
  email: string
  /** Data/hora ISO-8601. */
  dataCriacao: string
  ativo: boolean
}
