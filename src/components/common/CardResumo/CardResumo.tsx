import type { ReactNode } from 'react'
import { Card } from '../Card/Card'
import estilos from './CardResumo.module.css'

interface CardResumoProps {
  rotulo: string
  valor: string
  icone: ReactNode
  corIcone?: string
  tom?: 'neutro' | 'receita' | 'despesa'
}

export function CardResumo({ rotulo, valor, icone, corIcone = 'var(--verde-primario)', tom = 'neutro' }: CardResumoProps) {
  return (
    <Card className={estilos.resumo}>
      <span className={estilos.icone} style={{ color: corIcone }}>
        {icone}
      </span>
      <div>
        <p className={estilos.rotulo}>{rotulo}</p>
        <p className={`${estilos.valor} ${estilos[tom]}`}>{valor}</p>
      </div>
    </Card>
  )
}
