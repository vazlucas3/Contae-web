import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthProvider'
import { router } from '@/routes/router'

/* Componente raiz: provedores globais + roteador. Evite colocar lógica aqui. */
export  default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
