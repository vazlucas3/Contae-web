import { EmConstrucao, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'


export function Relatorio() {
  useTituloPagina('Relatório')

  return (
    <>
      <PageHeader titulo="Relatório" />
      <EmConstrucao descricao="Resumo por período e por categoria." />
    </>
  )
}
