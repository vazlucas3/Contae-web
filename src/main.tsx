import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Estilos globais (tokens primeiro, depois reset/tipografia)
import './styles/variaveis.css'
import './styles/base.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
