// src/pages/Cadastro/useCadastro.ts
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CAMINHOS } from '@/routes/caminhos'
import { ErroApi, usuarioService } from '@/services'

/* ------------------------------------------------------------------
* useCadastro — regras do formulário de cadastro (fora do JSX).
*  - guarda os valores dos campos;
*  - valida (mesmas regras da API: nome até 150, e-mail válido, senha com mínimo de 6);
*  - cadastra na API e leva a pessoa para o login.
* ------------------------------------------------------------------ */
export const LIMITE_NOME = 150
export const MINIMO_SENHA = 6

interface Campos {
nome: string
email: string
senha: string
confirmarSenha: string
}

type Erros = Partial<Record<keyof Campos, string>>

const CAMPOS_VAZIOS: Campos = { nome: '', email: '', senha: '', confirmarSenha: '' }

/* Confere os campos e devolve um objeto só com os erros encontrados (vazio = tudo certo). */
function validar(campos: Campos): Erros {
const erros: Erros = {}

if (campos.nome === '') erros.nome = 'O nome é obrigatório.'
else if (campos.nome.length > LIMITE_NOME) erros.nome = `O nome deve ter no máximo ${LIMITE_NOME} caracteres.`

if (campos.email === '') erros.email = 'O e-mail é obrigatório.'
else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email)) erros.email = 'Informe um e-mail válido.'

if (campos.senha === '') erros.senha = 'A senha é obrigatória.'
else if (campos.senha.length < MINIMO_SENHA) erros.senha = `A senha deve ter no mínimo ${MINIMO_SENHA} caracteres.`

if (campos.confirmarSenha === '') erros.confirmarSenha = 'Confirme a senha.'
else if (campos.confirmarSenha !== campos.senha) erros.confirmarSenha = 'As senhas não são iguais.'

return erros
}

export function useCadastro() {
const navegar = useNavigate()

const [campos, setCampos] = useState<Campos>(CAMPOS_VAZIOS)
const [erros, setErros] = useState<Erros>({})
const [erroApi, setErroApi] = useState<string | null>(null)
const [salvando, setSalvando] = useState(false)

/* Atualiza um campo e limpa o erro dele enquanto a pessoa digita. */
function alterarCampo(campo: keyof Campos, valor: string) {
setCampos((atuais) => ({ ...atuais, [campo]: valor }))
if (erros[campo]) setErros((atuais) => ({ ...atuais, [campo]: undefined }))
}

/* Valida e envia o formulário. */
async function cadastrar(evento: FormEvent<HTMLFormElement>) {
evento.preventDefault()

const limpos: Campos = { ...campos, nome: campos.nome.trim(), email: campos.email.trim() }
const errosEncontrados = validar(limpos)
setErros(errosEncontrados)
if (Object.keys(errosEncontrados).length > 0) return

setSalvando(true)
setErroApi(null)

try {
    await usuarioService.cadastrar({ nome: limpos.nome, email: limpos.email, senha: limpos.senha })
    // Vai para o login levando uma mensagem de sucesso (a tela de Login pode exibi-la).
    navegar(CAMINHOS.login, { state: { mensagem: 'Conta criada com sucesso. Faça login para continuar.' } })
} catch (e) {
    setErroApi(e instanceof ErroApi ? e.message : 'Não foi possível criar a conta.')
    setSalvando(false)
}
}

return { campos, erros, erroApi, salvando, alterarCampo, cadastrar }
}