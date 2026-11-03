import { Icone } from '@/components/common'
import type { CategoriaResponse } from '@/types'
import estilos from './TabelaCategorias.module.css'

interface TabelaCategoriasProps {
categorias: CategoriaResponse[]
/** Chamado quando o usuário pede para excluir (a confirmação é feita na página). */
aoExcluir: (categoria: CategoriaResponse) => void
}

export function TabelaCategorias({ categorias, aoExcluir }: TabelaCategoriasProps) {
return (
<div className={estilos.envoltorio}>
    <table className={estilos.tabela}>
    <thead>
        <tr>
        <th scope="col">Nome</th>
        <th scope="col" className={estilos.colunaAcoes}>Ações</th>
        </tr>
    </thead>
    <tbody>
        {categorias.map((categoria) => (
        <tr key={categoria.id}>
            <td>{categoria.nome}</td>
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
        ))}
    </tbody>
    </table>
</div>
)
}