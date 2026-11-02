import { EmConstrucao, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'

/* ------------------------------------------------------------------
 * PÁGINA: Relatório  (rota: /relatorio)
 * STATUS: esqueleto — seção 4.6 do documento de design.
 *
 * O que falta implementar:
 *  - abas "Receitas e Despesas" | "Por categoria" e seletor de período;
 *  - 3 cards (total de receitas, de despesas e saldo do período);
 *  - tabela Categoria · Receitas · Despesas · Saldo.
 * Atenção: a API não tem endpoint de relatório; os totais são calculados no
 * frontend a partir de movimentacaoService.buscarTodas() (coloque o cálculo
 * em "utils/", fora do componente visual).
 * ------------------------------------------------------------------ */
export function Relatorio() {
  useTituloPagina('Relatório')

  return (
    <>
      <PageHeader titulo="Relatório" />
      <EmConstrucao descricao="Resumo por período e por categoria." />
    </>
  )
}
