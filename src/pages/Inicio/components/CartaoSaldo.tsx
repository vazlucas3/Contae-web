// src/pages/Inicio/components/CartaoSaldo.tsx
import { formatarMoeda } from '@/utils/formatadores'
import estilos from './CartaoSaldo.module.css'

/* ------------------------------------------------------------------
* CartaoSaldo — cartão de destaque no topo da Início (fundo verde escuro).
* Mostra o saldo cadastrado nas contas e o resultado do mês.
* ------------------------------------------------------------------ */
interface CartaoSaldoProps {
saldoContas: number
quantidadeContas: number
resultadoMes: number
}

export function CartaoSaldo({ saldoContas, quantidadeContas, resultadoMes }: CartaoSaldoProps) {
const positivo = resultadoMes >= 0
const textoContas = quantidadeContas === 1 ? '1 conta' : `${quantidadeContas} contas`

return (
<section className={estilos.cartao} aria-label="Saldo">
    <div>
    <p className={estilos.rotulo}>Saldo nas contas</p>
    <p className={estilos.valor}>{formatarMoeda(saldoContas)}</p>
    <p className={estilos.detalhe}>{textoContas}</p>
    </div>

    <div className={estilos.mes}>
    <p className={estilos.rotulo}>Resultado do mês</p>
    <p className={`${estilos.resultado} ${positivo ? estilos.positivo : estilos.negativo}`}>
        {positivo ? '+' : '−'} {formatarMoeda(Math.abs(resultadoMes))}
    </p>
    <p className={estilos.detalhe}>receitas − despesas</p>
    </div>
</section>
)
}