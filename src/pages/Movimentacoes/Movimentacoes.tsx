import React, { useEffect, useState } from 'react'
import { movimentacaoService } from '@/services/movimentacaoService'
import type { MovimentacaoDto, TipoMovimentacao } from '@/types/movimentacao'

export function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoDto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [erro, setErro] = useState<string | null>(null)

  // Estados de Filtro
  const [busca, setBusca] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState<string>('')

  // Estado do Modal de Cadastro/Edição
  const [modalAberto, setModalAberto] = useState(false)
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState<TipoMovimentacao>('DESPESA')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [contaId, _setContaId] = useState<number>(1) // Ajustar conforme seleção real de contas
  const [categoriaId, _setCategoriaId] = useState<number>(1) // Ajustar conforme categorias reais

  const carregarMovimentacoes = async () => {
    try {
      setLoading(true)
      setErro(null)
      const dados = await movimentacaoService.listar({
        busca: busca || undefined,
        tipo: tipoFiltro ? (tipoFiltro as TipoMovimentacao) : undefined
      })
      setMovimentacoes(dados)
    } catch (err: any) {
      setErro(err?.message || 'Erro ao carregar movimentações.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarMovimentacoes()
  }, [tipoFiltro])

  const handleSubmitCriacao = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await movimentacaoService.criar({
        descricao,
        valor: Number(valor),
        tipo,
        data,
        contaId,
        categoriaId
      })
      setModalAberto(false)
      limparFormulario()
      carregarMovimentacoes()
    } catch (err: any) {
      alert(err?.message || 'Erro ao salvar movimentação.')
    }
  }

  const handleExcluir = async (id: number) => {
    if (window.confirm('Deseja realmente excluir esta movimentação?')) {
      try {
        await movimentacaoService.excluir(id)
        carregarMovimentacoes()
      } catch (err: any) {
        alert(err?.message || 'Erro ao excluir movimentação.')
      }
    }
  }

  const limparFormulario = () => {
    setDescricao('')
    setValor('')
    setTipo('DESPESA')
    setData(new Date().toISOString().split('T')[0])
  }

  const formatarMoeda = (val: number, tipoMov: TipoMovimentacao) => {
    const formatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    return tipoMov === 'DESPESA' ? `- ${formatado}` : formatado
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2E2A]">Movimentações</h1>
          <p className="text-sm text-[#6B7C79]">Gerencie suas receitas e despesas de forma simples.</p>
        </div>
        <button
          onClick={() => { limparFormulario(); setModalAberto(true); }}
          className="bg-[#0E8A5F] hover:bg-[#0B7350] text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          + Nova movimentação
        </button>
      </div>

      {/* Filtros em Linha */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E3EAEC] mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Buscar descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && carregarMovimentacoes()}
            className="border border-[#E3EAEC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0E8A5F]"
          />
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="border border-[#E3EAEC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0E8A5F]"
          >
            <option value="">Todos os tipos</option>
            <option value="RECEITA">Receitas</option>
            <option value="DESPESA">Despesas</option>
          </select>
          <button
            onClick={carregarMovimentacoes}
            className="bg-gray-100 hover:bg-gray-200 text-[#0B2E2A] text-sm px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Filtrar
          </button>
        </div>
      </div>

      {/* Tratamento de Erro / Loading */}
      {erro && <div className="bg-red-50 text-[#E5383B] p-4 rounded-lg mb-4 text-sm">{erro}</div>}

      {/* Tabela de Movimentações */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E3EAEC] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F4F8FA] text-[#6B7C79] text-xs uppercase font-semibold border-b border-[#E3EAEC]">
              <th className="p-4">Data</th>
              <th className="p-4">Descrição</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Conta</th>
              <th className="p-4">Tipo</th>
              <th className="p-4 text-right">Valor</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3EAEC] text-sm text-[#0B2E2A]">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-[#6B7C79]">Carregando movimentações...</td>
              </tr>
            ) : movimentacoes.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-[#6B7C79]">Nenhuma movimentação encontrada.</td>
              </tr>
            ) : (
              movimentacoes.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4 font-medium">{item.descricao}</td>
                  <td className="p-4">{item.categoriaNome || 'Geral'}</td>
                  <td className="p-4">{item.contaNome || 'Principal'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.tipo === 'RECEITA' ? 'bg-green-100 text-[#0E8A5F]' : 'bg-red-100 text-[#E5383B]'
                    }`}>
                      {item.tipo}
                    </span>
                  </td>
                  <td className={`p-4 text-right font-semibold ${item.tipo === 'RECEITA' ? 'text-[#0E8A5F]' : 'text-[#E5383B]'}`}>
                    {formatarMoeda(item.valor, item.tipo)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleExcluir(item.id)}
                      className="text-[#E5383B] hover:opacity-75 p-1 transition-opacity"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#0B2E2A] mb-4">Nova Movimentação</h2>
            <form onSubmit={handleSubmitCriacao} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#6B7C79] mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Supermercado"
                  className="w-full border border-[#E3EAEC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0E8A5F]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7C79] mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0,00"
                    className="w-full border border-[#E3EAEC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0E8A5F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7C79] mb-1">Tipo</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as TipoMovimentacao)}
                    className="w-full border border-[#E3EAEC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0E8A5F]"
                  >
                    <option value="DESPESA">Despesa</option>
                    <option value="RECEITA">Receita</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7C79] mb-1">Data</label>
                <input
                  type="date"
                  required
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full border border-[#E3EAEC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0E8A5F]"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 border border-[#E3EAEC] rounded-lg text-sm text-[#0B2E2A] hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0E8A5F] hover:bg-[#0B7350] text-white rounded-lg text-sm font-semibold"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
