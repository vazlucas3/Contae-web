import { EmConstrucao, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'

/* ------------------------------------------------------------------
 * PÁGINA: Nova categoria  (rota: /categorias/nova)
 * STATUS: esqueleto — seção 4.10 do documento de design.
 *
 * O que falta implementar:
 *  - campo Nome (máx. 100 caracteres) e botões Cancelar/Salvar;
 *  - salvar com categoriaService.salvar(...).
 * Atenção: Tipo e Cor (seletor de bolinhas) ainda não existem na API.
 * ------------------------------------------------------------------ */
export function NovaCategoria() {
  useTituloPagina('Nova categoria')

  return (
    <>
      <PageHeader titulo="Nova categoria" />
      <EmConstrucao descricao="Formulário de nova categoria." />
    </>
  )
}
