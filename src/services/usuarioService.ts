import type { UsuarioRequest, UsuarioResponse } from '@/types'
import { http } from './http'

export const usuarioService = {
  cadastrar: (dados: UsuarioRequest) => http.post<UsuarioResponse>('/api/usuarios', dados, false),
  listarTodos: () => http.get<UsuarioResponse[]>('/api/usuarios'),
  buscarPorId: (id: number) => http.get<UsuarioResponse>(`/api/usuarios/${id}`),
  atualizar: (id: number, dados: UsuarioRequest) =>
    http.put<UsuarioResponse>(`/api/usuarios/${id}`, dados),
  inativar: (id: number) => http.patch<void>(`/api/usuarios/${id}/inativar`),
  excluir: (id: number) => http.delete(`/api/usuarios/${id}`),
}
