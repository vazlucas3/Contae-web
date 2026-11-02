import type { HTMLAttributes } from 'react'
import estilos from './Card.module.css'

/* Card — superfície branca com borda, raio e sombra suave. Base para blocos de conteúdo. */
export function Card({ className, ...resto }: HTMLAttributes<HTMLDivElement>) {
  return <div className={[estilos.card, className ?? ''].filter(Boolean).join(' ')} {...resto} />
}
