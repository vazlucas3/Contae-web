import { http } from './http'
import type {
  MovimentacaoResponse,
  CriarMovimentacaoRequest,
  AtualizarMovimentacaoRequest,
} from '@/types'

export const movimentacaoService = {
  async listar(): Promise<MovimentacaoResponse[]> {
    return http.get<MovimentacaoResponse[]>('/movimentacoes')
  },

  async criar(dados: CriarMovimentacaoRequest): Promise<MovimentacaoResponse> {
    return http.post<MovimentacaoResponse>('/movimentacoes', dados)
  },

  async atualizar(id: number, dados: AtualizarMovimentacaoRequest): Promise<MovimentacaoResponse> {
    return http.put<MovimentacaoResponse>(`/movimentacoes/${id}`, dados)
  },

  async excluir(id: number): Promise<void> {
    return http.delete<void>(`/movimentacoes/${id}`)
  },
}