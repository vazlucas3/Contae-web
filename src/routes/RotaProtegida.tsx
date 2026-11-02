import { Navigate, Outlet } from 'react-router-dom'
import { env } from '@/config/env'
import { useAuth } from '@/hooks/useAuth'
import { CAMINHOS } from './caminhos'

/* ------------------------------------------------------------------
 * RotaProtegida
 * Envolve as telas internas. Só redireciona para o login quando
 * VITE_EXIGIR_LOGIN=true (veja .env.example), para que a estrutura
 * possa ser navegada antes de a tela de login existir.
 * ------------------------------------------------------------------ */
export function RotaProtegida() {
  const { autenticado } = useAuth()

  if (env.exigirLogin && !autenticado) {
    return <Navigate to={CAMINHOS.login} replace />
  }

  return <Outlet />
}
