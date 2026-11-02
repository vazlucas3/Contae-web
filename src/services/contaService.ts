import type { ContaRequest, ContaResponse } from '@/types'
import { http } from './http'

/* Contas — /contas (a API não possui endpoint de edição). */
export const contaService = {
  listar: () => http.get<ContaResponse[]>('/contas'),
  buscarPorId: (id: number) => http.get<ContaResponse>(`/contas/${id}`),
  salvar: (dados: ContaRequest) => http.post<ContaResponse>('/contas', dados),
  excluir: (id: number) => http.delete(`/contas/${id}`),
}
