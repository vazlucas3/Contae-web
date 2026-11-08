import { env } from '@/config/env'
import type { RespostaErroApi } from '@/types'
import { armazenamentoToken } from './armazenamentoToken'


export const EVENTO_NAO_AUTORIZADO = 'contae:nao-autorizado'

export class ErroApi extends Error {
  readonly status: number

  constructor(status: number, mensagem: string) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

interface OpcoesRequisicao {
  metodo: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  corpo?: unknown
  
  autenticada?: boolean
}

async function requisicao<T>(caminho: string, opcoes: OpcoesRequisicao): Promise<T> {
  const { metodo, corpo, autenticada = true } = opcoes

  const cabecalhos: Record<string, string> = { Accept: 'application/json' }
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json'

  const token = autenticada ? armazenamentoToken.obter() : null
  if (token) cabecalhos.Authorization = `Bearer ${token}`

  let resposta: Response
  try {
    resposta = await fetch(`${env.apiUrl}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    })
  } catch {
    throw new ErroApi(0, 'Não foi possível conectar ao servidor. Verifique sua conexão.')
  }

  if (!resposta.ok) {
    if (resposta.status === 401 && token) {
      window.dispatchEvent(new Event(EVENTO_NAO_AUTORIZADO))
    }
    const erro = (await resposta.json().catch(() => null)) as Partial<RespostaErroApi> | null
    throw new ErroApi(resposta.status, erro?.message ?? 'Erro inesperado ao falar com o servidor.')
  }


  const texto = await resposta.text()
  return (texto ? JSON.parse(texto) : undefined) as T
}

export const http = {
  get: <T>(caminho: string) => requisicao<T>(caminho, { metodo: 'GET' }),
  post: <T>(caminho: string, corpo?: unknown, autenticada = true) =>
    requisicao<T>(caminho, { metodo: 'POST', corpo, autenticada }),
  put: <T>(caminho: string, corpo?: unknown) => requisicao<T>(caminho, { metodo: 'PUT', corpo }),
  patch: <T>(caminho: string, corpo?: unknown) => requisicao<T>(caminho, { metodo: 'PATCH', corpo }),
  delete: <T = void>(caminho: string) => requisicao<T>(caminho, { metodo: 'DELETE' }),
}
