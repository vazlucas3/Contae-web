import estilos from './Logo.module.css'

/* Logo — quadrado verde arredondado com check + texto "Contae".
 * tema "escuro": texto branco (para fundos escuros) | "claro": texto escuro. */
export function Logo({ tema = 'claro' }: { tema?: 'claro' | 'escuro' }) {
  return (
    <span className={`${estilos.logo} ${estilos[tema]}`}>
      <svg className={estilos.simbolo} width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="var(--verde-primario)" />
        <path
          d="M9 16.5l4.5 4.5L23 11.5"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={estilos.texto} data-logo-texto>Contae</span>
    </span>
  )
}
