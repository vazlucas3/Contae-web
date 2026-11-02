import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { login, estaAutenticado } from '../../services/auth'
import { CAMINHOS } from '../../routes/caminhos'
import './Login.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar({ email, senha }: { email: string; senha: string }) {
  const erros: { email?: string; senha?: string } = {}
  if (!email.trim()) erros.email = 'O e-mail é obrigatório.'
  else if (!EMAIL_REGEX.test(email)) erros.email = 'Informe um e-mail válido.'
  if (!senha) erros.senha = 'A senha é obrigatória.'
  return erros
}

function Logo({ claro }: { claro?: boolean }) {
  return (
    <div className={`logo ${claro ? 'logo--claro' : ''}`}>
      <span className="logo__icone" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <span className="logo__texto">Contae</span>
    </div>
  )
}

function Ilustracao() {
  return (
    <svg className="login__ilustracao" viewBox="0 0 320 220" fill="none" stroke="var(--verde-menta)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="40" y="70" width="200" height="130" rx="18" />
      <path d="M40 100h200" opacity=".5" />
      <path d="M60 70V58a14 14 0 0 1 14-14h120a14 14 0 0 1 14 14v12" opacity=".5" />
      <rect x="180" y="125" width="76" height="40" rx="12" />
      <circle cx="202" cy="145" r="5" fill="var(--verde-menta)" />
      <path d="M200 40l40-30 28 20 40-34" />
      <path d="M294 6h14v14" />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '', lembrar: false })
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({})
  const [erroApi, setErroApi] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)

  // Se já estiver autenticado, redireciona para a tela inicial configurada em CAMINHOS.inicio ('/')
  if (estaAutenticado()) return <Navigate to={CAMINHOS.inicio} replace />

  function alterar(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    setErros((er) => ({ ...er, [name]: undefined }))
    setErroApi('')
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    const novosErros = validar(form)
    setErros(novosErros)
    if (Object.keys(novosErros).length) return

    setCarregando(true)
    setErroApi('')
    try {
      await login({ email: form.email.trim(), senha: form.senha })
      navigate(CAMINHOS.inicio, { replace: true })
    } catch (err: any) {
      setErroApi(err.message || 'Erro ao efetuar login. Verifique suas credenciais.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="login">
      <aside className="login__painel">
        <Logo claro />
        <h1 className="login__slogan">
          Sua vida financeira
          <br />
          <span>mais organizada.</span>
        </h1>
        <Ilustracao />
      </aside>

      <section className="login__conteudo">
        <form className="login__form" onSubmit={enviar} noValidate>
          <h2>Bem-vindo de volta!</h2>
          <p className="login__sub">Faça login para continuar.</p>

          {erroApi && (
            <div className="alerta" role="alert">{erroApi}</div>
          )}

          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email" name="email" type="email" autoComplete="email"
              placeholder="seu@email.com"
              value={form.email} onChange={alterar}
              aria-invalid={!!erros.email}
              aria-describedby={erros.email ? 'email-erro' : undefined}
            />
            {erros.email && <span id="email-erro" className="campo__erro">{erros.email}</span>}
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <div className="campo__senha">
              <input
                id="senha" name="senha" autoComplete="current-password"
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={form.senha} onChange={alterar}
                aria-invalid={!!erros.senha}
                aria-describedby={erros.senha ? 'senha-erro' : undefined}
              />
              <button
                type="button" className="campo__olho"
                onClick={() => setMostrarSenha((v) => !v)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {erros.senha && <span id="senha-erro" className="campo__erro">{erros.senha}</span>}
          </div>

          <div className="login__linha">
            <label className="check">
              <input type="checkbox" name="lembrar" checked={form.lembrar} onChange={alterar} />
              Lembrar de mim
            </label>
            <a href="#esqueci">Esqueceu a senha?</a>
          </div>

          <button type="submit" className="btn btn--primario" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="login__rodape">
            Não tem uma conta? <Link to={CAMINHOS.cadastro}>Cadastre-se</Link>
          </p>
        </form>
      </section>
    </main>
  )
}