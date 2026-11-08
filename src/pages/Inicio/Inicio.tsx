
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


const QUANTIDADE_ULTIMAS = 5 
const DIAS_DO_GRAFICO = 7 

export function Inicio() {
  useTituloPagina('Início')

  const { nomeUsuario, contas, categorias, movimentacoes, carregando, erro, tentarNovamente } = useInicio()

  
  const doMes = doMesAtual(movimentacoes)
  const receitas = somarPorTipo(doMes, 'RECEITA')
  const despesas = somarPorTipo(doMes, 'DESPESA')


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