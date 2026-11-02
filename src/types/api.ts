/* Contratos genéricos de resposta da API (GlobalExceptionHandler da contae-api). */

/** Corpo devolvido pela API em caso de erro. */
export interface RespostaErroApi {
  timestamp: string
  status: number
  error: string
  message: string
}
