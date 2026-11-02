import { EmConstrucao, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'

/* ------------------------------------------------------------------
 * PÁGINA: Nova conta  (rota: /contas/nova)
 * STATUS: esqueleto — seção 4.8 do documento de design.
 *
 * O que falta implementar:
 *  - seta de voltar e campos Nome, Tipo (CORRENTE, POUPANCA, CARTEIRA) e Saldo inicial;
 *  - validação (nome obrigatório, saldo não negativo) e botões Cancelar/Salvar;
 *  - salvar com contaService.salvar(...).
 * Atenção: o design mostra o tipo "Cartão", mas a API aceita "CARTEIRA".
 * ------------------------------------------------------------------ */
export function NovaConta() {
  useTituloPagina('Nova conta')

  return (
    <>
      <PageHeader titulo="Nova conta" />
      <EmConstrucao descricao="Formulário de nova conta." />
    </>
  )
}
