import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout/AuthLayout'
import Login from '@/pages/Login/Login'
import { Cadastro } from '@/pages/Cadastro/Cadastro'
import { Inicio } from '@/pages/Inicio/Inicio'
import { Movimentacoes } from '@/pages/Movimentacoes/Movimentacoes'
import { Relatorio } from '@/pages/Relatorio/Relatorio'
import { Contas } from '@/pages/Contas/Contas'
import { NovaConta } from '@/pages/NovaConta/NovaConta'
import { Categorias } from '@/pages/Categorias/Categorias'
import { NovaCategoria } from '@/pages/NovaCategoria/NovaCategoria'
import { Perfil } from '@/pages/Perfil/Perfil'
import { NaoEncontrada } from '@/pages/NaoEncontrada/NaoEncontrada'
import { CAMINHOS } from './caminhos'
import { RotaProtegida } from './RotaProtegida'


export const router = createBrowserRouter([
 
  {
    element: <AuthLayout />,
    children: [
      { path: CAMINHOS.login, element: <Login /> },
      { path: CAMINHOS.cadastro, element: <Cadastro /> },
    ],
  },

  
  {
    element: <RotaProtegida />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: CAMINHOS.inicio, element: <Inicio /> },
          { path: CAMINHOS.movimentacoes, element: <Movimentacoes /> },
          { path: CAMINHOS.relatorio, element: <Relatorio /> },
          { path: CAMINHOS.contas, element: <Contas /> },
          { path: CAMINHOS.novaConta, element: <NovaConta /> },
          { path: CAMINHOS.categorias, element: <Categorias /> },
          { path: CAMINHOS.novaCategoria, element: <NovaCategoria /> },
          { path: CAMINHOS.perfil, element: <Perfil /> },
        ],
      },
    ],
  },


  { path: '*', element: <NaoEncontrada /> },
])
