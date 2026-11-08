import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Icone } from '@/components/common'
import { Sidebar } from '../Sidebar/Sidebar'
import estilos from './AppLayout.module.css'

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
