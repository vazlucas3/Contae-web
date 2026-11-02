import type { CategoriaRequest, CategoriaResponse } from '@/types'
import { http } from './http'

/* Categorias — /categorias (a API não possui endpoint de edição). */
export const categoriaService = {
  listar: () => http.get<CategoriaResponse[]>('/categorias'),
  buscarPorId: (id: number) => http.get<CategoriaResponse>(`/categorias/${id}`),
  salvar: (dados: CategoriaRequest) => http.post<CategoriaResponse>('/categorias', dados),
  excluir: (id: number) => http.delete(`/categorias/${id}`),
}
