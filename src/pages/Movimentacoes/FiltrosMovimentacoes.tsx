import type { TipoMovimentacao } from '@/types/movimentacao'
import type { Filtros, OpcaoCategoria, OpcaoConta } from '../../types/tipos'
import { Icone, Select, SeletorSegmentado, cx, estilos } from './ui'

interface Props {
  filtros: Filtros
  contas: OpcaoConta[]
  categorias: OpcaoCategoria[]
  temFiltros: boolean
  datasInvalidas: boolean
  onChange: (parcial: Partial<Filtros>) => void
  onLimpar: () => void
}

export function FiltrosMovimentacoes({
  filtros, contas, categorias, temFiltros, datasInvalidas, onChange, onLimpar,
}: Props) {
  // Ao trocar o tipo, a categoria escolhida sai se for de outro tipo
  const mudarTipo = (tipo: '' | TipoMovimentacao) => {
    const categoriaAtual = categorias.find((c) => String(c.id) === filtros.categoriaId)
    const categoriaIncompativel = tipo && categoriaAtual?.tipo && categoriaAtual.tipo !== tipo
    onChange({ tipo, categoriaId: categoriaIncompativel ? '' : filtros.categoriaId })
  }

  // A API atual não informa o tipo da categoria; quando não existir, exiba-a em qualquer filtro de tipo.

  return (
    <section aria-labelledby="titulo-filtros" className={estilos.card}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="titulo-filtros" className={estilos.tituloCard}>Filtrar movimentações</h2>
        {temFiltros && (
          <button type="button" onClick={onLimpar} className={estilos.botaoLink}>
            Limpar filtros
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <Icone
          nome="busca"
          className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-[#6B7C79]"
        />
        <label htmlFor="filtro-busca" className="sr-only">Buscar pela descrição</label>
        <input
          id="filtro-busca"
          type="search"
          autoComplete="off"
          placeholder="Buscar descrição..."
          value={filtros.busca}
          onChange={(e) => onChange({ busca: e.target.value })}
          className={cx(estilos.input, 'pl-10')}
        />
      </div>

      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(260px,1.4fr)_repeat(4,minmax(130px,1fr))]">
        <SeletorSegmentado
          nome="filtro-tipo"
          legenda="Tipo"
          valor={filtros.tipo}
          onChange={mudarTipo}
          className="sm:col-span-2 lg:col-span-1"
          opcoes={[
            { valor: '', rotulo: 'Todos' },
            { valor: 'RECEITA', rotulo: 'Receitas', classeAtiva: 'peer-checked:text-[#0E8A5F]' },
            { valor: 'DESPESA', rotulo: 'Despesas', classeAtiva: 'peer-checked:text-[#C42B2E]' },
          ]}
        />

        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="filtro-conta" className={estilos.label}>Conta</label>
          <Select id="filtro-conta" value={filtros.contaId} onChange={(e) => onChange({ contaId: e.target.value })}>
            <option value="">Todas</option>
            {contas.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </Select>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="filtro-categoria" className={estilos.label}>Categoria</label>
          <Select
            id="filtro-categoria"
            value={filtros.categoriaId}
            onChange={(e) => onChange({ categoriaId: e.target.value })}
          >
            <option value="">Todas</option>
            {categorias
              .filter((c) => !filtros.tipo || !c.tipo || c.tipo === filtros.tipo)
              .map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </Select>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="filtro-inicio" className={estilos.label}>Data inicial</label>
          <input
            id="filtro-inicio"
            type="date"
            value={filtros.dataInicio}
            onChange={(e) => onChange({ dataInicio: e.target.value })}
            aria-invalid={datasInvalidas}
            className={estilos.input}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="filtro-fim" className={estilos.label}>Data final</label>
          <input
            id="filtro-fim"
            type="date"
            value={filtros.dataFim}
            min={filtros.dataInicio || undefined}
            onChange={(e) => onChange({ dataFim: e.target.value })}
            aria-invalid={datasInvalidas}
            className={estilos.input}
          />
        </div>
      </div>

      {datasInvalidas && (
        <p role="status" className={cx(estilos.erro, 'mt-3')}>
          A data inicial está depois da data final. Ajuste o período.
        </p>
      )}
    </section>
  )
}
