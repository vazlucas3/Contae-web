export type TipoMovimentacao = 'RECEITA' | 'DESPESA'
export type TipoDespesa = 'FIXA' | 'VARIAVEL'

export interface MovimentacaoResponse {
  id: number;
  contaId: number;
  categoriaId: number;
  descricao: string;
  valor: number;
  tipoMovimentacao: TipoMovimentacao;
  tipoDespesa: TipoDespesa | null;
  data: string;
  recorrente: boolean;
  nomeCategoria?: string;
  nomeConta?: string;
  saldoOriginalConta?: number;
  saldoAtualConta?: number;
}

export interface CriarMovimentacaoRequest {
  contaId: number;
  categoriaId: number;
  descricao: string;
  valor: number;
  tipoMovimentacao: TipoMovimentacao;
  tipoDespesa?: TipoDespesa | null;
  data: string;
  recorrente: boolean;
}

export type AtualizarMovimentacaoRequest = CriarMovimentacaoRequest
export type MovimentacaoDto = MovimentacaoResponse

export interface FiltrosMovimentacao {
  dataInicio?: string;
  dataFim?: string;
  categoriaId?: number;
  contaId?: number;
  tipo?: TipoMovimentacao;
  busca?: string;
}