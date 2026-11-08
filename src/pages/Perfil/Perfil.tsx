import { useState } from 'react'
import { AtSign, CalendarDays, Check, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react'
import { Aviso, Button, Card, Input, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { LIMITE_NOME, MINIMO_SENHA, usePerfil } from './usePerfil'
import estilos from './Perfil.module.css'

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  return (partes.length > 1 ? partes[0][0] + partes[partes.length - 1][0] : (partes[0] ?? '?').slice(0, 2)).toUpperCase()
}

function formatarData(data: string): string {
  const valor = new Date(data)
  if (Number.isNaN(valor.getTime())) return 'Data indisponível'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(valor)
}

export function Perfil() {
  useTituloPagina('Perfil')
  const { usuario, carregando, erroCarga, tentarNovamente, campos, erros, erroApi, sucesso, salvando, temAlteracoes, alterarCampo, restaurar, salvar } = usePerfil()
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const forcaSenha = campos.senha.length === 0 ? 0 : campos.senha.length < MINIMO_SENHA ? 1 : campos.senha.length < 10 ? 2 : 3

  if (carregando) return <><PageHeader titulo="Meu perfil" subtitulo="Gerencie suas informações pessoais e de acesso." /><Card><p className={estilos.mensagem}>Carregando seus dados...</p></Card></>

  if (erroCarga || !usuario) return <><PageHeader titulo="Meu perfil" subtitulo="Gerencie suas informações pessoais e de acesso." /><Aviso tipo="erro" acao={<Button variante="secundario" onClick={tentarNovamente}>Tentar novamente</Button>}>{erroCarga ?? 'Não foi possível carregar o perfil.'}</Aviso></>

  return (
    <>
      <PageHeader titulo="Meu perfil" subtitulo="Gerencie suas informações pessoais e de acesso." />
      {sucesso && <Aviso tipo="sucesso"><span className={estilos.avisoSucesso}><Check size={16} />{sucesso}</span></Aviso>}

      <div className={estilos.grade}>
        <div className={estilos.colunaPrincipal}>
          <Card className={estilos.cartaoIdentidade}>
            <div className={estilos.faixaIdentidade} />
            <div className={estilos.identidadeConteudo}>
              <div className={estilos.avatar} aria-label={`Iniciais de ${usuario.nome}`}>{iniciais(usuario.nome)}</div>
              <div className={estilos.identidadeTexto}>
                <span className={estilos.saudacao}>Sua conta Contaê</span>
                <h2>{usuario.nome}</h2>
                <p>{usuario.email}</p>
              </div>
              <span className={`${estilos.status} ${usuario.ativo ? estilos.ativo : estilos.inativo}`}><span />{usuario.ativo ? 'Conta ativa' : 'Conta inativa'}</span>
            </div>
            <div className={estilos.metadados}>
              <div><CalendarDays size={16} /><span>Membro desde</span><strong>{formatarData(usuario.dataCriacao)}</strong></div>
              <div><ShieldCheck size={16} /><span>Proteção da conta</span><strong>Acesso autenticado</strong></div>
            </div>
          </Card>

          <Card className={estilos.cartao}>
            <form className={estilos.formulario} onSubmit={salvar} noValidate>
              <div className={estilos.tituloSecao}>
                <span className={estilos.iconeSecao}><UserRound size={18} /></span>
                <div><h2>Dados pessoais</h2><p>Essas informações identificam sua conta.</p></div>
              </div>
              <Input rotulo="Nome completo" name="nome" autoComplete="name" placeholder="Como podemos chamar você?" value={campos.nome} onChange={(evento) => alterarCampo('nome', evento.target.value)} erro={erros.nome} maxLength={LIMITE_NOME} />
              <Input rotulo="E-mail" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" value={campos.email} onChange={(evento) => alterarCampo('email', evento.target.value)} erro={erros.email} />

              <div className={estilos.separador} />

              <div className={estilos.tituloSecao}>
                <span className={estilos.iconeSecao}><LockKeyhole size={18} /></span>
                <div><h2>Alterar senha</h2><p>Defina uma senha nova para sua conta.</p></div>
              </div>
              <div className={estilos.campoSenha}>
                <Input rotulo="Nova senha" name="senha" type={mostrarSenha ? 'text' : 'password'} placeholder={`Pelo menos ${MINIMO_SENHA} caracteres`} autoComplete="new-password" value={campos.senha} onChange={(evento) => alterarCampo('senha', evento.target.value)} erro={erros.senha} />
                <button type="button" className={estilos.botaoVisibilidade} onClick={() => setMostrarSenha((visivel) => !visivel)} aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}>{mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              {campos.senha && <div className={estilos.forcaSenha} aria-live="polite"><div className={estilos.barras}>{[1, 2, 3].map((nivel) => <span key={nivel} className={`${nivel <= forcaSenha ? estilos.barraAtiva : ''} ${nivel <= forcaSenha ? estilos[`nivel${forcaSenha}`] : ''}`} />)}</div><span>{forcaSenha === 1 ? 'Use pelo menos 6 caracteres' : forcaSenha === 2 ? 'Senha razoável' : 'Senha forte'}</span></div>}
              <p className={estilos.dica}><ShieldCheck size={14} /> A senha é necessária para salvar qualquer alteração do perfil.</p>

              {erroApi && <Aviso tipo="erro">{erroApi}</Aviso>}
              <div className={estilos.acoes}>
                {temAlteracoes && <Button variante="secundario" onClick={restaurar} disabled={salvando}>Descartar alterações</Button>}
                <Button type="submit" disabled={salvando || !temAlteracoes}>{salvando ? 'Salvando...' : 'Salvar alterações'}</Button>
              </div>
            </form>
          </Card>
        </div>

        <aside className={estilos.lateral}>
          <div className={estilos.destaque}>
            <span className={estilos.iconeDestaque}><ShieldCheck size={19} /></span>
            <h2>Seus dados protegidos</h2>
            <p>Suas informações financeiras são acessíveis somente pela sua conta autenticada.</p>
            <div className={estilos.seloSeguranca}><span /> Sessão segura</div>
          </div>
          <Card className={estilos.ajuda}>
            <span className={estilos.iconeAjuda}><AtSign size={17} /></span>
            <div><h2>Mantenha seu e-mail atualizado</h2><p>Ele identifica sua conta. Se você alterá-lo, será necessário entrar novamente com o novo endereço.</p></div>
          </Card>
        </aside>
      </div>
    </>
  )
}
