import { useEffect, useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, CalendarDays, ChevronDown, CircleDollarSign, Download, TrendingDown, TrendingUp } from 'lucide-react'
import { Aviso, Button, Card, CardResumo, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { ErroApi, movimentacaoService } from '@/services'
import type { MovimentacaoResponse } from '@/types'
import { formatarData, formatarMoeda } from '@/utils/formatadores'
import estilos from './Relatorio.module.css'

type Periodo = 'mes' | 'trimestre' | 'ano' | 'personalizado'
type LinhaMes = { chave: string; rotulo: string; receitas: number; despesas: number }
type LinhaCategoria = { id: number; nome: string; receitas: number; despesas: number }

const moedaCompacta = new Intl.NumberFormat('pt-BR', { notation: 'compact', style: 'currency', currency: 'BRL', maximumFractionDigits: 1 })
const dataHoje = () => new Date().toISOString().slice(0, 10)
const inicioMes = (data: string) => `${data.slice(0, 7)}-01`

function intervalo(periodo: Periodo, inicioManual: string, fimManual: string, hoje: string) {
  const data = new Date(`${hoje}T12:00:00`)
  if (periodo === 'personalizado') return { inicio: inicioManual || inicioMes(hoje), fim: fimManual || hoje }
  if (periodo === 'mes') return { inicio: inicioMes(hoje), fim: hoje }
  const inicio = new Date(data.getFullYear(), data.getMonth() - (periodo === 'trimestre' ? 2 : 11), 1)
  return { inicio: `${inicio.getFullYear()}-${String(inicio.getMonth() + 1).padStart(2, '0')}-01`, fim: hoje }
}

function chaveMes(data: string) { return data.slice(0, 7) }
function diferencaPercentual(atual: number, anterior: number) {
  if (!anterior) return atual ? null : 0
  return ((atual - anterior) / anterior) * 100
}

export function Relatorio() {
  useTituloPagina('Relatórios')
  const hoje = dataHoje()
  const [periodo, setPeriodo] = useState<Periodo>('mes')
  const [inicioManual, setInicioManual] = useState(inicioMes(hoje))
  const [fimManual, setFimManual] = useState(hoje)
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    movimentacaoService.listar()
      .then((lista) => { if (!cancelado) { setMovimentacoes(lista); setErro(null) } })
      .catch((e: unknown) => { if (!cancelado) setErro(e instanceof ErroApi ? e.message : 'Não foi possível carregar os dados do relatório.') })
      .finally(() => { if (!cancelado) setCarregando(false) })
    return () => { cancelado = true }
  }, [tentativa])

  const faixa = intervalo(periodo, inicioManual, fimManual, hoje)
  const dados = useMemo(() => {
    const filtradas = movimentacoes.filter((item) => item.data >= faixa.inicio && item.data <= faixa.fim)
    const receitas = filtradas.filter((item) => item.tipoMovimentacao === 'RECEITA').reduce((total, item) => total + item.valor, 0)
    const despesas = filtradas.filter((item) => item.tipoMovimentacao === 'DESPESA').reduce((total, item) => total + item.valor, 0)
    const inicio = new Date(`${faixa.inicio}T12:00:00`)
    const fim = new Date(`${faixa.fim}T12:00:00`)
    const meses: LinhaMes[] = []
    const cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1)
    while (cursor <= fim) {
      const chave = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`
      const itens = filtradas.filter((item) => chaveMes(item.data) === chave)
      meses.push({ chave, rotulo: cursor.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''), receitas: itens.filter((item) => item.tipoMovimentacao === 'RECEITA').reduce((soma, item) => soma + item.valor, 0), despesas: itens.filter((item) => item.tipoMovimentacao === 'DESPESA').reduce((soma, item) => soma + item.valor, 0) })
      cursor.setMonth(cursor.getMonth() + 1)
    }
    const porCategoria = new Map<number, LinhaCategoria>()
    filtradas.forEach((item) => {
      const linha = porCategoria.get(item.categoriaId) ?? { id: item.categoriaId, nome: item.nomeCategoria || 'Sem categoria', receitas: 0, despesas: 0 }
      if (item.tipoMovimentacao === 'RECEITA') linha.receitas += item.valor
      else linha.despesas += item.valor
      porCategoria.set(item.categoriaId, linha)
    })
    return { filtradas, receitas, despesas, meses, categorias: [...porCategoria.values()].sort((a, b) => b.despesas + b.receitas - a.despesas - a.receitas) }
  }, [movimentacoes, faixa.inicio, faixa.fim])

  const anterior = useMemo(() => {
    const inicio = new Date(`${faixa.inicio}T12:00:00`)
    const fim = new Date(`${faixa.fim}T12:00:00`)
    const dias = Math.max(1, Math.round((fim.getTime() - inicio.getTime()) / 86400000) + 1)
    const anteriorFim = new Date(inicio); anteriorFim.setDate(anteriorFim.getDate() - 1)
    const anteriorInicio = new Date(anteriorFim); anteriorInicio.setDate(anteriorInicio.getDate() - dias + 1)
    const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const lista = movimentacoes.filter((item) => item.data >= iso(anteriorInicio) && item.data <= iso(anteriorFim))
    return { receitas: lista.filter((item) => item.tipoMovimentacao === 'RECEITA').reduce((s, item) => s + item.valor, 0), despesas: lista.filter((item) => item.tipoMovimentacao === 'DESPESA').reduce((s, item) => s + item.valor, 0) }
  }, [movimentacoes, faixa.inicio, faixa.fim])

  const variacaoReceita = diferencaPercentual(dados.receitas, anterior.receitas)
  const variacaoDespesa = diferencaPercentual(dados.despesas, anterior.despesas)
  const maxGrafico = Math.max(1, ...dados.meses.flatMap((mes) => [mes.receitas, mes.despesas]))
  const maiorCategoria = Math.max(1, ...dados.categorias.map((categoria) => categoria.despesas))

  function exportarCsv() {
    const linhas = [['Data', 'Descrição', 'Categoria', 'Conta', 'Tipo', 'Valor'], ...dados.filtradas.map((item) => [formatarData(item.data), item.descricao, item.nomeCategoria || '', item.nomeConta || '', item.tipoMovimentacao, item.valor.toFixed(2).replace('.', ',')])]
    const csv = '\uFEFF' + linhas.map((linha) => linha.map((campo) => `"${String(campo).replaceAll('"', '""')}"`).join(';')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = `relatorio-${faixa.inicio}-${faixa.fim}.csv`; link.click(); URL.revokeObjectURL(url)
  }

  const variacaoTexto = (valor: number | null, tipo: 'receita' | 'despesa') => {
    if (valor === null) return 'Sem dados no período anterior'
    if (valor === 0) return 'Mesmo resultado do período anterior'
    const melhor = tipo === 'receita' ? valor > 0 : valor < 0
    return `${valor > 0 ? '+' : ''}${valor.toFixed(1).replace('.', ',')}% vs. período anterior${melhor ? ' · evolução positiva' : ''}`
  }

  return (
    <>
      <PageHeader titulo="Relatórios" subtitulo="Acompanhe a evolução e entenda para onde seu dinheiro está indo." acao={<Button variante="secundario" onClick={exportarCsv} disabled={carregando || !!erro}><Download size={17} /> Exportar CSV</Button>} />
      {erro && <Aviso tipo="erro" acao={<Button variante="secundario" onClick={() => setTentativa((n) => n + 1)}>Tentar novamente</Button>}>{erro}</Aviso>}
      <main className={estilos.pagina}>
        <Card className={estilos.filtros}>
          <div className={estilos.filtroTitulo}><CalendarDays size={18} /><div><strong>Período do relatório</strong><span>Escolha o intervalo que deseja analisar</span></div></div>
          <div className={estilos.controles}>
            <label className={estilos.seletor}><span className="somente-leitor">Período</span><select value={periodo} onChange={(e) => setPeriodo(e.target.value as Periodo)}><option value="mes">Este mês</option><option value="trimestre">Últimos 3 meses</option><option value="ano">Últimos 12 meses</option><option value="personalizado">Personalizado</option></select><ChevronDown size={16} /></label>
            {periodo === 'personalizado' && <div className={estilos.datas}><label>De <input type="date" value={inicioManual} max={fimManual} onChange={(e) => setInicioManual(e.target.value)} /></label><label>Até <input type="date" value={fimManual} min={inicioManual} max={hoje} onChange={(e) => setFimManual(e.target.value)} /></label></div>}
            <span className={estilos.intervalo}>{formatarData(faixa.inicio)} – {formatarData(faixa.fim)}</span>
          </div>
        </Card>

        {carregando ? <Card><p className={estilos.estado}>Carregando relatório...</p></Card> : !erro && <>
          <section className={estilos.resumo} aria-label="Resumo do período">
            <div><CardResumo rotulo="Total de receitas" valor={formatarMoeda(dados.receitas)} icone={<ArrowDownLeft size={20} />} tom="receita" /><p className={`${estilos.variacao} ${variacaoReceita !== null && variacaoReceita >= 0 ? estilos.positivo : estilos.negativo}`}><TrendingUp size={14} />{variacaoTexto(variacaoReceita, 'receita')}</p></div>
            <div><CardResumo rotulo="Total de despesas" valor={formatarMoeda(dados.despesas)} icone={<ArrowUpRight size={20} />} corIcone="var(--vermelho)" tom="despesa" /><p className={`${estilos.variacao} ${variacaoDespesa !== null && variacaoDespesa <= 0 ? estilos.positivo : estilos.negativo}`}><TrendingDown size={14} />{variacaoTexto(variacaoDespesa, 'despesa')}</p></div>
            <div><CardResumo rotulo="Saldo do período" valor={formatarMoeda(dados.receitas - dados.despesas)} icone={<CircleDollarSign size={20} />} tom={dados.receitas >= dados.despesas ? 'receita' : 'despesa'} /><p className={estilos.variacaoNeutra}>{dados.filtradas.length} movimentações no período</p></div>
          </section>

          <section className={estilos.graficos}>
            <Card className={estilos.cartaoGrafico}>
              <div className={estilos.tituloCartao}><div><h2>Receitas e despesas</h2><p>Comparativo mensal no período selecionado</p></div><span className={estilos.legenda}><i className={estilos.pontoReceita} /> Receitas <i className={estilos.pontoDespesa} /> Despesas</span></div>
              {dados.meses.length === 0 || dados.filtradas.length === 0 ? <p className={estilos.vazio}>Sem movimentações neste período.</p> : <div className={estilos.grafico} role="img" aria-label="Gráfico comparativo mensal de receitas e despesas">{dados.meses.map((mes) => <div className={estilos.colunaMes} key={mes.chave}><div className={estilos.barras}><span className={estilos.barraReceita} style={{ height: `${Math.max(mes.receitas ? 4 : 0, (mes.receitas / maxGrafico) * 100)}%` }} title={`Receitas: ${formatarMoeda(mes.receitas)}`} /><span className={estilos.barraDespesa} style={{ height: `${Math.max(mes.despesas ? 4 : 0, (mes.despesas / maxGrafico) * 100)}%` }} title={`Despesas: ${formatarMoeda(mes.despesas)}`} /></div><span className={estilos.rotuloMes}>{mes.rotulo}</span></div>)}</div>}
            </Card>
            <Card className={estilos.cartaoResumo}><div className={estilos.tituloCartao}><div><h2>Visão do período</h2><p>Distribuição das movimentações</p></div></div><div className={estilos.destaqueSaldo}><span>Resultado líquido</span><strong className={dados.receitas >= dados.despesas ? estilos.textoReceita : estilos.textoDespesa}>{formatarMoeda(dados.receitas - dados.despesas)}</strong></div><div className={estilos.linhaResumo}><span>Movimentações registradas</span><strong>{dados.filtradas.length}</strong></div><div className={estilos.linhaResumo}><span>Categorias utilizadas</span><strong>{dados.categorias.length}</strong></div><div className={estilos.linhaResumo}><span>Despesas recorrentes</span><strong>{dados.filtradas.filter((item) => item.tipoMovimentacao === 'DESPESA' && item.recorrente).length}</strong></div></Card>
          </section>

          <Card className={estilos.cartaoTabela}><div className={estilos.tituloCartao}><div><h2>Despesas por categoria</h2><p>Veja quais categorias concentram seus gastos</p></div></div>{dados.categorias.length === 0 ? <p className={estilos.vazio}>Ainda não há categorias movimentadas neste período.</p> : <div className={estilos.tabelaWrap}><table><thead><tr><th>Categoria</th><th>Receitas</th><th>Despesas</th><th>Saldo</th></tr></thead><tbody>{dados.categorias.map((categoria) => <tr key={categoria.id}><td><div className={estilos.categoriaNome}><span className={estilos.bolinhaCategoria} />{categoria.nome}<div className={estilos.progresso}><span style={{ width: `${(categoria.despesas / maiorCategoria) * 100}%` }} /></div></div></td><td className={estilos.textoReceita}>{formatarMoeda(categoria.receitas)}</td><td className={estilos.textoDespesa}>{formatarMoeda(categoria.despesas)}</td><td className={categoria.receitas >= categoria.despesas ? estilos.textoReceita : estilos.textoDespesa}>{formatarMoeda(categoria.receitas - categoria.despesas)}</td></tr>)}</tbody></table></div>}</Card>

          <Card className={estilos.cartaoTabela}><div className={estilos.tituloCartao}><div><h2>Movimentações do período</h2><p>Registros incluídos neste relatório</p></div><span className={estilos.contagem}>{dados.filtradas.length} registros</span></div>{dados.filtradas.length === 0 ? <p className={estilos.vazio}>Nenhuma movimentação encontrada.</p> : <div className={estilos.tabelaWrap}><table><thead><tr><th>Descrição</th><th>Categoria</th><th>Data</th><th>Tipo</th><th>Valor</th></tr></thead><tbody>{[...dados.filtradas].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 10).map((item) => <tr key={item.id}><td className={estilos.descricao}>{item.descricao}<small>{item.nomeConta || 'Conta'}</small></td><td>{item.nomeCategoria || 'Sem categoria'}</td><td>{formatarData(item.data)}</td><td><span className={`${estilos.etiqueta} ${item.tipoMovimentacao === 'RECEITA' ? estilos.etiquetaReceita : estilos.etiquetaDespesa}`}>{item.tipoMovimentacao === 'RECEITA' ? 'Receita' : 'Despesa'}</span></td><td className={item.tipoMovimentacao === 'RECEITA' ? estilos.textoReceita : estilos.textoDespesa}>{item.tipoMovimentacao === 'RECEITA' ? '+' : '−'} {moedaCompacta.format(item.valor)}</td></tr>)}</tbody></table></div>}</Card>
        </>}
      </main>
    </>
  )
}
