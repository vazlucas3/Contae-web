import simbolo from '@/assets/contae-simbolo.svg'
import estilos from './Logo.module.css'

/* Marca Contaê: um C de controle financeiro cruzado por uma linha ascendente. */
export function Logo({ tema = 'claro' }: { tema?: 'claro' | 'escuro' }) {
  return (
    <span className={`${estilos.logo} ${estilos[tema]}`}>
      <img className={estilos.simbolo} src={simbolo} alt="" width="36" height="36" />
      <span className={estilos.texto} data-logo-texto>Contaê</span>
    </span>
  )
}
