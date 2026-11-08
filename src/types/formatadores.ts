import type { TipoMovimentacao } from '@/types/movimentacao'

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatarMoeda(valor: number): string {
  return moeda.format(valor)
}

// Despesa sempre com sinal "-" (a cor nunca é a única indicação do tipo)
export function formatarValor(valor: number, tipo: TipoMovimentacao): string {
  const texto = moeda.format(Math.abs(valor))
  return tipo === 'DESPESA' ? `- ${texto}` : texto
}

export function formatarSaldo(valor: number): string {
  return valor < 0 ? `- ${moeda.format(-valor)}` : moeda.format(valor)
}

// 1234.5 -> "1.234,50" (para preencher o campo de valor)
export function formatarNumero(valor: number): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Aceita "1.234,56", "1234,56", "1234.56" e "R$ 12,00"
export function converterValor(texto: string): number {
  let t = texto.trim().replace(/R\$|\s/g, '')
  if (!t) return NaN
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.')
  else if ((t.match(/\./g) ?? []).length > 1) t = t.replace(/\./g, '')
  return Number(t)
}

// "2025-10-30" ou "2025-10-30T00:00:00" -> "aaaa-mm-dd" (valor do input date)
export function paraDataInput(iso: string): string {
  return iso.slice(0, 10)
}

// Formata sem usar new Date(), que converte para UTC e pode mostrar o dia anterior
export function formatarData(iso: string): string {
  const [ano, mes, dia] = paraDataInput(iso).split('-')
  return `${dia}/${mes}/${ano}`
}

// Hoje no fuso local (toISOString puro dá o dia seguinte depois das 21h no Brasil)
export function hojeISO(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

// Cor da categoria: aceita hex ("#E5383B") ou nome ("vermelho")
const CORES: Record<string, string> = {
  verde: '#0E8A5F',
  azul: '#2F80ED',
  laranja: '#F2994A',
  vermelho: '#E5383B',
  roxo: '#7B4DDB',
  rosa: '#EB4DA6',
  cinza: '#8A9A97',
}

export function corDaCategoria(cor?: string | null): string {
  if (!cor) return CORES.cinza
  if (cor.startsWith('#')) return cor
  return CORES[cor.toLowerCase()] ?? CORES.cinza
}

// Mensagem clara a partir de um erro do axios (ou qualquer outro)
export function mensagemDeErro(erro: unknown, padrao: string): string {
  const e = erro as {
    response?: { status?: number; data?: { message?: string; mensagem?: string } }
    message?: string
  }
  const status = e?.response?.status

  if (status === 401) return 'Sua sessão expirou ou você não está conectado. Entre novamente para continuar.'
  if (status === 403) return 'Você não tem permissão para fazer isso.'
  if (!e?.response && e?.message === 'Network Error') {
    return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'
  }
  return e?.response?.data?.message ?? e?.response?.data?.mensagem ?? padrao
}
