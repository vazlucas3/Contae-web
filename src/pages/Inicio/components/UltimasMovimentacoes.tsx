// src/pages/Inicio/components/UltimasMovimentacoes.tsx
import { Link } from 'react-router-dom'
import { Card } from '@/components/common'
import { CAMINHOS } from '@/routes/caminhos'
import { formatarData, formatarMoeda } from '@/utils/formatadores'
import type { CategoriaResponse, ContaResponse, MovimentacaoResponse } from '@/types'
import estilos from './UltimasMovimentacoes.module.css'

/* ------------------------------------------------------------------
* UltimasMovimentacoes — lista curta com o que aconteceu por último.
* Receita aparece em verde (+) e despesa em vermelho (−).
* Mostra o nome da categoria e da conta, procurados pelo id.
* ------------------------------------------------------------------ */
interface UltimasMovimentacoesProps {
movimentacoes: MovimentacaoResponse[]
categorias: CategoriaResponse[]
contas: ContaResponse[]
}

export function UltimasMovimentacoes({ movimentacoes, categorias, contas }: UltimasMovimentacoesProps) {
const nomeCategoria = (id: number) => categorias.find((categoria) => categoria.id === id)?.nome ?? 'Sem categoria'
const nomeConta = (id: number) => contas.find((conta) => conta.id === id)?.nome ?? 'Conta'

return (
<Card>
    <div className={estilos.topo}>
    <h2>Últimas movimentações</h2>
    <Link to={CAMINHOS.movimentacoes}>Ver todas</Link>
    </div>

    {movimentacoes.length === 0 ? (
    <p className={estilos.vazio}>Nenhuma movimentação registrada ainda.</p>
    ) : (
    <ul className={estilos.lista}>
        {movimentacoes.map((movimentacao) => {
        const ehReceita = movimentacao.tipoMovimentacao === 'RECEITA'

        return (
            <li key={movimentacao.id} className={estilos.item}>
            <span className={`${estilos.bolinha} ${ehReceita ? estilos.bolinhaReceita : estilos.bolinhaDespesa}`}>
                {ehReceita ? '↑' : '↓'}
            </span>

            <div className={estilos.texto}>
                <p className={estilos.descricao}>{movimentacao.descricao}</p>
                <p className={estilos.detalhe}>
                {nomeCategoria(movimentacao.categoriaId)} · {nomeConta(movimentacao.contaId)} ·{' '}
                {formatarData(movimentacao.data)}
                </p>
            </div>

            <span className={ehReceita ? estilos.receita : estilos.despesa}>
                {ehReceita ? '+' : '−'} {formatarMoeda(movimentacao.valor)}
            </span>
            </li>
        )
        })}
    </ul>
    )}
</Card>
)
}