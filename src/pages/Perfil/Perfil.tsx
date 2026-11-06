import { useState } from 'react'
import { Aviso, Button, Card, Input, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { LIMITE_NOME, MINIMO_SENHA, usePerfil } from './usePerfil'
import estilos from './Perfil.module.css'

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  const letras = partes.length > 1 ? partes[0][0] + partes[partes.length - 1][0] : (partes[0] ?? '?').slice(0, 2)
  return letras.toUpperCase()
}

export function Perfil() {
  useTituloPagina('Perfil')

  const { usuario, carregando, erroCarga, tentarNovamente, campos, erros, erroApi, sucesso, salvando, alterarCampo, salvar } =
    usePerfil()

  // Alterna entre senha escondida (••••) e visível.
  const [mostrarSenha, setMostrarSenha] = useState(false)

  if (carregando) {
    return (
      <>
        <PageHeader titulo="Meu perfil" />
        <Card>
          <p className={estilos.mensagem}>Carregando...</p>
        </Card>
      </>
    )
  }

  if (erroCarga || !usuario) {
    return (
      <>
        <PageHeader titulo="Meu perfil" />
        <Aviso
          tipo="erro"
          acao={
            <Button variante="secundario" onClick={tentarNovamente}>
              Tentar novamente
            </Button>
          }
        >
          {erroCarga ?? 'Não foi possível carregar o perfil.'}
        </Aviso>
      </>
    )
  }

  return (
    <>
      <PageHeader titulo="Meu perfil" subtitulo="Veja e atualize seus dados." />

      {sucesso && <Aviso tipo="sucesso">{sucesso}</Aviso>}

      <Card className={estilos.cartao}>
        {/* Avatar + dados atuais */}
        <div className={estilos.identidade}>
          <div className={estilos.avatar} aria-hidden="true">
            {iniciais(usuario.nome)}
          </div>
          <div>
            <p className={estilos.nome}>{usuario.nome}</p>
            <p className={estilos.email}>{usuario.email}</p>
          </div>
        </div>

        <form className={estilos.formulario} onSubmit={salvar} noValidate>
          <Input
            rotulo="Nome"
            autoComplete="name"
            value={campos.nome}
            onChange={(evento) => alterarCampo('nome', evento.target.value)}
            erro={erros.nome}
            maxLength={LIMITE_NOME}
          />

          <Input
            rotulo="E-mail"
            type="email"
            autoComplete="email"
            value={campos.email}
            onChange={(evento) => alterarCampo('email', evento.target.value)}
            erro={erros.email}
          />

          <Input
            rotulo="Senha"
            type={mostrarSenha ? 'text' : 'password'}
            placeholder={`Mínimo de ${MINIMO_SENHA} caracteres`}
            autoComplete="new-password"
            value={campos.senha}
            onChange={(evento) => alterarCampo('senha', evento.target.value)}
            erro={erros.senha}
          />
          <p className={estilos.dica}>Digite sua senha atual para mantê-la, ou uma nova para trocá-la.</p>

          <label className={estilos.mostrarSenha}>
            <input type="checkbox" checked={mostrarSenha} onChange={(evento) => setMostrarSenha(evento.target.checked)} />
            Mostrar senha
          </label>

          {/* Erro vindo da API (ex.: e-mail já em uso ou servidor fora do ar) */}
          {erroApi && <Aviso tipo="erro">{erroApi}</Aviso>}

          <div className={estilos.botoes}>
            <Button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}