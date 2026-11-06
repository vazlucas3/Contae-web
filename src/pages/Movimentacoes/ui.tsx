import type { ReactNode, SelectHTMLAttributes } from 'react'

/* Junta classes ignorando valores falsos */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/* Classes reutilizadas — cores do documento de contexto do Contae */
const foco = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E8A5F]'

export const estilos = {
  botaoPrimario: cx(
    'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-[18px]',
    'bg-[#0E8A5F] text-sm font-semibold text-white transition-colors hover:bg-[#0B7350]',
    'disabled:cursor-not-allowed disabled:opacity-60',
    foco,
  ),
  botaoSecundario: cx(
    'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-[18px]',
    'border border-[#E3EAEC] bg-white text-sm font-semibold text-[#0B2E2A] transition-colors',
    'hover:border-[#CBD6D9] hover:bg-[#F4F8FA] disabled:cursor-not-allowed disabled:opacity-60',
    foco,
  ),
  botaoLink: cx('rounded text-sm font-semibold text-[#0E8A5F] hover:underline', foco),
  botaoIcone: cx('inline-grid size-[34px] place-items-center rounded-lg transition-colors', foco),
  input: cx(
    'h-10 w-full rounded-lg border border-[#E3EAEC] bg-white px-3 text-sm text-[#0B2E2A]',
    'placeholder:text-[#6B7C79] transition hover:border-[#CBD6D9]',
    'focus:border-[#0E8A5F] focus:outline-none focus:ring-[3px] focus:ring-[#0E8A5F]/15',
    'aria-[invalid=true]:border-[#E5383B] aria-[invalid=true]:focus:ring-[#E5383B]/15',
  ),
  label: 'text-[13px] font-medium text-[#6B7C79]',
  erro: 'text-xs text-[#C42B2E]',
  card: 'rounded-[14px] border border-[#E3EAEC] bg-white p-4 shadow-[0_2px_8px_rgba(5,46,42,0.06)] sm:p-6',
  tituloCard: 'text-base font-semibold text-[#0B2E2A]',
}

/* ---------- Ícones (traço fino, estilo Lucide) ----------
   Se o projeto já usa lucide-react, dá para trocar por ele. */
const caminhos = {
  mais: <><path d="M5 12h14" /><path d="M12 5v14" /></>,
  busca: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  lapis: <><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></>,
  lixeira: <><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></>,
  fechar: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  anterior: <path d="m15 18-6-6 6-6" />,
  proxima: <path d="m9 18 6-6-6-6" />,
  abaixo: <path d="m6 9 6 6 6-6" />,
  sobe: <><path d="M22 7 13.5 15.5 8.5 10.5 2 17" /><path d="M16 7h6v6" /></>,
  desce: <><path d="M22 17 13.5 8.5 8.5 13.5 2 7" /><path d="M16 17h6v-6" /></>,
  carteira: <><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></>,
  caixa: <><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  alerta: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></>,
}

export type NomeIcone = keyof typeof caminhos

export function Icone({ nome, className = 'size-[18px]' }: { nome: NomeIcone; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {caminhos[nome]}
    </svg>
  )
}

/* ---------- Campo: label + controle + mensagem de erro ---------- */
interface CampoProps {
  id: string
  rotulo: string
  erro?: string
  className?: string
  children: ReactNode
}

export function Campo({ id, rotulo, erro, className, children }: CampoProps) {
  return (
    <div className={cx('flex min-w-0 flex-col gap-1.5', className)}>
      <label htmlFor={id} className={estilos.label}>{rotulo}</label>
      {children}
      {erro && <p id={`${id}-erro`} className={estilos.erro}>{erro}</p>}
    </div>
  )
}

/* ---------- Select com seta no estilo do Contae ---------- */
export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={cx(estilos.input, 'cursor-pointer appearance-none pr-9', className)}>
        {children}
      </select>
      <Icone
        nome="abaixo"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6B7C79]"
      />
    </div>
  )
}

/* ---------- Seletor segmentado (Todos / Receitas / Despesas) ---------- */
export interface OpcaoSegmentada<T extends string> {
  valor: T
  rotulo: string
  // classe da cor do texto quando selecionado
  classeAtiva?: string
}

interface SeletorSegmentadoProps<T extends string> {
  nome: string
  legenda: string
  valor: T
  opcoes: OpcaoSegmentada<T>[]
  onChange: (valor: T) => void
  className?: string
}

export function SeletorSegmentado<T extends string>({
  nome, legenda, valor, opcoes, onChange, className,
}: SeletorSegmentadoProps<T>) {
  return (
    <fieldset className={cx('flex min-w-0 flex-col', className)}>
      <legend className={cx(estilos.label, 'mb-1.5')}>{legenda}</legend>
      <div className="flex h-10 gap-0.5 rounded-lg border border-[#E3EAEC] bg-[#F4F8FA] p-[3px]">
        {opcoes.map((opcao) => (
          <label key={opcao.valor} className="flex-1">
            <input
              type="radio"
              name={nome}
              value={opcao.valor}
              checked={valor === opcao.valor}
              onChange={() => onChange(opcao.valor)}
              className="peer sr-only"
            />
            <span
              className={cx(
                'flex h-full cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-3.5',
                'text-sm font-medium text-[#6B7C79] transition-colors hover:text-[#0B2E2A]',
                'peer-checked:bg-white peer-checked:font-semibold peer-checked:shadow-[0_1px_3px_rgba(5,46,42,0.12)]',
                'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[#0E8A5F]',
                opcao.classeAtiva ?? 'peer-checked:text-[#0B2E2A]',
              )}
            >
              {opcao.rotulo}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
