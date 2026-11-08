
import type { ContaResponse, MovimentacaoResponse } from '@/types'


export type TipoMovimentacaoSoma = 'RECEITA' | 'DESPESA'


export interface DiaResumo {
data: string 
rotulo: string 
receitas: number
despesas: number
}


function paraIso(data: Date): string {
const mes = String(data.getMonth() + 1).padStart(2, '0')
const dia = String(data.getDate()).padStart(2, '0')
return `${data.getFullYear()}-${mes}-${dia}`
}


export function doMesAtual(movimentacoes: MovimentacaoResponse[]): MovimentacaoResponse[] {
const prefixo = paraIso(new Date()).slice(0, 7)
return movimentacoes.filter((movimentacao) => movimentacao.data.startsWith(prefixo))
}


export function somarPorTipo(
movimentacoes: MovimentacaoResponse[],
tipo: TipoMovimentacaoSoma,
): number {
return movimentacoes
.filter((movimentacao) => movimentacao.tipoMovimentacao === tipo)
.reduce((total, movimentacao) => total + movimentacao.valor, 0)
}


export function somarSaldoContas(contas: ContaResponse[]): number {
return contas.reduce((total, conta) => total + conta.saldo, 0)
}

export function ultimasMovimentacoes(
movimentacoes: MovimentacaoResponse[],
quantidade: number,
): MovimentacaoResponse[] {
return [...movimentacoes]
.sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id)
.slice(0, quantidade)
}

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