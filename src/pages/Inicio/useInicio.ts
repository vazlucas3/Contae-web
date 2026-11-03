// src/pages/Inicio/useInicio.ts
import { useEffect, useState } from 'react'
import { categoriaService, contaService, ErroApi, movimentacaoService, usuarioService } from '@/services'
import type { CategoriaResponse, ContaResponse, MovimentacaoResponse } from '@/types'

/* ------------------------------------------------------------------
* useInicio — busca os dados da tela Início (fora do JSX).
*  - usuário logado (saudação);
*  - contas, categorias e movimentações (os cálculos ficam em calcularResumo.ts).
* As quatro buscas acontecem ao mesmo tempo.
* ------------------------------------------------------------------ */
export function useInicio() {
const [nomeUsuario, setNomeUsuario] = useState('')
const [contas, setContas] = useState<ContaResponse[]>([])
const [categorias, setCategorias] = useState<CategoriaResponse[]>([])
const [movimentacoes, setMovimentacoes] = useState<MovimentacaoResponse[]>([])
const [carregando, setCarregando] = useState(true)
const [erro, setErro] = useState<string | null>(null)

// Cada mudança neste contador dispara uma nova busca (botão "Tentar novamente").
const [tentativa, setTentativa] = useState(0)

useEffect(() => {
let cancelado = false

Promise.all([
    usuarioService.listarTodos(),
    contaService.listar(),
    categoriaService.listar(),
    movimentacaoService.buscarTodas(),
])
    .then(([usuarios, listaContas, listaCategorias, listaMovimentacoes]) => {
    if (cancelado) return
    // A API devolve só o usuário logado.
    setNomeUsuario(usuarios[0]?.nome ?? '')
    setContas(listaContas)
    setCategorias(listaCategorias)
    setMovimentacoes(listaMovimentacoes)
    setErro(null)
    })
    .catch((e) => {
    if (cancelado) return
    setErro(e instanceof ErroApi ? e.message : 'Não foi possível carregar os dados.')
    })
    .finally(() => {
    if (!cancelado) setCarregando(false)
    })

// Evita atualizar a tela se ela for fechada durante a busca.
return () => {
    cancelado = true
}
}, [tentativa])

function tentarNovamente() {
setCarregando(true)
setTentativa((n) => n + 1)
}

return { nomeUsuario, contas, categorias, movimentacoes, carregando, erro, tentarNovamente }
}