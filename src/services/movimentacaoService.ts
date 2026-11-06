import { http } from './http'
import type { 
  MovimentacaoDto, 
  CriarMovimentacaoRequest, 
  AtualizarMovimentacaoRequest,
  FiltrosMovimentacao 
} from '@/types'

export const movimentacaoService = {
  async listar(filtros?: FiltrosMovimentacao): Promise<MovimentacaoDto[]> {
    const params = new URLSearchParams()
    if (filtros) {
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio)
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim)
      if (filtros.categoriaId) params.append('categoriaId', String(filtros.categoriaId))
      if (filtros.contaId) params.append('contaId', String(filtros.contaId))
      if (filtros.tipo) params.append('tipo', filtros.tipo)
      if (filtros.busca) params.append('busca', filtros.busca)
    }

    const query = params.toString()
    const url = `/api/movimentacoes${query ? `?${query}` : ''}`
    return http.get<MovimentacaoDto[]>(url)
  },

  async criar(dados: CriarMovimentacaoRequest): Promise<MovimentacaoDto> {
    return http.post<MovimentacaoDto>('/api/movimentacoes', dados)
  },

  async atualizar(id: number, dados: AtualizarMovimentacaoRequest): Promise<MovimentacaoDto> {
    return http.put<MovimentacaoDto>(`/api/movimentacoes/${id}`, dados)
  },

  async excluir(id: number): Promise<void> {
    return http.delete<void>(`/api/movimentacoes/${id}`)
  }
}