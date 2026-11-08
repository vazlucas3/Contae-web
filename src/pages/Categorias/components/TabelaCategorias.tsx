import { Icone } from '@/components/common'
import { formatarMoeda } from '@/utils/formatadores'
import type { CategoriaResponse } from '@/types'
import type { ResumoCategoria } from '../resumoPorCategoria'
import estilos from './TabelaCategorias.module.css'

interface TabelaCategoriasProps {
categorias: CategoriaResponse[]
/** Resumo por id de categoria; null quando não foi possível carregar as movimentações. */
resumo: Record<number, ResumoCategoria> | null
/** Chamado quando o usuário pede para excluir (a confirmação é feita aqui). */
aoExcluir: (categoria: CategoriaResponse) => void
}

/* Texto e cor do total: "+ R$ 10,00" (verde), "− R$ 10,00" (vermelho) ou "R$ 0,00". */
function mostrarTotal(total: number) {
if (total === 0) return <span>{formatarMoeda(0)}</span>
const positivo = total > 0
return (
<span className={positivo ? estilos.positivo : estilos.negativo}>
    {positivo ? '+' : '−'} {formatarMoeda(Math.abs(total))}
</span>
)
}

export function TabelaCategorias({ categorias, resumo, aoExcluir }: TabelaCategoriasProps) {
return (
<div className={estilos.envoltorio}>
    <table className={estilos.tabela}>
    <thead>
        <tr>
        <th scope="col">Nome</th>
        <th scope="col" className={estilos.colunaNumero}>
            Movimentações
        </th>
        <th scope="col" className={estilos.colunaNumero}>
            Total
        </th>
        <th scope="col" className={estilos.colunaAcoes}>
            Ações
        </th>
        </tr>
    </thead>
    <tbody>
        {categorias.map((categoria) => {
        // Categoria sem movimentações: 0 e R$ 0,00.
        const dados = resumo ? (resumo[categoria.id] ?? { quantidade: 0, total: 0 }) : null

        return (
            <tr key={categoria.id}>
            <td>{categoria.nome}</td>
            <td className={estilos.colunaNumero}>{dados ? dados.quantidade : '—'}</td>
            <td className={estilos.colunaNumero}>{dados ? mostrarTotal(dados.total) : '—'}</td>
            <td className={estilos.colunaAcoes}>
                <button
                type="button"
                className={estilos.botaoExcluir}
                onClick={() => aoExcluir(categoria)}
                aria-label={`Excluir categoria ${categoria.nome}`}
                >
                <Icone nome="lixeira" tamanho={18} />
                </button>
            </td>
            </tr>
        )
        })}
    </tbody>
    </table>
</div>
)
}