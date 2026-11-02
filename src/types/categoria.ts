/* Contratos de categoria — espelham CategoriaRequestDTO / CategoriaResponseDTO.
 * ATENÇÃO: a API ainda NÃO possui "tipo" (Receita/Despesa) nem "cor" na categoria,
 * embora o design preveja esses campos. Veja a seção de lacunas no README. */

export interface CategoriaRequest {
  nome: string
}

export interface CategoriaResponse {
  id: number
  nome: string
  usuarioId: number
}
