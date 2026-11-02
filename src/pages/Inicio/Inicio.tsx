import { Link } from 'react-router-dom'
import { Card, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { CAMINHOS } from '@/routes/caminhos'
import estilos from './Inicio.module.css'

/* ------------------------------------------------------------------
 * PÁGINA: Início / Dashboard  (rota: /)
 * STATUS: página de validação da estrutura — SUBSTITUIR pelo dashboard real
 * (seção 4.3 do documento de design).
 *
 * O que falta implementar:
 *  - saudação, 4 cards de resumo (use <CardResumo />), gráfico dos últimos 30 dias
 *    e lista de últimas movimentações;
 *  - os totais devem ser calculados a partir dos dados reais da API
 *    (movimentacaoService / contaService).
 * ------------------------------------------------------------------ */

// Mapa das telas: serve de guia de quem trabalha em cada uma. Remova ao implementar o dashboard.
const TELAS = [
  { nome: 'Login', caminho: CAMINHOS.login },
  { nome: 'Cadastro', caminho: CAMINHOS.cadastro },
  { nome: 'Movimentações (+ Filtros)', caminho: CAMINHOS.movimentacoes },
  { nome: 'Relatório', caminho: CAMINHOS.relatorio },
  { nome: 'Contas', caminho: CAMINHOS.contas },
  { nome: 'Nova conta', caminho: CAMINHOS.novaConta },
  { nome: 'Categorias', caminho: CAMINHOS.categorias },
  { nome: 'Nova categoria', caminho: CAMINHOS.novaCategoria },
  { nome: 'Perfil', caminho: CAMINHOS.perfil },
]

export function Inicio() {
  useTituloPagina('Início')

  return (
    <>
      <PageHeader titulo="Início" subtitulo="A estrutura do projeto está funcionando." />

      <Card>
        <h2>Telas registradas</h2>
        <p className={estilos.texto}>
          Cada tela abaixo já tem sua rota e uma página-esqueleto em <code>src/pages</code>. Escolha a sua e
          comece a implementar.
        </p>

        <ul className={estilos.lista}>
          {TELAS.map((tela) => (
            <li key={tela.caminho}>
              <Link to={tela.caminho}>{tela.nome}</Link>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
