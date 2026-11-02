import { Link } from 'react-router-dom'
import { EmConstrucao } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { CAMINHOS } from '@/routes/caminhos'

/* ------------------------------------------------------------------
 * PÁGINA: Cadastro  (rota: /cadastro)
 * STATUS: esqueleto — implementar conforme a seção 4.2 do documento de design.
 *
 * O que falta implementar:
 *  - seta de voltar, campos Nome, E-mail, Senha (mín. 6 caracteres) e Confirmar senha;
 *  - validações: nome obrigatório, e-mail válido, senhas iguais;
 *  - chamar usuarioService.cadastrar(...) e redirecionar para o login.
 * ------------------------------------------------------------------ */
export function Cadastro() {
  useTituloPagina('Cadastro')

  return (
    <>
      <h1>Criar conta</h1>
      <p style={{ color: 'var(--texto-suave)', margin: '4px 0 24px' }}>Preencha os dados para começar.</p>

      <EmConstrucao descricao="Formulário de cadastro a implementar." />

      <p style={{ marginTop: 24, textAlign: 'center' }}>
        Já tem uma conta? <Link to={CAMINHOS.login}>Faça login</Link>
      </p>
    </>
  )
}
