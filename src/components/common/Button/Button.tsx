import type { ButtonHTMLAttributes } from 'react'
import estilos from './Button.module.css'

/* ------------------------------------------------------------------
 * Button — botão padrão do sistema.
 *  variante "primario"   : fundo verde, texto branco (ação principal)
 *  variante "secundario" : fundo branco com borda (Cancelar/Limpar)
 * Aceita todos os atributos nativos de <button>.
 * ------------------------------------------------------------------ */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario'
  larguraTotal?: boolean
}

export function Button({
  variante = 'primario',
  larguraTotal = false,
  className,
  type = 'button',
  ...resto
}: ButtonProps) {
  const classes = [estilos.botao, estilos[variante], larguraTotal ? estilos.total : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return <button type={type} className={classes} {...resto} />
}
