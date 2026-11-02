import { EmConstrucao, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'

/* ------------------------------------------------------------------
 * PÁGINA: Perfil  (rota: /perfil)
 * STATUS: esqueleto — seções 4.11 e 4.12 do documento de design.
 *
 * O que falta implementar:
 *  - avatar, nome, e-mail, campos Nome/E-mail/Senha e "Salvar alterações";
 *  - cartão do usuário no topo da Sidebar (4.12).
 * Atenção: o token JWT só carrega o e-mail e a API não tem "GET /me". Para carregar
 * os dados do usuário logado é preciso combinar uma solução com o time da API.
 * ------------------------------------------------------------------ */
export function Perfil() {
  useTituloPagina('Perfil')

  return (
    <>
      <PageHeader titulo="Meu perfil" />
      <EmConstrucao descricao="Dados do usuário e alteração de senha." />
    </>
  )
}
