import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { MovimentacaoDto, TipoMovimentacao } from '@/types/movimentacao'
import {
  converterValor, formatarNumero, hojeISO, mensagemDeErro, paraDataInput,
} from '@/types/formatadores'
import type { DadosMovimentacao, MovimentacaoComIds, OpcaoCategoria, OpcaoConta } from '../../types/tipos'
import { Campo, Icone, Select, SeletorSegmentado, cx, estilos } from './ui'

interface Props {
  aberto: boolean
  movimentacao: MovimentacaoDto | null // null = nova
  contas: OpcaoConta[]
  categorias: OpcaoCategoria[]
  onFechar: () => void
  onSalvar: (dados: DadosMovimentacao) => Promise<void>
}

type CampoForm = 'descricao' | 'valor' | 'data' | 'contaId' | 'categoriaId'
type Erros = Partial<Record<CampoForm, string>>

export function ModalMovimentacao({ aberto, movimentacao, contas, categorias, onFechar, onSalvar }: Props) {
  const [tipo, setTipo] = useState<TipoMovimentacao>('DESPESA')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState(hojeISO())
  const [contaId, setContaId] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [erroGeral, setErroGeral] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)
  const descricaoRef = useRef<HTMLInputElement>(null)

  const editando = movimentacao !== null

  // Preenche o formulário toda vez que abre
  useEffect(() => {
    if (!aberto) return
    const m = movimentacao as MovimentacaoComIds | null
    const conta = m?.contaId ?? contas.find((c) => c.nome === m?.nomeConta)?.id
    const categoria = m?.categoriaId ?? categorias.find((c) => c.nome === m?.nomeCategoria)?.id

    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza o formulário quando o modal abre ou muda de registro.
    setTipo(m?.tipoMovimentacao ?? 'DESPESA')
    setDescricao(m?.descricao ?? '')
    setValor(m ? formatarNumero(m.valor) : '')
    setData(m ? paraDataInput(m.data) : hojeISO())
    setContaId(conta ? String(conta) : contas.length === 1 ? String(contas[0].id) : '')
    setCategoriaId(categoria ? String(categoria) : '')
    setErros({})
    setErroGeral(null)
    setSalvando(false)
    requestAnimationFrame(() => descricaoRef.current?.focus())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto, movimentacao])

  // Esc fecha e a página de fundo não rola
  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !salvando) onFechar()
    }
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.body.style.overflow = overflowAnterior
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [aberto, salvando, onFechar])

  if (!aberto) return null

  const categoriasDoTipo = categorias.filter((c) => !c.tipo || c.tipo === tipo)

  const limparErro = (campo: CampoForm) => {
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  const mudarTipo = (novo: TipoMovimentacao) => {
    setTipo(novo)
    const atual = categorias.find((c) => String(c.id) === categoriaId)
    if (atual?.tipo && atual.tipo !== novo) setCategoriaId('')
  }

  // Ao sair do campo: 1234,5 -> 1.234,50
  const formatarValorAoSair = () => {
    const numero = converterValor(valor)
    if (Number.isFinite(numero) && numero > 0) setValor(formatarNumero(numero))
  }

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    const texto = descricao.trim()
    const numero = converterValor(valor)
    const novos: Erros = {}

    if (!texto) novos.descricao = 'Informe uma descrição.'
    if (!valor.trim()) novos.valor = 'Informe o valor.'
    else if (!Number.isFinite(numero) || numero <= 0) novos.valor = 'Digite um valor maior que zero, ex.: 120,50.'
    if (!data) novos.data = 'Escolha a data.'
    if (!contaId) novos.contaId = 'Escolha a conta.'
    if (!categoriaId) novos.categoriaId = 'Escolha a categoria.'

    setErros(novos)
    const primeiroErro = Object.keys(novos)[0]
    if (primeiroErro) {
      document.getElementById(`mov-${primeiroErro}`)?.focus()
      return
    }

    setSalvando(true)
    setErroGeral(null)
    try {
      await onSalvar({
        descricao: texto,
        valor: Math.round(numero * 100) / 100,
        tipoMovimentacao: tipo,
        recorrente: false,
        data,
        contaId: Number(contaId),
        categoriaId: Number(categoriaId),
      })
    } catch (err) {
      setErroGeral(mensagemDeErro(err, 'Não foi possível salvar a movimentação.'))
    } finally {
      setSalvando(false)
    }
  }

  const ariaCampo = (campo: CampoForm) => ({
    id: `mov-${campo}`,
    'aria-invalid': Boolean(erros[campo]),
    'aria-describedby': erros[campo] ? `mov-${campo}-erro` : undefined,
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#052E2A]/45 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !salvando) onFechar() // clique fora da caixa
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-mov"
        aria-describedby="subtitulo-modal-mov"
        className="max-h-[calc(100vh-32px)] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white text-[#0B2E2A] shadow-[0_24px_48px_rgba(5,46,42,0.18)]"
      >
        <form onSubmit={enviar} noValidate>
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div>
              <h2 id="titulo-modal-mov" className="text-lg font-semibold">
                {editando ? 'Editar movimentação' : 'Nova movimentação'}
              </h2>
              <p id="subtitulo-modal-mov" className="mt-1 text-[13px] text-[#6B7C79]">
                {editando ? 'Altere os dados e salve para atualizar.' : 'Registre uma receita ou despesa.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onFechar}
              disabled={salvando}
              aria-label="Fechar"
              className={cx(estilos.botaoIcone, 'text-[#6B7C79] hover:bg-[#F4F8FA]')}
            >
              <Icone nome="fechar" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 px-6 pb-6 pt-5 sm:grid-cols-2">
            {erroGeral && (
              <div role="alert" className="flex items-start gap-2 rounded-lg bg-[#FDECEC] p-3 text-sm font-medium text-[#C42B2E] sm:col-span-2">
                <Icone nome="alerta" className="mt-px size-[18px] shrink-0" />
                {erroGeral}
              </div>
            )}

            <SeletorSegmentado
              nome="mov-tipo"
              legenda="Tipo"
              valor={tipo}
              onChange={mudarTipo}
              className="sm:col-span-2"
              opcoes={[
                { valor: 'DESPESA', rotulo: 'Despesa', classeAtiva: 'peer-checked:text-[#C42B2E]' },
                { valor: 'RECEITA', rotulo: 'Receita', classeAtiva: 'peer-checked:text-[#0E8A5F]' },
              ]}
            />

            <Campo id="mov-descricao" rotulo="Descrição" erro={erros.descricao} className="sm:col-span-2">
              <input
                ref={descricaoRef}
                type="text"
                maxLength={60}
                placeholder="Ex: Supermercado"
                value={descricao}
                onChange={(e) => { setDescricao(e.target.value); limparErro('descricao') }}
                className={estilos.input}
                {...ariaCampo('descricao')}
              />
            </Campo>

            <Campo id="mov-valor" rotulo="Valor" erro={erros.valor}>
              <div className="relative">
                <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#6B7C79]">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => { setValor(e.target.value); limparErro('valor') }}
                  onBlur={formatarValorAoSair}
                  className={cx(estilos.input, 'pl-[38px] tabular-nums')}
                  {...ariaCampo('valor')}
                />
              </div>
            </Campo>

            <Campo id="mov-data" rotulo="Data" erro={erros.data}>
              <input
                type="date"
                value={data}
                onChange={(e) => { setData(e.target.value); limparErro('data') }}
                className={estilos.input}
                {...ariaCampo('data')}
              />
            </Campo>

            <Campo id="mov-contaId" rotulo="Conta" erro={erros.contaId}>
              <Select
                value={contaId}
                onChange={(e) => { setContaId(e.target.value); limparErro('contaId') }}
                {...ariaCampo('contaId')}
              >
                <option value="">Selecione a conta</option>
                {contas.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </Select>
            </Campo>

            <Campo id="mov-categoriaId" rotulo="Categoria" erro={erros.categoriaId}>
              <Select
                value={categoriaId}
                onChange={(e) => { setCategoriaId(e.target.value); limparErro('categoriaId') }}
                {...ariaCampo('categoriaId')}
              >
                <option value="">Selecione a categoria</option>
                {categoriasDoTipo.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </Select>
            </Campo>
          </div>

          <div className="flex justify-end gap-3 rounded-b-2xl border-t border-[#E3EAEC] bg-[#F7FAFB] px-6 py-4">
            <button type="button" onClick={onFechar} disabled={salvando} className={cx(estilos.botaoSecundario, 'max-sm:flex-1')}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando} className={cx(estilos.botaoPrimario, 'max-sm:flex-1')}>
              {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Salvar movimentação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
