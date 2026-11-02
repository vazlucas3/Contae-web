import type { ReactNode } from 'react'
import estilos from './PageHeader.module.css'

/* ------------------------------------------------------------------
 * PageHeader — cabeçalho de página: título (e subtítulo) à esquerda,
 * ação primária à direita (ex.: <Button>+ Nova movimentação</Button>).
 * ------------------------------------------------------------------ */
interface PageHeaderProps {
  titulo: string
  subtitulo?: string
  /** Slot da ação primária (opcional). */
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
