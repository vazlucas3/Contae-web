import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Icone } from '@/components/common'
import { Sidebar } from '../Sidebar/Sidebar'
import estilos from './AppLayout.module.css'

/* ------------------------------------------------------------------
 * AppLayout — layout das telas internas.
 *  - menu lateral (Sidebar);
 *  - barra superior com botão hambúrguer, visível apenas em celular;
 *  - área de conteúdo, onde a página da rota atual é renderizada (<Outlet />).
 * ------------------------------------------------------------------ */
export function AppLayout() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className={estilos.layout}>
      <Sidebar aberta={menuAberto} aoFechar={() => setMenuAberto(false)} />

      <div className={estilos.coluna}>
        <div className={estilos.barraCelular}>
          <button
            type="button"
            className={estilos.botaoMenu}
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <Icone nome="menu" />
          </button>
        </div>

        <main className={estilos.conteudo}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
