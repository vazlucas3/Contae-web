
import type { ReactNode } from 'react'
import estilos from './Aviso.module.css'


interface AvisoProps {
tipo: 'sucesso' | 'erro'
children: ReactNode
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