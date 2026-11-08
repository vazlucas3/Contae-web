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

function formatarData(data: string): string {
  const valor = new Date(data)
  if (Number.isNaN(valor.getTime())) return 'Data não disponível'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(valor)
}

export function Perfil() {
  useTituloPagina('Perfil')

  const { usuario, carregando, erroCarga, tentarNovamente, campos, erros, erroApi, sucesso, salvando, alterarCampo, salvar } =
    usePerfil()

  // Alterna entre senha escondida (••••) e visível.
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const forcaSenha =
    campos.senha.length === 0 ? 0 : campos.senha.length < MINIMO_SENHA ? 1 : campos.senha.length < 10 ? 2 : 3

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

      <div className={estilos.grade}>
        <Card className={estilos.cartao}>
          <div className={estilos.cabecalhoPerfil}>
            <div className={estilos.identidade}>
              <div className={estilos.avatar} aria-hidden="true">
                {iniciais(usuario.nome)}
              </div>
              <div>
                <p className={estilos.nome}>{usuario.nome}</p>
                <p className={estilos.email}>{usuario.email}</p>
              </div>
            </div>
            <span className={`${estilos.status} ${usuario.ativo ? estilos.ativo : estilos.inativo}`}>
              <span aria-hidden="true" />
              {usuario.ativo ? 'Conta ativa' : 'Conta inativa'}
            </span>
          </div>

          <div className={estilos.resumo}>
            <div>
              <span className={estilos.rotuloResumo}>Membro desde</span>
              <strong>{formatarData(usuario.dataCriacao)}</strong>
            </div>
            <div>
              <span className={estilos.rotuloResumo}>Segurança</span>
              <strong>Senha protegida</strong>
            </div>
          </div>

          <div className={estilos.divisor} />

          <form className={estilos.formulario} onSubmit={salvar} noValidate>
            <div className={estilos.tituloSecao}>
              <h2>Dados pessoais</h2>
              <p>Atualize as informações usadas na sua conta.</p>
            </div>

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

            <div className={estilos.tituloSecao}>
              <h2>Segurança</h2>
              <p>Troque sua senha para manter o acesso protegido.</p>
            </div>

            <Input
              rotulo="Nova senha"
              type={mostrarSenha ? 'text' : 'password'}
              placeholder={`Mínimo de ${MINIMO_SENHA} caracteres`}
              autoComplete="new-password"
              value={campos.senha}
              onChange={(evento) => alterarCampo('senha', evento.target.value)}
              erro={erros.senha}
            />
            {campos.senha && (
              <div className={estilos.forcaSenha} aria-live="polite">
                <div className={estilos.barras}>
                  {[1, 2, 3].map((nivel) => (
                    <span key={nivel} className={nivel <= forcaSenha ? estilos.barraAtiva : ''} />
                  ))}
                </div>
                <span>{forcaSenha === 1 ? 'Senha curta' : forcaSenha === 2 ? 'Senha razoável' : 'Senha forte'}</span>
              </div>
            )}
            <p className={estilos.dica}>A senha é obrigatória para confirmar qualquer alteração.</p>

            <label className={estilos.mostrarSenha}>
              <input type="checkbox" checked={mostrarSenha} onChange={(evento) => setMostrarSenha(evento.target.checked)} />
              Mostrar senha
            </label>

            {erroApi && <Aviso tipo="erro">{erroApi}</Aviso>}

            <div className={estilos.botoes}>
              <Button type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </form>
        </Card>

        <aside className={estilos.lateral}>
          <div className={estilos.destaque}>
            <span className={estilos.iconeDestaque} aria-hidden="true">✓</span>
            <h2>Conta organizada</h2>
            <p>Seus dados ficam vinculados ao seu usuário e protegidos pelo acesso autenticado.</p>
          </div>
          <div className={estilos.ajuda}>
            <span>Precisa de ajuda?</span>
            <p>Use um e-mail que você acessa para receber futuras comunicações da sua conta.</p>
          </div>
        </aside>
      </div>
    </>
  )
}