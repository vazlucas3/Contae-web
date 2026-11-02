import { Link } from 'react-router-dom'
import { EmConstrucao, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { CAMINHOS } from '@/routes/caminhos'

/* ------------------------------------------------------------------
 * PÁGINA: Categorias  (rota: /categorias)
 * STATUS: esqueleto — seção 4.9 do documento de design.
 *
 * O que falta implementar:
 *  - tabela Nome · Tipo · Cor · Ações e exclusão com confirmação.
 * Atenção: a API (CategoriaResponseDTO) só devolve id, nome e usuarioId — não há
 * "tipo" nem "cor". Alinhar com o time da API antes de exibir essas colunas.
 * ------------------------------------------------------------------ */
export function Categorias() {
  useTituloPagina('Categorias')

  return (
    <>
      <PageHeader titulo="Categorias" acao={<Link to={CAMINHOS.novaCategoria}>+ Nova categoria</Link>} />
      <EmConstrucao descricao="Listagem de categorias." />
    </>
  )
}
