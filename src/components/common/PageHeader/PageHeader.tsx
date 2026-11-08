import type { ReactNode } from 'react'
import estilos from './PageHeader.module.css'

interface PageHeaderProps {
  titulo: string
  subtitulo?: string
  acao?: ReactNode
}

export function PageHeader({ titulo, subtitulo, acao }: PageHeaderProps) {
  return (
    <header className={estilos.cabecalho}>
      <div>
        <h1>{titulo}</h1>
        {subtitulo && <p className={estilos.subtitulo}>{subtitulo}</p>}
      </div>
      {acao && <div className={estilos.acao}>{acao}</div>}
    </header>
  )
}
