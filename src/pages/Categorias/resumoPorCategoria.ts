import type { MovimentacaoResponse } from '@/types'

export interface ResumoCategoria {
quantidade: number
total: number
}

/* Devolve um objeto no formato { [idDaCategoria]: { quantidade, total } }. */
export function resumirPorCategoria(movimentacoes: MovimentacaoResponse[]): Record<number, ResumoCategoria> {
const resumo: Record<number, ResumoCategoria> = {}

for (const movimentacao of movimentacoes) {
const atual = resumo[movimentacao.categoriaId] ?? { quantidade: 0, total: 0 }
const sinal = movimentacao.tipoMovimentacao === 'RECEITA' ? 1 : -1

resumo[movimentacao.categoriaId] = {
    quantidade: atual.quantidade + 1,
    total: atual.total + sinal * movimentacao.valor,
}
}

return resumo
}