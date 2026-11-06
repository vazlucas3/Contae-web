import { useCallback, useEffect, useState } from 'react'
import { categoriaService, ErroApi } from '@/services'
import type { CategoriaResponse } from '@/types'

/* ------------------------------------------------------------------
* useCategorias — regras de dados da tela de Categorias (fora do JSX).
*  - carrega a lista na API ao abrir a tela;
*  - expõe estados de carregando e erro;
*  - exclui uma categoria e atualiza a lista local.
* ------------------------------------------------------------------ */
function mensagemDeErro(erro: unknown, padrao: string): string {
return erro instanceof ErroApi ? erro.message : padrao
}

/* Mensagem ao falhar na exclusão.
* Quando a categoria já foi usada em uma movimentação, a API responde 500 sem explicar o motivo.
* Como esse é o motivo mais comum, o front avisa isso. (Erros 4xx trazem a mensagem da própria API.) */
function mensagemAoExcluir(erro: unknown): string {
if (erro instanceof ErroApi && erro.status >= 500) {
return 'Não foi possível excluir: a categoria pode estar em uso em movimentações.'
}
return mensagemDeErro(erro, 'Não foi possível excluir a categoria.')
}

export function useCategorias() {
const [categorias, setCategorias] = useState<CategoriaResponse[]>([])
const [carregando, setCarregando] = useState(true)
const [erro, setErro] = useState<string | null>(null)

// Cada mudança neste contador dispara uma nova busca (usado por "Tentar novamente").
const [tentativa, setTentativa] = useState(0)

/* Busca as categorias na API ao abrir a tela e a cada nova tentativa. */
useEffect(() => {
let cancelado = false

categoriaService
    .listar()
    .then((lista) => {
    if (cancelado) return
    setCategorias(lista)
    setErro(null)
    })
    .catch((e) => {
    if (!cancelado) setErro(mensagemDeErro(e, 'Não foi possível carregar as categorias.'))
    })
    .finally(() => {
    if (!cancelado) setCarregando(false)
    })

// Evita atualizar o estado se a tela for fechada durante a busca.
return () => {
    cancelado = true
}
}, [tentativa])

/* Tenta de novo depois de um erro (botão "Tentar novamente"). */
const tentarNovamente = useCallback(() => {
setCarregando(true)
setTentativa((n) => n + 1)
}, [])

/* Exclui na API e remove da lista, sem precisar recarregar tudo.
* Devolve true se excluiu, para a tela poder mostrar a mensagem de sucesso. */
const excluir = useCallback(async (id: number): Promise<boolean> => {
try {
    await categoriaService.excluir(id)
    setCategorias((lista) => lista.filter((categoria) => categoria.id !== id))
    setErro(null)
    return true
} catch (e) {
    setErro(mensagemAoExcluir(e))
    return false
}
}, [])

return { categorias, carregando, erro, tentarNovamente, excluir }
}