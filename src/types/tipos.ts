import type { MovimentacaoDto, TipoMovimentacao } from '@/types/movimentacao'

// Formato mínimo que a tela precisa das contas e categorias.
// Se seus DTOs tiverem esses campos com outro nome, ajuste aqui.
export interface OpcaoConta {
  id: number
  nome: string
}

export interface OpcaoCategoria {
  id: number
  nome: string
  tipo?: TipoMovimentacao
  cor?: string | null
}

// Campos que o backend pode devolver junto da movimentação
export type MovimentacaoComIds = MovimentacaoDto & {
  contaId?: number
  categoriaId?: number
  contaNome?: string
  categoriaNome?: string
}

// Corpo enviado para criar/atualizar (mesmo formato do seu código antigo)
export interface DadosMovimentacao {
  descricao: string
  valor: number
  tipo: TipoMovimentacao
  data: string
  contaId: number
  categoriaId: number
}

export interface Filtros {
  busca: string
  tipo: '' | TipoMovimentacao
  contaId: string
  categoriaId: string
  dataInicio: string
  dataFim: string
}

export const FILTROS_INICIAIS: Filtros = {
  busca: '',
  tipo: '',
  contaId: '',
  categoriaId: '',
  dataInicio: '',
  dataFim: '',
}
