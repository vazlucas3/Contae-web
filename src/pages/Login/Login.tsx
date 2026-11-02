import { Link } from 'react-router-dom'
import { EmConstrucao } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { CAMINHOS } from '@/routes/caminhos'

/* ------------------------------------------------------------------
 * PÁGINA: Login  (rota: /login)
 * STATUS: esqueleto — implementar conforme a seção 4.1 do documento de design.
 *
 * O que falta implementar:
 *  - campos E-mail e Senha (com botão de mostrar/ocultar) e validação;
 *  - "Lembrar de mim" e link "Esqueceu a senha?";
 *  - chamar authService.login(...) e, em caso de sucesso, useAuth().entrar(token)
 *    e navegar para CAMINHOS.inicio.
 * Depois de pronto, mude VITE_EXIGIR_LOGIN para "true" no .env.
 * ------------------------------------------------------------------ */
export function Login() {
  useTituloPagina('Login')

  return (
    <>
      <h1>Bem-vindo de volta!</h1>
      <p style={{ color: 'var(--texto-suave)', margin: '4px 0 24px' }}>Faça login para continuar.</p>

      <EmConstrucao descricao="Formulário de login a implementar." />

      <p style={{ marginTop: 24, textAlign: 'center' }}>
        Não tem uma conta? <Link to={CAMINHOS.cadastro}>Cadastre-se</Link>
      </p>
    </>
  )
}
