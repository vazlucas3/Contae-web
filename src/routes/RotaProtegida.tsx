import { Navigate, Outlet } from 'react-router-dom'
import { env } from '@/config/env'
import { useAuth } from '@/hooks/useAuth'
import { CAMINHOS } from './caminhos'


export function RotaProtegida() {
  const { autenticado } = useAuth()

  if (env.exigirLogin && !autenticado) {
    return <Navigate to={CAMINHOS.login} replace />
  }

  return <Outlet />
}
