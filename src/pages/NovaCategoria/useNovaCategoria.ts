import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CAMINHOS } from '@/routes/caminhos'
import { categoriaService, ErroApi } from '@/services'

/* ------------------------------------------------------------------
* useNovaCategoria — regras do formulário "Nova categoria" (fora do JSX).
*  - guarda o valor do campo Nome;
*  - valida (obrigatório, máximo de 100 caracteres, igual à API);
*  - salva na API e volta para a listagem.
* ------------------------------------------------------------------ */
export const LIMITE_NOME = 100

/* Devolve a mensagem de erro do nome, ou undefined se estiver válido. */
function validarNome(nome: string): string | undefined {
if (nome === '') return 'O nome da categoria é obrigatório.'
if (nome.length > LIMITE_NOME) return `O nome deve ter no máximo ${LIMITE_NOME} caracteres.`
return undefined
}

export function useNovaCategoria() {
const navegar = useNavigate()

const [nome, setNome] = useState('')
const [erroNome, setErroNome] = useState<string | undefined>()
const [erroApi, setErroApi] = useState<string | null>(null)
const [salvando, setSalvando] = useState(false)

/* Atualiza o campo e limpa o erro de validação enquanto a pessoa digita. */
function alterarNome(valor: string) {
setNome(valor)
if (erroNome) setErroNome(undefined)
}

/* Valida e envia o formulário. */
async function salvar(evento: FormEvent<HTMLFormElement>) {
evento.preventDefault()

const nomeLimpo = nome.trim()
const mensagem = validarNome(nomeLimpo)
setErroNome(mensagem)
if (mensagem) return

setSalvando(true)
setErroApi(null)

try {
    await categoriaService.salvar({ nome: nomeLimpo })
    // Volta para a lista levando uma mensagem de sucesso (a página Categorias a exibe).
    navegar(CAMINHOS.categorias, { state: { mensagem: 'Categoria criada com sucesso.' } })
} catch (e) {
    setErroApi(e instanceof ErroApi ? e.message : 'Não foi possível salvar a categoria.')
    setSalvando(false)
}
}

/* Volta para a listagem sem salvar. */
function cancelar() {
navegar(CAMINHOS.categorias)
}

return { nome, erroNome, erroApi, salvando, alterarNome, salvar, cancelar }
}