import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { CAMINHOS } from '@/routes/caminhos'
import { ErroApi, usuarioService } from '@/services'
import type { UsuarioResponse } from '@/types'

export const LIMITE_NOME = 150
export const MINIMO_SENHA = 6

interface Campos {
nome: string
email: string
senha: string
}

type Erros = Partial<Record<keyof Campos, string>>

function validar(campos: Campos): Erros {
const erros: Erros = {}

if (campos.nome === '') erros.nome = 'O nome é obrigatório.'
else if (campos.nome.length > LIMITE_NOME) erros.nome = `O nome deve ter no máximo ${LIMITE_NOME} caracteres.`

if (campos.email === '') erros.email = 'O e-mail é obrigatório.'
else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email)) erros.email = 'Informe um e-mail válido.'

if (campos.senha === '') erros.senha = 'Informe a nova senha para salvar.'
else if (campos.senha.length < MINIMO_SENHA) erros.senha = `A senha deve ter no mínimo ${MINIMO_SENHA} caracteres.`

return erros
}

export function usePerfil() {
const navegar = useNavigate()
const { sair } = useAuth()

const [usuario, setUsuario] = useState<UsuarioResponse | null>(null)
const [carregando, setCarregando] = useState(true)
const [erroCarga, setErroCarga] = useState<string | null>(null)
const [tentativa, setTentativa] = useState(0) 

const [campos, setCampos] = useState<Campos>({ nome: '', email: '', senha: '' })
const [erros, setErros] = useState<Erros>({})
const [erroApi, setErroApi] = useState<string | null>(null)
const [sucesso, setSucesso] = useState<string | null>(null)
const [salvando, setSalvando] = useState(false)

useEffect(() => {
let cancelado = false

usuarioService
    .listarTodos()
    .then((lista) => {
    if (cancelado) return
    const logado = lista[0]
    if (!logado) {
        setErroCarga('Não foi possível encontrar os dados do usuário.')
        return
    }
    setUsuario(logado)
    setCampos({ nome: logado.nome, email: logado.email, senha: '' })
    setErroCarga(null)
    })
    .catch((e) => {
    if (!cancelado) setErroCarga(e instanceof ErroApi ? e.message : 'Não foi possível carregar o perfil.')
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

function alterarCampo(campo: keyof Campos, valor: string) {
setCampos((atuais) => ({ ...atuais, [campo]: valor }))
if (erros[campo]) setErros((atuais) => ({ ...atuais, [campo]: undefined }))
setSucesso(null)
}

async function salvar(evento: FormEvent<HTMLFormElement>) {
evento.preventDefault()
if (!usuario) return

const limpos: Campos = { ...campos, nome: campos.nome.trim(), email: campos.email.trim() }
const errosEncontrados = validar(limpos)
setErros(errosEncontrados)
if (Object.keys(errosEncontrados).length > 0) return

setSalvando(true)
setErroApi(null)
setSucesso(null)

try {
    const atualizado = await usuarioService.atualizar(usuario.id, limpos)

    if (atualizado.email !== usuario.email) {
    sair()
    navegar(CAMINHOS.login, {
        state: { mensagem: 'E-mail alterado com sucesso. Faça login novamente.' },
    })
    return
    }

    setUsuario(atualizado)
    setCampos({ nome: atualizado.nome, email: atualizado.email, senha: '' })
    setSucesso('Alterações salvas com sucesso.')
} catch (e) {
    setErroApi(e instanceof ErroApi ? e.message : 'Não foi possível salvar as alterações.')
} finally {
    setSalvando(false)
}
}

return { usuario, carregando, erroCarga, tentarNovamente, campos, erros, erroApi, sucesso, salvando, alterarCampo, salvar }
}