// src/pages/Inicio/components/GraficoSemana.tsx
import { Card } from '@/components/common'
import { formatarMoeda } from '@/utils/formatadores'
import type { DiaResumo } from '../components/calcularResumo'
import estilos from './GraficoSemana.module.css'

/* ------------------------------------------------------------------
* GraficoSemana — barras de receitas (verde) e despesas (vermelho) por dia.
* Desenhado em SVG puro, sem biblioteca. As medidas ficam nas constantes abaixo.
* ------------------------------------------------------------------ */
const LARGURA = 640
const ALTURA = 200
const BASE = 170 // linha onde as barras "nascem"
const TOPO = 12 // espaço livre acima da barra mais alta
const LARGURA_BARRA = 20
const FOLGA_ENTRE_BARRAS = 4

interface GraficoSemanaProps {
dias: DiaResumo[]
}

export function GraficoSemana({ dias }: GraficoSemanaProps) {
const maior = Math.max(...dias.flatMap((dia) => [dia.receitas, dia.despesas]))
const semDados = maior === 0

// Converte um valor em altura de barra (em pixels do SVG).
const altura = (valor: number) => (semDados ? 0 : (valor / maior) * (BASE - TOPO))

const larguraColuna = LARGURA / dias.length
const descricao = `Receitas e despesas dos últimos ${dias.length} dias`

return (
<Card>
    <div className={estilos.topo}>
    <h2>Últimos {dias.length} dias</h2>
    <ul className={estilos.legenda}>
        <li>
        <span className={`${estilos.marca} ${estilos.marcaReceita}`} /> Receitas
        </li>
        <li>
        <span className={`${estilos.marca} ${estilos.marcaDespesa}`} /> Despesas
        </li>
    </ul>
    </div>

    {semDados ? (
    <p className={estilos.vazio}>Sem movimentações nos últimos {dias.length} dias.</p>
    ) : (
    <div className={estilos.rolagem}>
        <svg className={estilos.grafico} viewBox={`0 0 ${LARGURA} ${ALTURA}`} role="img" aria-label={descricao}>
        <line className={estilos.linhaBase} x1="0" x2={LARGURA} y1={BASE} y2={BASE} />

        {dias.map((dia, indice) => {
            const centro = larguraColuna * indice + larguraColuna / 2
            const alturaReceita = altura(dia.receitas)
            const alturaDespesa = altura(dia.despesas)

            return (
            <g key={dia.data}>
                <title>
                {`${dia.rotulo} — receitas ${formatarMoeda(dia.receitas)}, despesas ${formatarMoeda(dia.despesas)}`}
                </title>
                <rect
                className={estilos.barraReceita}
                x={centro - LARGURA_BARRA - FOLGA_ENTRE_BARRAS / 2}
                y={BASE - alturaReceita}
                width={LARGURA_BARRA}
                height={alturaReceita}
                rx="4"
                />
                <rect
                className={estilos.barraDespesa}
                x={centro + FOLGA_ENTRE_BARRAS / 2}
                y={BASE - alturaDespesa}
                width={LARGURA_BARRA}
                height={alturaDespesa}
                rx="4"
                />
                <text className={estilos.rotulo} x={centro} y={BASE + 22} textAnchor="middle">
                {dia.rotulo}
                </text>
            </g>
            )
        })}
        </svg>
    </div>
    )}
</Card>
)
}