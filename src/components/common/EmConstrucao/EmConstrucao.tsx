import { Card } from '../Card/Card'
import estilos from './EmConstrucao.module.css'

/* ------------------------------------------------------------------
 * EmConstrucao — aviso padrão das telas que ainda não foram implementadas.
 * O desenvolvedor responsável pela tela REMOVE este componente ao implementá-la.
 * "descricao" resume o que a tela deve ter (conforme o documento de design).
 * ------------------------------------------------------------------ */
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
