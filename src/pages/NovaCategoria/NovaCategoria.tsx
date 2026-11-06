import { Button, Card, Input } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { LIMITE_NOME, useNovaCategoria } from './useNovaCategoria'
import estilos from './NovaCategoria.module.css'

/* ------------------------------------------------------------------
 * PÁGINA: Nova categoria  (rota: /categorias/nova) — seção 4.10 do documento de design.
 *
 * ETAPA 2 (pronta): formulário com o campo Nome, validação e salvar na API.
 * Próxima etapa:
 *  - ETAPA 3: campos Tipo (Receita/Despesa) e Cor (bolinhas) — dependem da API.
 * ------------------------------------------------------------------ */
export function NovaCategoria() {
  useTituloPagina('Nova categoria')

  const { nome, erroNome, erroApi, salvando, alterarNome, salvar, cancelar } = useNovaCategoria()

  return (
    <>
      {/* Cabeçalho: seta de voltar + título */}
      <header className={estilos.cabecalho}>
        <button type="button" className={estilos.voltar} onClick={cancelar} aria-label="Voltar para categorias">
          ←
        </button>
        <h1>Nova categoria</h1>
      </header>

      <Card className={estilos.cartao}>
        <form className={estilos.formulario} onSubmit={salvar} noValidate>
          <Input
            rotulo="Nome da categoria"
            placeholder="Ex: Alimentação"
            value={nome}
            onChange={(evento) => alterarNome(evento.target.value)}
            erro={erroNome}
            maxLength={LIMITE_NOME}
            autoFocus
          />

          {/* Erro vindo da API (ex.: servidor fora do ar) */}
          {erroApi && (
            <p className={estilos.erroApi} role="alert">
              {erroApi}
            </p>
          )}

          <div className={estilos.botoes}>
            <Button variante="secundario" onClick={cancelar} disabled={salvando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}