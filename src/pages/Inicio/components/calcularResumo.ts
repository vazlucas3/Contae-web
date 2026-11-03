// src/pages/Inicio/calcularResumo.ts
import type { ContaResponse, MovimentacaoResponse } from '@/types'

/* ------------------------------------------------------------------
* calcularResumo — contas da tela Início (funções puras, sem React).
* Para mudar uma regra de cálculo, mexa só neste arquivo.
* ------------------------------------------------------------------ */

export type TipoMovimentacaoSoma = 'RECEITA' | 'DESPESA'

/* Um dia do gráfico: data, rótulo curto e os totais do dia. */
export interface DiaResumo {
data: string // "aaaa-mm-dd"
rotulo: string // "dd/mm"
receitas: number
despesas: number
}

/* Date -> "aaaa-mm-dd" usando o dia LOCAL (toISOString usaria UTC e poderia errar o dia). */
function paraIso(data: Date): string {
const mes = String(data.getMonth() + 1).padStart(2, '0')
const dia = String(data.getDate()).padStart(2, '0')
return `${data.getFullYear()}-${mes}-${dia}`
}

/* Mantém só as movimentações do mês atual.
* A data vem como "aaaa-mm-dd", então comparamos o começo do texto: "2026-10". */
export function doMesAtual(movimentacoes: MovimentacaoResponse[]): MovimentacaoResponse[] {
const prefixo = paraIso(new Date()).slice(0, 7)
return movimentacoes.filter((movimentacao) => movimentacao.data.startsWith(prefixo))
}

/* Soma os valores de um tipo (RECEITA ou DESPESA). */
export function somarPorTipo(
movimentacoes: MovimentacaoResponse[],
tipo: TipoMovimentacaoSoma,
): number {
return movimentacoes
.filter((movimentacao) => movimentacao.tipoMovimentacao === tipo)
.reduce((total, movimentacao) => total + movimentacao.valor, 0)
}

/* Soma o saldo cadastrado em todas as contas. */
export function somarSaldoContas(contas: ContaResponse[]): number {
return contas.reduce((total, conta) => total + conta.saldo, 0)
}

/* As N movimentações mais recentes (data mais nova primeiro). */
export function ultimasMovimentacoes(
movimentacoes: MovimentacaoResponse[],
quantidade: number,
): MovimentacaoResponse[] {
return [...movimentacoes]
.sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id)
.slice(0, quantidade)
}

/* Totais de receitas e despesas dos últimos N dias (inclui hoje), do mais antigo ao mais novo. */
export function ultimosDias(movimentacoes: MovimentacaoResponse[], quantidade: number): DiaResumo[] {
const dias: DiaResumo[] = []

for (let atras = quantidade - 1; atras >= 0; atras--) {
const dia = new Date()
dia.setDate(dia.getDate() - atras)
const data = paraIso(dia)
const doDia = movimentacoes.filter((movimentacao) => movimentacao.data.slice(0, 10) === data)

dias.push({
    data,
    rotulo: `${data.slice(8, 10)}/${data.slice(5, 7)}`,
    receitas: somarPorTipo(doDia, 'RECEITA'),
    despesas: somarPorTipo(doDia, 'DESPESA'),
})
}

return dias
}