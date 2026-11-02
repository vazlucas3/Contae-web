import { Link } from 'react-router-dom'
import { EmConstrucao, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { CAMINHOS } from '@/routes/caminhos'

/* ------------------------------------------------------------------
 * PÁGINA: Contas  (rota: /contas)
 * STATUS: esqueleto — seção 4.7 do documento de design.
 *
 * O que falta implementar:
 *  - tabela Nome · Tipo · Saldo · Ações (saldo negativo em vermelho com sinal "-");
 *  - exclusão com confirmação (contaService.excluir).
 * Atenção: a API não possui endpoint para EDITAR conta.
 * ------------------------------------------------------------------ */
export function Contas() {
  useTituloPagina('Contas')

  return (
    <>
      <PageHeader titulo="Contas" acao={<Link to={CAMINHOS.novaConta}>+ Nova conta</Link>} />
      <EmConstrucao descricao="Listagem de contas." />
    </>
  )
}
