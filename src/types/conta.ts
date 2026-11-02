/* Contratos de conta — espelham ContaRequestDTO / ContaResponseDTO e o enum TipoConta. */

export type TipoConta = 'CORRENTE' | 'POUPANCA' | 'CARTEIRA'

export interface ContaRequest {
  nome: string
  tipo: TipoConta
  /** Não pode ser negativo (validado pela API). */
  saldo: number
}

export interface ContaResponse {
  id: number
  nome: string
  tipo: TipoConta
  saldo: number
  usuarioId: number
}
