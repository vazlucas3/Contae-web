
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, Button } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { CAMINHOS } from '@/routes/caminhos'
import { contaService } from '@/services/contaService'
import type { ContaResponse } from '@/types'

const moeda = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)

const tipoConta = (tipo: ContaResponse['tipo']) => {
  const tipos = {
    CORRENTE: 'Conta corrente',
    POUPANCA: 'Poupança',
    CARTEIRA: 'Carteira',
  }

  return tipos[tipo]
}

export function Contas() {
  useTituloPagina('Contas')

  const [contas, setContas] = useState<ContaResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [excluindo, setExcluindo] = useState<number | null>(null)

  const carregarContas = useCallback(async () => {
    try {
      setErro('')
      setCarregando(true)

      const resposta = await contaService.listar()
      setContas(resposta)
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar as contas.'
      )
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregarContas()
  }, [carregarContas])

  async function excluirConta(conta: ContaResponse) {
    const confirmar = window.confirm(
      `Deseja realmente excluir a conta "${conta.nome}"?`
    )

    if (!confirmar) return

    try {
      setExcluindo(conta.id)
      setErro('')

      await contaService.excluir(conta.id)

      setContas((lista) =>
        lista.filter((item) => item.id !== conta.id)
      )
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir a conta.'
      )
    } finally {
      setExcluindo(null)
    }
  }

  const saldoTotal = contas.reduce(
    (total, conta) => total + Number(conta.saldo),
    0
  )

  return (
    <section>
      <PageHeader
        titulo="Contas"
        subtitulo="Gerencie suas contas e acompanhe seus saldos."
        acao={
          <Link to={CAMINHOS.novaConta}>
            <Button>+ Nova conta</Button>
          </Link>
        }
      />

      {erro && (
        <div role="alert" style={{ color: '#dc2626', marginBottom: 16 }}>
          {erro}
        </div>
      )}

      {!carregando && contas.length > 0 && (
        <div
          style={{
            padding: 20,
            borderRadius: 12,
            background: 'var(--superficie, #fff)',
            marginBottom: 24,
          }}
        >
          <p style={{ margin: 0, color: 'var(--texto-suave)' }}>
            Saldo total das contas
          </p>

          <h2 style={{ margin: '8px 0 0' }}>
            {moeda(saldoTotal)}
          </h2>
        </div>
      )}

      {carregando ? (
        <p>Carregando contas...</p>
      ) : contas.length === 0 && !erro ? (
        <div style={{ padding: 32, textAlign: 'center' }}>
          <h3>Nenhuma conta cadastrada</h3>
          <p>Comece adicionando sua primeira conta.</p>

          <Link to={CAMINHOS.novaConta}>
            <Button>Adicionar conta</Button>
          </Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'var(--superficie, #fff)',
            }}
          >
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: 14 }}>Nome</th>
                <th style={{ padding: 14 }}>Tipo</th>
                <th style={{ padding: 14 }}>Saldo</th>
                <th style={{ padding: 14 }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {contas.map((conta) => (
                <tr
                  key={conta.id}
                  style={{ borderTop: '1px solid #e5e7eb' }}
                >
                  <td style={{ padding: 14 }}>{conta.nome}</td>

                  <td style={{ padding: 14 }}>
                    {tipoConta(conta.tipo)}
                  </td>

                  <td style={{ padding: 14 }}>
                    {moeda(Number(conta.saldo))}
                  </td>

                  <td style={{ padding: 14 }}>
                    <Button
                      variante="secundario"
                      disabled={excluindo === conta.id}
                      onClick={() => excluirConta(conta)}
                    >
                      {excluindo === conta.id
                        ? 'Excluindo...'
                        : 'Excluir'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

