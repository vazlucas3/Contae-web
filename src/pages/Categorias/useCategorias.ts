import { useCallback, useEffect, useState } from 'react'
import { categoriaService, ErroApi } from '@/services'
import type { CategoriaResponse } from '@/types'


function mensagemDeErro(erro: unknown, padrao: string): string {
return erro instanceof ErroApi ? erro.message : padrao
}

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


const [tentativa, setTentativa] = useState(0)


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

return () => {
    cancelado = true
}
}, [tentativa])

const tentarNovamente = useCallback(() => {
setCarregando(true)
setTentativa((n) => n + 1)
}, [])

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