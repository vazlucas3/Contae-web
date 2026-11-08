
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Aviso, Button, Input } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { CAMINHOS } from '@/routes/caminhos'
import { LIMITE_NOME, MINIMO_SENHA, useCadastro } from './useCadastro'
import estilos from './Cadastro.module.css'

export function Cadastro() {
  useTituloPagina('Cadastro')

  const navegar = useNavigate()
  const { campos, erros, erroApi, salvando, alterarCampo, cadastrar } = useCadastro()

  const [mostrarSenha, setMostrarSenha] = useState(false)
  const tipoSenha = mostrarSenha ? 'text' : 'password'

  return (
    <>

      <header className={estilos.cabecalho}>
        <button
          type="button"
          className={estilos.voltar}
          onClick={() => navegar(CAMINHOS.login)}
          aria-label="Voltar para o login"
        >
          ←
        </button>
        <div>
          <h1>Criar conta</h1>
          <p className={estilos.subtitulo}>Preencha os dados para começar.</p>
        </div>
      </header>

      <form className={estilos.formulario} onSubmit={cadastrar} noValidate>
        <Input
          rotulo="Nome"
          placeholder="Seu nome completo"
          autoComplete="name"
          value={campos.nome}
          onChange={(evento) => alterarCampo('nome', evento.target.value)}
          erro={erros.nome}
          maxLength={LIMITE_NOME}
          autoFocus
        />

        <Input
          rotulo="E-mail"
          type="email"
          placeholder="voce@email.com"
          autoComplete="email"
          value={campos.email}
          onChange={(evento) => alterarCampo('email', evento.target.value)}
          erro={erros.email}
        />

        <Input
          rotulo="Senha"
          type={tipoSenha}
          placeholder={`Mínimo de ${MINIMO_SENHA} caracteres`}
          autoComplete="new-password"
          value={campos.senha}
          onChange={(evento) => alterarCampo('senha', evento.target.value)}
          erro={erros.senha}
        />

        <Input
          rotulo="Confirmar senha"
          type={tipoSenha}
          placeholder="Repita a senha"
          autoComplete="new-password"
          value={campos.confirmarSenha}
          onChange={(evento) => alterarCampo('confirmarSenha', evento.target.value)}
          erro={erros.confirmarSenha}
        />

        <label className={estilos.mostrarSenha}>
          <input type="checkbox" checked={mostrarSenha} onChange={(evento) => setMostrarSenha(evento.target.checked)} />
          Mostrar senhas
        </label>

        {/* Erro vindo da API (ex.: e-mail já cadastrado ou servidor fora do ar) */}
        {erroApi && <Aviso tipo="erro">{erroApi}</Aviso>}

        <Button type="submit" larguraTotal disabled={salvando}>
          {salvando ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <p className={estilos.rodape}>
        Já tem uma conta? <Link to={CAMINHOS.login}>Faça login</Link>
      </p>
    </>
  )
}