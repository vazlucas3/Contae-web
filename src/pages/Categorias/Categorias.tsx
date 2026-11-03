import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Aviso, Button, Card, Input, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { CAMINHOS } from '@/routes/caminhos'
import type { CategoriaResponse } from '@/types'
import { TabelaCategorias } from './components/TabelaCategorias'
import { filtrarEOrdenar } from './filtrarCategorias'
import { useCategorias } from './useCategorias'
import estilos from './Categorias.module.css'

/* ------------------------------------------------------------------
 * PÁGINA: Categorias  (rota: /categorias)  — seção 4.9 do documento de design.
 *
 * ETAPA 1: listagem com carregando / erro / vazio e exclusão com confirmação.
 * ETAPA 2: tela "Nova categoria" (formulário com validação e salvar).
 * MELHORIAS: lista ordenada de A a Z, busca por nome, mensagem de sucesso
 * (ao criar e ao excluir) e aviso claro ao excluir categoria em uso.
 * Tipo e Cor ficam de fora: a API guarda só o nome da categoria.
 * ------------------------------------------------------------------ */

/* Lê a mensagem enviada pela tela "Nova categoria" (via navigate(..., { state })). */
function lerMensagem(estado: unknown): string | null {
  if (typeof estado === 'object' && estado !== null && 'mensagem' in estado && typeof estado.mensagem === 'string') {
    return estado.mensagem
  }
  return null
}

export function Categorias() {
  useTituloPagina('Categorias')

  const navegar = useNavigate()
  const location = useLocation()
  const { categorias, carregando, erro, tentarNovamente, excluir } = useCategorias()

  const [busca, setBusca] = useState('')
  const [mensagem, setMensagem] = useState<string | null>(() => lerMensagem(location.state))

  /* Limpa a mensagem guardada no histórico, para ela não reaparecer ao recarregar a página (F5). */
  useEffect(() => {
    if (location.state) navegar(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navegar])

  /* Esconde a mensagem de sucesso depois de alguns segundos. */
  useEffect(() => {
    if (!mensagem) return
    const temporizador = setTimeout(() => setMensagem(null), 4000)
    return () => clearTimeout(temporizador)
  }, [mensagem])

  /* Lista que aparece na tabela: filtrada pela busca e ordenada de A a Z. */
  const categoriasVisiveis = useMemo(() => filtrarEOrdenar(categorias, busca), [categorias, busca])

  /* Pede confirmação antes de excluir e avisa quando der certo. */
  async function aoExcluir(categoria: CategoriaResponse) {
    if (!window.confirm(`Excluir a categoria "${categoria.nome}"?`)) return

    setMensagem(null)
    if (await excluir(categoria.id)) setMensagem('Categoria excluída com sucesso.')
  }

  return (
    <>
      <PageHeader
        titulo="Categorias"
        acao={<Button onClick={() => navegar(CAMINHOS.novaCategoria)}>+ Nova categoria</Button>}
      />

      {/* Mensagem de sucesso (criou ou excluiu) */}
      {mensagem && <Aviso tipo="sucesso">{mensagem}</Aviso>}

      {/* Mensagem de erro (carregar ou excluir) */}
      {erro && (
        <Aviso
          tipo="erro"
          acao={
            <Button variante="secundario" onClick={tentarNovamente}>
              Tentar novamente
            </Button>
          }
        >
          {erro}
        </Aviso>
      )}

      {/* Estados da lista: carregando, vazia ou com dados */}
      {carregando ? (
        <Card>
          <p className={estilos.mensagem}>Carregando categorias...</p>
        </Card>
      ) : categorias.length === 0 && !erro ? (
        <Card>
          <p className={estilos.mensagem}>Nenhuma categoria cadastrada ainda.</p>
        </Card>
      ) : (
        <>
          {/* Busca por nome (só aparece quando há categorias) */}
          {categorias.length > 0 && (
            <div className={estilos.busca}>
              <Input
                rotulo="Buscar categoria"
                type="search"
                placeholder="Buscar categoria..."
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
              />
            </div>
          )}

          {categoriasVisiveis.length === 0 && categorias.length > 0 ? (
            <Card>
              <p className={estilos.mensagem}>Nenhuma categoria encontrada para "{busca.trim()}".</p>
            </Card>
          ) : (
            <TabelaCategorias categorias={categoriasVisiveis} aoExcluir={aoExcluir} />
          )}
        </>
      )}
    </>
  )
}