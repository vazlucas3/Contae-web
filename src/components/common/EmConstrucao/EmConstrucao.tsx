import { Card } from '../Card/Card'
import estilos from './EmConstrucao.module.css'

interface EmConstrucaoProps {
  descricao: string
}

export function EmConstrucao({ descricao }: EmConstrucaoProps) {
  return (
    <Card className={estilos.aviso}>
      <p className={estilos.titulo}>Tela em construção</p>
      <p className={estilos.descricao}>{descricao}</p>
    </Card>
  )
}
