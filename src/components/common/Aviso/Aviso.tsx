
import type { ReactNode } from 'react'
import estilos from './Aviso.module.css'

/* ------------------------------------------------------------------
* Aviso — faixa de mensagem no topo de uma tela.
*  tipo "sucesso": confirmação de uma ação (ex.: "Categoria criada com sucesso.")
*  tipo "erro"   : falha (ex.: servidor fora do ar), com "acao" opcional (ex.: botão)
* Leitores de tela: o erro é anunciado como alerta e o sucesso como status.
* ------------------------------------------------------------------ */
interface AvisoProps {
tipo: 'sucesso' | 'erro'
children: ReactNode
/** Elemento opcional à direita, como um botão "Tentar novamente". */
acao?: ReactNode
}

export function Aviso({ tipo, children, acao }: AvisoProps) {
return (
<div className={`${estilos.aviso} ${estilos[tipo]}`} role={tipo === 'erro' ? 'alert' : 'status'}>
    <span>{children}</span>
    {acao}
</div>
)
}