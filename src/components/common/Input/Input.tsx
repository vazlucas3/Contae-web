import { useId, type InputHTMLAttributes } from 'react'
import estilos from './Input.module.css'

/* ------------------------------------------------------------------
 * Input — campo de texto com <label> sempre associado (acessibilidade)
 * e área para mensagem de erro de validação.
 * Aceita todos os atributos nativos de <input> (type, placeholder, value...).
 * ------------------------------------------------------------------ */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string
  erro?: string
}

export function Input({ rotulo, erro, id, className, ...resto }: InputProps) {
  const idGerado = useId()
  const idCampo = id ?? idGerado
  const idErro = `${idCampo}-erro`

  return (
    <div className={estilos.grupo}>
      <label htmlFor={idCampo} className={estilos.rotulo}>
        {rotulo}
      </label>
      <input
        id={idCampo}
        className={[estilos.campo, erro ? estilos.comErro : '', className ?? ''].filter(Boolean).join(' ')}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        {...resto}
      />
      {erro && (
        <p id={idErro} className={estilos.erro} role="alert">
          {erro}
        </p>
      )}
    </div>
  )
}
