// src/pages/Inicio/useInicio.ts
import { useEffect, useState } from 'react'
import { categoriaService, contaService, ErroApi, movimentacaoService, usuarioService } from '@/services'
import type { CategoriaResponse, ContaResponse, MovimentacaoResponse } from '@/types'


export function useInicio() {
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [contas, setContas] = useState<ContaResponse[]>([])
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([])
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)


  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let cancelado = false

    Promise.all([
      usuarioService.listarTodos(),
      contaService.listar(),
      categoriaService.listar(),
      movimentacaoService.listar(),
    ])
      .then(([usuarios, listaContas, listaCategorias, listaMovimentacoes]) => {
        if (cancelado) return
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