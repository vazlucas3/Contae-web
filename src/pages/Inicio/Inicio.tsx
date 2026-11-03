// src/pages/Inicio/Inicio.tsx
import { Aviso, Button, Card, CardResumo, Icone, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { formatarMoeda } from '@/utils/formatadores'
import { CartaoSaldo } from './components/CartaoSaldo'
import { GraficoSemana } from './components/GraficoSemana'
import { UltimasMovimentacoes } from './components/UltimasMovimentacoes'
import {
  doMesAtual,
  somarPorTipo,
  somarSaldoContas,
  ultimasMovimentacoes,
  ultimosDias,
} from './components/calcularResumo'
import { useInicio } from './useInicio'
import estilos from './Inicio.module.css'

/* ------------------------------------------------------------------
 * PÁGINA: Início  (rota: /)  — seção 4.3 do documento de design.
 *
 * A tela tem 5 partes, de cima para baixo:
 *  1. saudação com o nome da pessoa;
 *  2. cartão de destaque (saldo nas contas + resultado do mês);
 *  3. cards de receitas e despesas do mês;
 *  4. gráfico dos últimos dias;
 *  5. últimas movimentações.
 *
 * Onde mexer:
 *  - contas e regras      -> calcularResumo.ts
 *  - busca na API         -> useInicio.ts
 *  - cada bloco da tela   -> pasta components/
 *  - espaçamento da tela  -> Inicio.module.css
 * ------------------------------------------------------------------ */

const QUANTIDADE_ULTIMAS = 5 // movimentações na lista
const DIAS_DO_GRAFICO = 7 // dias no gráfico

export function Inicio() {
  useTituloPagina('Início')

  const { nomeUsuario, contas, categorias, movimentacoes, carregando, erro, tentarNovamente } = useInicio()

  // Contas do mês atual.
  const doMes = doMesAtual(movimentacoes)
  const receitas = somarPorTipo(doMes, 'RECEITA')
  const despesas = somarPorTipo(doMes, 'DESPESA')

  // Só o primeiro nome na saudação.
  const primeiroNome = nomeUsuario.split(' ')[0]
  const saudacao = primeiroNome ? `Olá, ${primeiroNome}!` : 'Olá!'

  return (
    <>
      <PageHeader titulo={saudacao} subtitulo="Veja como estão suas finanças neste mês." />

      {erro && (
        <Aviso
          tipo="erro"
          acao={
            <Button variante="secundario" onClick={tentarNovamente}>
              Tentar novamente
            </Button>
          }
        >
          {erro}
        </Aviso>
      )}

      {carregando ? (
        <Card>
          <p className={estilos.mensagem}>Carregando...</p>
        </Card>
      ) : (
        !erro && (
          <div className={estilos.pagina}>
            <CartaoSaldo
              saldoContas={somarSaldoContas(contas)}
              quantidadeContas={contas.length}
              resultadoMes={receitas - despesas}
            />

            <div className={estilos.resumo}>
              <CardResumo
                rotulo="Receitas do mês"
                valor={formatarMoeda(receitas)}
                icone={<Icone nome="movimentacoes" />}
                tom="receita"
              />
              <CardResumo
                rotulo="Despesas do mês"
                valor={formatarMoeda(despesas)}
                icone={<Icone nome="movimentacoes" />}
                corIcone="var(--vermelho)"
                tom="despesa"
              />
            </div>

            <GraficoSemana dias={ultimosDias(movimentacoes, DIAS_DO_GRAFICO)} />

            <UltimasMovimentacoes
              movimentacoes={ultimasMovimentacoes(movimentacoes, QUANTIDADE_ULTIMAS)}
              categorias={categorias}
              contas={contas}
            />
          </div>
        )
      )}
    </>
  )
}