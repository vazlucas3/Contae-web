import { useEffect } from 'react'

/** Define o título da aba do navegador: useTituloPagina('Contas') -> "Contas | Contae" */
export function useTituloPagina(titulo: string) {
  useEffect(() => {
    document.title = `${titulo} | Contae`
  }, [titulo])
}
