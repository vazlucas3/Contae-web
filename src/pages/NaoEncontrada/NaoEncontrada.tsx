import { Link } from 'react-router-dom'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { CAMINHOS } from '@/routes/caminhos'
import estilos from './NaoEncontrada.module.css'

/* PÁGINA: 404 — exibida para qualquer endereço sem rota registrada. */
export function NaoEncontrada() {
  useTituloPagina('Página não encontrada')

  return (
    <main className={estilos.pagina}>
      <p className={estilos.codigo}>404</p>
      <h1>Página não encontrada</h1>
      <p className={estilos.texto}>O endereço acessado não existe ou foi movido.</p>
      <Link to={CAMINHOS.inicio}>Voltar para o início</Link>
    </main>
  )
}
