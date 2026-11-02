import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { env } from '@/config/env'

/* ------------------------------------------------------------------
- CLIENTE HTTP (Axios)
- Responsabilidades:
-  - montar a URL a partir de env.apiUrl;
-  - gerenciar timeout de 60s (ideal para o Render "acordar");
-  - injetar o token Bearer automaticamente se disponível;
-  - converter respostas de erro da API em ErroApi (com status e message);
-  - disparar evento ou ação quando o token for rejeitado (401).
- ------------------------------------------------------------------ */

/** Evento disparado no window quando a API responde 401 com token enviado. */
export const EVENTO_NAO_AUTORIZADO = 'contae:nao-autorizado'

/** Erro lançado quando a API responde com status fora de 2xx. */
export class ErroApi extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ErroApi'
    this.status = status
  }
}

/* ------------------------------------------------------------------
- Configuração da Instância do Axios
- ------------------------------------------------------------------ */
export const api: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 60000, // 60 segundos para lidar com o "sleep" do plano gratuito do Render
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Callbacks injetados pelo AuthContext para gerenciar token e logout automático
let obterTokenFn: (() => string | null) | null = null
let aoExpirarSessaoFn: (() => void) | null = null

export function configurarSessaoHttp(config: {
  obterToken: () => string | null
  aoExpirarSessao: () => void
}) {
  obterTokenFn = config.obterToken
  aoExpirarSessaoFn = config.aoExpirarSessao
}

// Interceptador de Requisição: injeta o token Bearer se disponível
api.interceptors.request.use(
  (config) => {
    if (obterTokenFn) {
      const token = obterTokenFn()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptador de Resposta: trata erros globais (como 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const status = error.response?.status || 500
    let message = error.response?.data?.message || error.response?.data?.error || error.message || 'Erro inesperado na requisição.'

    if (error.code === 'ECONNABORTED') {
      message = 'O servidor demorou muito para responder (timeout de 60s). Tente novamente.'
    }

    // Trata erro 401 (Não autorizado / Sessão expirada) se o token foi enviado
    if (status === 401 && obterTokenFn && obterTokenFn()) {
      window.dispatchEvent(new Event(EVENTO_NAO_AUTORIZADO))
      if (aoExpirarSessaoFn) {
        aoExpirarSessaoFn()
      }
    }

    return Promise.reject(new ErroApi(status, message))
  }
)

/* ------------------------------------------------------------------
- Atalhos convenientes para métodos HTTP (retornam direto o corpo da resposta)
- ------------------------------------------------------------------ */
export const http = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.get<T>(url, config)
    return response.data
  },

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.post<T>(url, data, config)
    return response.data
  },

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.put<T>(url, data, config)
    return response.data
  },

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.patch<T>(url, data, config)
    return response.data
  },

  async delete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.delete<T>(url, config)
    return response.data
  },
}