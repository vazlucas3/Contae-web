
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { contaService } from '@/services/contaService'
import { CAMINHOS } from '@/routes/caminhos'
import type { TipoConta } from '@/types'

export function NovaConta() {
  useTituloPagina('Nova conta')

  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<TipoConta>('CORRENTE')
  const [saldo, setSaldo] = useState('0,00')

  const [erroNome, setErroNome] = useState('')
  const [erroSaldo, setErroSaldo] = useState('')
  const [erroApi, setErroApi] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErroNome('')
    setErroSaldo('')
    setErroApi('')

    let formularioValido = true

    if (!nome.trim()) {
      setErroNome('Informe o nome da conta.')
      formularioValido = false
    } else if (nome.trim().length > 100) {
      setErroNome('O nome deve ter no máximo 100 caracteres.')
      formularioValido = false
    }

    const saldoNumerico = Number(
      saldo.trim().replace(/\./g, '').replace(',', '.')
    )

    if (!saldo.trim() || !Number.isFinite(saldoNumerico)) {
      setErroSaldo('Informe um saldo válido.')
      formularioValido = false
    } else if (saldoNumerico < 0) {
      setErroSaldo('O saldo não pode ser negativo.')
      formularioValido = false
    }

    if (!formularioValido) return

    try {
      setSalvando(true)

      await contaService.salvar({
        nome: nome.trim(),
        tipo,
        saldo: saldoNumerico,
      })

      navigate(CAMINHOS.contas, { replace: true })
    } catch (error) {
      setErroApi(
        error instanceof Error
          ? error.message
          : 'Não foi possível cadastrar a conta.'
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <section>
      <PageHeader
        titulo="Nova conta"
        subtitulo="Cadastre uma conta para controlar suas finanças."
      />

      <form
        onSubmit={salvar}
        style={{
          maxWidth: 600,
          padding: 24,
          borderRadius: 12,
          background: 'var(--superficie, #fff)',
        }}
      >
        {erroApi && (
          <div
            role="alert"
            style={{ color: '#dc2626', marginBottom: 20 }}
          >
            {erroApi}
          </div>
        )}

        <Input
          rotulo="Nome da conta"
          name="nome"
          placeholder="Ex.: Nubank, Banco do Brasil..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          erro={erroNome}
          maxLength={100}
        />

        <div style={{ marginTop: 20 }}>
          <label
            htmlFor="tipo"
            style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            Tipo de conta
          </label>

          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoConta)}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: 'var(--superficie, #fff)',
            }}
          >
            <option value="CORRENTE">Conta corrente</option>
            <option value="POUPANCA">Poupança</option>
            <option value="CARTEIRA">Carteira</option>
          </select>
        </div>

        <div style={{ marginTop: 20 }}>
          <Input
            rotulo="Saldo inicial (R$)"
            name="saldo"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={saldo}
            onChange={(e) => setSaldo(e.target.value)}
            erro={erroSaldo}
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 28,
            justifyContent: 'flex-end',
          }}
        >
          <Link to={CAMINHOS.contas}>
            <Button variante="secundario" disabled={salvando}>
              Cancelar
            </Button>
          </Link>

          <Button type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar conta'}
          </Button>
        </div>
      </form>
    </section>
  )
}
