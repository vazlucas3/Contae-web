import { Outlet, useLocation } from 'react-router-dom'
import { Logo } from '@/components/common'
import { CAMINHOS } from '@/routes/caminhos'
import estilos from './AuthLayout.module.css'

export function AuthLayout() {
  const { pathname } = useLocation()
  const ehCadastro = pathname === CAMINHOS.cadastro

  return (
    <div className={estilos.layout}>
      <section className={estilos.painelMarca}>
        <Logo tema="escuro" />
        <p className={estilos.slogan}>
          {ehCadastro ? (
            'Organize suas finanças e conquiste seus objetivos.'
          ) : (
            <>
              Sua vida financeira <strong>mais organizada.</strong>
            </>
          )}
        </p>
      </section>

      <main className={estilos.painelFormulario}>
        <div className={estilos.formulario}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
