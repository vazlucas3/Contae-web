import type { MovimentacaoDto } from '@/types/movimentacao'
import { corDaCategoria, formatarData, formatarValor } from '@/types/formatadores'
import type { MovimentacaoComIds, OpcaoCategoria } from '../../types/tipos'
import { Icone, cx, estilos } from './ui'

interface Props {
  itens: MovimentacaoDto[]
  totalItens: number
  carregando: boolean
  pagina: number
  totalPaginas: number
  inicio: number
  categorias: OpcaoCategoria[]
  temFiltros: boolean
  onPagina: (pagina: number) => void
  onEditar: (item: MovimentacaoDto) => void
  onExcluir: (item: MovimentacaoDto) => void
  onLimparFiltros: () => void
  onNova: () => void
}

const th = 'whitespace-nowrap border-y border-[#E3EAEC] bg-[#F7FAFB] px-4 py-2.5 text-left font-semibold text-[#6B7C79] first:pl-6 last:pr-6'
const td = 'whitespace-nowrap border-b border-[#E3EAEC] px-4 py-3 align-middle first:pl-6 last:pr-6'

export function TabelaMovimentacoes(props: Props) {
  const { itens, totalItens, carregando, categorias } = props
  const primeiraCarga = carregando && totalItens === 0
  const vazio = !carregando && totalItens === 0

  return (
    <section aria-labelledby="titulo-lista" className={estilos.card}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="titulo-lista" className={estilos.tituloCard}>Suas movimentações</h2>
        <span aria-live="polite" className="text-[13px] text-[#6B7C79]">
          {carregando ? 'Carregando...' : `${totalItens} ${totalItens === 1 ? 'movimentação' : 'movimentações'}`}
        </span>
      </div>

      {primeiraCarga && <Carregando />}

      {vazio && (
        <EstadoVazio temFiltros={props.temFiltros} onLimparFiltros={props.onLimparFiltros} onNova={props.onNova} />
      )}

      {totalItens > 0 && (
        <>
          <div className={cx('-mx-4 overflow-x-auto transition-opacity sm:-mx-6', carregando && 'opacity-60')}>
            <table className="w-full min-w-[760px] border-collapse text-[13px] text-[#0B2E2A]">
              <thead>
                <tr>
                  <th scope="col" className={th}>Data</th>
                  <th scope="col" className={th}>Descrição</th>
                  <th scope="col" className={th}>Categoria</th>
                  <th scope="col" className={th}>Conta</th>
                  <th scope="col" className={th}>Tipo</th>
                  <th scope="col" className={cx(th, 'text-right')}>Valor</th>
                  <th scope="col" className={cx(th, 'text-right')}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <Linha
                    key={item.id}
                    item={item}
                    categorias={categorias}
                    onEditar={props.onEditar}
                    onExcluir={props.onExcluir}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <Paginacao
            pagina={props.pagina}
            totalPaginas={props.totalPaginas}
            inicio={props.inicio}
            naPagina={itens.length}
            total={totalItens}
            onPagina={props.onPagina}
          />
        </>
      )}
    </section>
  )
}

/* ---------- Linha ---------- */
interface LinhaProps {
  item: MovimentacaoDto
  categorias: OpcaoCategoria[]
  onEditar: (item: MovimentacaoDto) => void
  onExcluir: (item: MovimentacaoDto) => void
}

