import type { ReactNode } from 'react'
import { Card } from '../Card/Card'
import estilos from './CardResumo.module.css'

/* ------------------------------------------------------------------
 * CardResumo — card de resumo do dashboard e do relatório:
 * ícone colorido em quadrado arredondado + rótulo + valor grande.
 * O valor já chega formatado (use formatarMoeda de '@/utils/formatadores').
 *  tom "receita" -> valor verde | "despesa" -> valor vermelho | "neutro" -> texto padrão
 * ------------------------------------------------------------------ */
interface CardResumoProps {
  rotulo: string
  valor: string
  icone: ReactNode
  /** Cor do quadrado do ícone, ex.: 'var(--azul)'. */
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
