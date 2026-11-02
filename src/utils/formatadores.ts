/* ------------------------------------------------------------------
 * Formatadores de apresentação (moeda e datas, padrão pt-BR).
 * Funções puras: sem estado e sem dependência de React.
 * ------------------------------------------------------------------ */

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** 3500 -> "R$ 3.500,00" */
export function formatarMoeda(valor: number): string {
  return formatadorMoeda.format(valor)
}

/** "2025-10-30" -> "30/10/2025" (sem passar por Date, evitando erro de fuso horário). */
export function formatarData(dataIso: string): string {
  const [ano, mes, dia] = dataIso.slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}
