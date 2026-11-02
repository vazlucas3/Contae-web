export type TipoMovimentacao = 'RECEITA' | 'DESPESA';

export interface MovimentacaoDto {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoMovimentacao;
  data: string; // Formato YYYY-MM-DD ou ISO
  categoriaId: number;
  categoriaNome?: string;
  contaId: number;
  contaNome?: string;
  recorrente?: boolean;
}

export interface CriarMovimentacaoRequest {
  descricao: string;
  valor: number;
  tipo: TipoMovimentacao;
  data: string;
  categoriaId: number;
  contaId: number;
  recorrente?: boolean;
}

export interface AtualizarMovimentacaoRequest extends CriarMovimentacaoRequest {}

export interface FiltrosMovimentacao {
  dataInicio?: string;
  dataFim?: string;
  categoriaId?: number;
  contaId?: number;
  tipo?: TipoMovimentacao;
  busca?: string;
}