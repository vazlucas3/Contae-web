import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { movimentacaoService } from '@/services/movimentacaoService'
import { contaService } from '@/services/contaService'
import { categoriaService } from '@/services/categoriaService'
import type { MovimentacaoDto } from '@/types/movimentacao'
import { FiltrosMovimentacoes } from './FiltrosMovimentacoes'
import { TabelaMovimentacoes } from './TabelaMovimentacoes'
import { ModalMovimentacao } from './ModalMovimentacao'
import {
  FILTROS_INICIAIS,
  type DadosMovimentacao,
  type Filtros,
  type OpcaoCategoria,
  type OpcaoConta,
} from '@/types/tipos'
import { Icone, cx, estilos, type NomeIcone } from './ui'
import { formatarData, formatarMoeda, formatarSaldo, mensagemDeErro } from '@/types/formatadores'

const ITENS_POR_PAGINA = 10

function useValorComAtraso<T>(valor: T, atrasoMs: number): T {
  const [atrasado, setAtrasado] = useState(valor)
  useEffect(() => {
    const id = setTimeout(() => setAtrasado(valor), atrasoMs)
    return () => clearTimeout(id)
  }, [valor, atrasoMs])
  return atrasado
}

export function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoDto[]>([])
  const [contas, setContas] = useState<OpcaoConta[]>([])
  const [categorias, setCategorias] = useState<OpcaoCategoria[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS)
  const busca = useValorComAtraso(filtros.busca, 350)
  const [pagina, setPagina] = useState(1)

  const [modalAberto, setModalAberto] = useState(false)
  const [emEdicao, setEmEdicao] = useState<MovimentacaoDto | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const ultimaRequisicao = useRef(0)

  const datasInvalidas = Boolean(filtros.dataInicio && filtros.dataFim && filtros.dataInicio > filtros.dataFim)
  const temFiltros = (Object.keys(FILTROS_INICIAIS) as Array<keyof Filtros>)
    .some((chave) => filtros[chave] !== FILTROS_INICIAIS[chave])

  useEffect(() => {
    Promise.all([contaService.listar(), categoriaService.listar()])
      .then(([listaContas, listaCategorias]) => {
        setContas(listaContas)
        setCategorias(listaCategorias)
      })
      .catch((err) => setErro(mensagemDeErro(err, 'Não foi possível carregar contas e categorias.')))
  }, [])

  const carregarMovimentacoes = useCallback(async () => {
    if (datasInvalidas) return
    const id = ++ultimaRequisicao.current
    setCarregando(true)
    setErro(null)
    try {
      const dados = await movimentacaoService.listar({
        busca: busca.trim() || undefined,
        tipo: filtros.tipo || undefined,
        contaId: filtros.contaId ? Number(filtros.contaId) : undefined,
        categoriaId: filtros.categoriaId ? Number(filtros.categoriaId) : undefined,
        dataInicio: filtros.dataInicio || undefined,
        dataFim: filtros.dataFim || undefined,
      })
      if (id === ultimaRequisicao.current) setMovimentacoes(dados)
    } catch (err) {
      if (id === ultimaRequisicao.current) {
        setErro(mensagemDeErro(err, 'Não foi possível carregar as movimentações.'))
      }
    } finally {
      if (id === ultimaRequisicao.current) setCarregando(false)
    }
  }, [busca, filtros.tipo, filtros.contaId, filtros.categoriaId, filtros.dataInicio, filtros.dataFim, datasInvalidas])

  useEffect(() => {
    let ativo = true
    Promise.resolve().then(() => {
      if (ativo) void carregarMovimentacoes()
    })
    return () => { ativo = false }
  }, [carregarMovimentacoes])


  useEffect(() => {
    if (!aviso) return
    const id = setTimeout(() => setAviso(null), 3500)
    return () => clearTimeout(id)
  }, [aviso])



  const ordenadas = useMemo(
    () => [...movimentacoes].sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id),
    [movimentacoes],
  )

  const totais = useMemo(() => {
    let receitas = 0
    let despesas = 0
    for (const m of movimentacoes) {
      if (m.tipo === 'RECEITA') receitas += m.valor
      else despesas += m.valor
    }
    return { receitas, despesas, saldo: receitas - despesas }
  }, [movimentacoes])

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / ITENS_POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const itensDaPagina = ordenadas.slice(inicio, inicio + ITENS_POR_PAGINA)

 

  const mudarFiltros = (parcial: Partial<Filtros>) => {
    setFiltros((atual) => ({ ...atual, ...parcial }))
    setPagina(1)
  }

  const limparFiltros = () => {
    setFiltros(FILTROS_INICIAIS)
    setPagina(1)
    document.getElementById('filtro-busca')?.focus()
  }

  const abrirNova = () => {
    setEmEdicao(null)
    setModalAberto(true)
  }

  const abrirEdicao = (item: MovimentacaoDto) => {
    setEmEdicao(item)
    setModalAberto(true)
  }

  const fecharModal = useCallback(() => {
    setModalAberto(false)
    setEmEdicao(null)
  }, [])


  const salvar = async (dados: DadosMovimentacao) => {
    if (emEdicao) {
      await movimentacaoService.atualizar(emEdicao.id, dados)
      setAviso('Movimentação atualizada.')
    } else {
      await movimentacaoService.criar(dados)
      setAviso('Movimentação adicionada.')
      setPagina(1)
    }
    fecharModal()
    carregarMovimentacoes()
  }

  const excluir = async (item: MovimentacaoDto) => {
    const confirmou = window.confirm(
      `Excluir "${item.descricao}" de ${formatarData(item.data)}?\nEssa ação não pode ser desfeita.`,
    )
    if (!confirmou) return
    try {
      await movimentacaoService.excluir(item.id)
      setAviso('Movimentação excluída.')
      carregarMovimentacoes()
    } catch (err) {
      setErro(mensagemDeErro(err, 'Não foi possível excluir a movimentação.'))
    }
  }


  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-5 p-4 text-[#0B2E2A] sm:p-8">

      <header className="mb-1 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight">Movimentações</h1>
          <p className="mt-1 text-sm text-[#6B7C79]">Gerencie suas receitas e despesas de forma simples.</p>
        </div>
        <button type="button" onClick={abrirNova} className={cx(estilos.botaoPrimario, 'max-[480px]:w-full')}>
          <Icone nome="mais" className="size-[18px] stroke-[2.25]" />
          Nova movimentação
        </button>
      </header>

      {erro && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-[14px] border border-[#F6C9CA] bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#C42B2E]">
          <Icone nome="alerta" className="size-[18px] shrink-0" />
          <span className="flex-1">{erro}</span>
          <button type="button" onClick={carregarMovimentacoes} className="font-semibold underline-offset-2 hover:underline">
            Tentar novamente
          </button>
        </div>
      )}

      <FiltrosMovimentacoes
        filtros={filtros}
        contas={contas}
        categorias={categorias}
        temFiltros={temFiltros}
        datasInvalidas={datasInvalidas}
        onChange={mudarFiltros}
        onLimpar={limparFiltros}
      />

      <section aria-label="Totais das movimentações filtradas" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Total icone="sobe" rotulo="Receitas" valor={formatarMoeda(totais.receitas)}
          classeIcone="bg-[#E7F5EF] text-[#0E8A5F]" classeValor="text-[#0E8A5F]" />
        <Total icone="desce" rotulo="Despesas" valor={formatarSaldo(-totais.despesas)}
          classeIcone="bg-[#FDECEC] text-[#E5383B]" classeValor="text-[#E5383B]" />
        <Total icone="carteira" rotulo="Saldo" valor={formatarSaldo(totais.saldo)}
          classeIcone="bg-[#E8F1FD] text-[#2F80ED]"
          classeValor={totais.saldo > 0 ? 'text-[#0E8A5F]' : totais.saldo < 0 ? 'text-[#E5383B]' : 'text-[#0B2E2A]'} />
      </section>

      <TabelaMovimentacoes
        itens={itensDaPagina}
        totalItens={ordenadas.length}
        carregando={carregando}
        pagina={paginaAtual}
        totalPaginas={totalPaginas}
        inicio={inicio}
        categorias={categorias}
        temFiltros={temFiltros}
        onPagina={setPagina}
        onEditar={abrirEdicao}
        onExcluir={excluir}
        onLimparFiltros={limparFiltros}
        onNova={abrirNova}
      />

      <ModalMovimentacao
        aberto={modalAberto}
        movimentacao={emEdicao}
        contas={contas}
        categorias={categorias}
        onFechar={fecharModal}
        onSalvar={salvar}
      />

      <div
        role="status"
        aria-live="polite"
        className={cx(
          'pointer-events-none fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-[10px]',
          'bg-[#052E2A] px-4 py-3 text-sm font-medium text-white shadow-[0_24px_48px_rgba(5,46,42,0.18)]',
          'transition duration-200 motion-reduce:transition-none',
          aviso ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}
      >
        <Icone nome="check" className="size-[18px] text-[#3DDC97]" />
        {aviso}
      </div>
    </div>
  )
}

interface TotalProps {
  icone: NomeIcone
  rotulo: string
  valor: string
  classeIcone: string
  classeValor: string
}

function Total({ icone, rotulo, valor, classeIcone, classeValor }: TotalProps) {
  return (
    <div className="flex items-center gap-3.5 rounded-[14px] border border-[#E3EAEC] bg-white px-5 py-4 shadow-[0_2px_8px_rgba(5,46,42,0.06)]">
      <span className={cx('grid size-10 shrink-0 place-items-center rounded-[10px]', classeIcone)}>
        <Icone nome={icone} />
      </span>
      <div>
        <p className="text-[13px] text-[#6B7C79]">{rotulo}</p>
        <p className={cx('text-xl font-bold tabular-nums', classeValor)}>{valor}</p>
      </div>
    </div>
  )
}
