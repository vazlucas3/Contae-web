import { NavLink, useNavigate } from 'react-router-dom'
import { Icone, Logo, type NomeIcone } from '@/components/common'
import { useAuth } from '@/hooks/useAuth'
import { CAMINHOS } from '@/routes/caminhos'
import estilos from './Sidebar.module.css'

/* ------------------------------------------------------------------
 * ITENS DO MENU
 * Para incluir uma tela no menu, adicione uma linha aqui.
 * ------------------------------------------------------------------ */
interface ItemMenu {
  rotulo: string
  caminho: string
  icone: NomeIcone
}

const ITENS_MENU: ItemMenu[] = [
  { rotulo: 'Início', caminho: CAMINHOS.inicio, icone: 'inicio' },
  { rotulo: 'Movimentações', caminho: CAMINHOS.movimentacoes, icone: 'movimentacoes' },
  { rotulo: 'Contas', caminho: CAMINHOS.contas, icone: 'contas' },
  { rotulo: 'Categorias', caminho: CAMINHOS.categorias, icone: 'categorias' },
  { rotulo: 'Relatórios', caminho: CAMINHOS.relatorio, icone: 'relatorio' },
  { rotulo: 'Perfil', caminho: CAMINHOS.perfil, icone: 'perfil' },
]

interface SidebarProps {
  /** Usado em telas pequenas, onde o menu vira uma gaveta. */
  aberta: boolean
  aoFechar: () => void
}

/* Sidebar — menu lateral fixo: logo no topo, navegação e "Sair" no rodapé.
 * O cartão do usuário (avatar, nome, e-mail) é responsabilidade da tela de Perfil. */
export function Sidebar({ aberta, aoFechar }: SidebarProps) {
  const { sair } = useAuth()
  const navegar = useNavigate()

  function aoSair() {
    sair()
    aoFechar()
    navegar(CAMINHOS.login)
  }

  return (
    <>
      {aberta && <div className={estilos.fundo} onClick={aoFechar} aria-hidden="true" />}

      <aside className={`${estilos.sidebar} ${aberta ? estilos.aberta : ''}`}>
        <div className={estilos.logo}>
          <Logo tema="escuro" />
        </div>

        <nav className={estilos.navegacao} aria-label="Menu principal">
          {ITENS_MENU.map((item) => (
            <NavLink
              key={item.caminho}
              to={item.caminho}
              end={item.caminho === CAMINHOS.inicio}
              onClick={aoFechar}
              className={({ isActive }) => `${estilos.item} ${isActive ? estilos.ativo : ''}`}
              title={item.rotulo}
            >
              <Icone nome={item.icone} />
              <span className={estilos.rotulo}>{item.rotulo}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className={`${estilos.item} ${estilos.sair}`} onClick={aoSair} title="Sair">
          <Icone nome="sair" />
          <span className={estilos.rotulo}>Sair</span>
        </button>
      </aside>
    </>
  )
}