function Linha({ item, categorias, onEditar, onExcluir }: LinhaProps) {
  const mov = item as MovimentacaoComIds
  const receita = mov.tipoMovimentacao === 'RECEITA'
  const categoria = categorias.find((c) => c.id === mov.categoriaId || c.nome === mov.nomeCategoria)

  return (
    <tr className="transition-colors hover:bg-[#FAFCFC]">
      <td className={cx(td, 'tabular-nums text-[#6B7C79]')}>{formatarData(mov.data)}</td>
      <td className={cx(td, 'font-medium')}>{mov.descricao}</td>
      <td className={td}>
        <span className="inline-flex items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: corDaCategoria(categoria?.cor) }}
          />
          {mov.nomeCategoria ?? categoria?.nome ?? '—'}
        </span>
      </td>
      <td className={td}>{mov.nomeConta ?? '—'}</td>
      <td className={td}>
        <span
          className={cx(
            'inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold',
            receita ? 'bg-[#E7F5EF] text-[#0E8A5F]' : 'bg-[#FDECEC] text-[#C42B2E]',
          )}
        >
          {receita ? 'Receita' : 'Despesa'}
        </span>
      </td>
      <td className={cx(td, 'text-right font-semibold tabular-nums', receita ? 'text-[#0E8A5F]' : 'text-[#E5383B]')}>
        {formatarValor(mov.valor, mov.tipoMovimentacao)}
      </td>
      <td className={cx(td, 'w-px text-right')}>
        <div className="inline-flex gap-1">
          <button
            type="button"
            onClick={() => onEditar(item)}
            aria-label={`Editar ${mov.descricao}`}
            title="Editar"
            className={cx(estilos.botaoIcone, 'text-[#0E8A5F] hover:bg-[#E7F5EF]')}
          >
            <Icone nome="lapis" />
          </button>
          <button
            type="button"
            onClick={() => onExcluir(item)}
            aria-label={`Excluir ${mov.descricao}`}
            title="Excluir"
            className={cx(estilos.botaoIcone, 'text-[#E5383B] hover:bg-[#FDECEC]')}
          >
            <Icone nome="lixeira" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function Carregando() {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-[#6B7C79]" role="status">
      <span className="size-5 animate-spin rounded-full border-2 border-[#E3EAEC] border-t-[#0E8A5F] motion-reduce:animate-none" />
      Carregando movimentações...
    </div>
  )
}

interface EstadoVazioProps {
  temFiltros: boolean
  onLimparFiltros: () => void
  onNova: () => void
}

function EstadoVazio({ temFiltros, onLimparFiltros, onNova }: EstadoVazioProps) {
  return (
    <div className="px-4 pb-6 pt-10 text-center text-[#6B7C79]">
      <span className="mb-3 inline-grid size-12 place-items-center rounded-xl bg-[#F4F8FA]">
        <Icone nome="caixa" className="size-[22px]" />
      </span>
      <h3 className="mb-1 text-[15px] font-semibold text-[#0B2E2A]">
        {temFiltros ? 'Nenhuma movimentação encontrada' : 'Nenhuma movimentação ainda'}
      </h3>
      <p className="mb-4">
        {temFiltros
          ? 'Nenhum resultado para esses filtros. Ajuste a busca ou limpe os filtros.'
          : 'Registre sua primeira receita ou despesa para começar.'}
      </p>
      <button
        type="button"
        onClick={temFiltros ? onLimparFiltros : onNova}
        className={estilos.botaoSecundario}
      >
        {temFiltros ? 'Limpar filtros' : 'Nova movimentação'}
      </button>
    </div>
  )
}

interface PaginacaoProps {
  pagina: number
  totalPaginas: number
  inicio: number
  naPagina: number
  total: number
  onPagina: (pagina: number) => void
}


function paginasVisiveis(atual: number, total: number): Array<number | '…'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const lista: Array<number | '…'> = [1]
  if (atual > 3) lista.push('…')
  for (let p = Math.max(2, atual - 1); p <= Math.min(total - 1, atual + 1); p++) lista.push(p)
  if (atual < total - 2) lista.push('…')
  lista.push(total)
  return lista
}

const botaoPagina = cx(
  'inline-grid h-8 min-w-8 place-items-center rounded-md border border-[#E3EAEC] bg-white px-2 text-[13px] font-semibold',
  'transition-colors enabled:hover:border-[#0E8A5F] enabled:hover:text-[#0E8A5F] disabled:cursor-not-allowed disabled:opacity-40',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E8A5F]',
)

function Paginacao({ pagina, totalPaginas, inicio, naPagina, total, onPagina }: PaginacaoProps) {
  return (
    <nav aria-label="Paginação" className="flex flex-wrap items-center justify-between gap-4 pt-4">
      <span className="text-[13px] text-[#6B7C79]">
        Mostrando {inicio + 1}–{inicio + naPagina} de {total}
      </span>

      {totalPaginas > 1 && (
        <div className="flex gap-1.5">
          <button
            type="button"
            className={botaoPagina}
            onClick={() => onPagina(pagina - 1)}
            disabled={pagina === 1}
            aria-label="Página anterior"
          >
            <Icone nome="anterior" className="size-4" />
          </button>

          {paginasVisiveis(pagina, totalPaginas).map((p, i) =>
            p === '…' ? (
              <span key={`r${i}`} className="grid h-8 place-items-center px-1 text-[#6B7C79]">…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPagina(p)}
                aria-label={`Página ${p}`}
                aria-current={p === pagina ? 'page' : undefined}
                className={cx(
                  botaoPagina,
                  p === pagina && 'border-[#0E8A5F] bg-[#0E8A5F] text-white enabled:hover:text-white',
                )}
              >
                {p}
              </button>
            ),
          )}

          <button
            type="button"
            className={botaoPagina}
            onClick={() => onPagina(pagina + 1)}
            disabled={pagina === totalPaginas}
            aria-label="Próxima página"
          >
            <Icone nome="proxima" className="size-4" />
          </button>
        </div>
      )}
    </nav>
  )
}
