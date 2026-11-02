# Contae Web

Frontend do **Contae**, app de finanças pessoais. Este repositório contém a **estrutura inicial**: layout, rotas, camada de serviços, tipos e componentes compartilhados. As telas estão como esqueletos para que cada desenvolvedor implemente a sua sem reorganizar o projeto.

## 1. Objetivo

Fornecer uma base padronizada para o time trabalhar em paralelo: uma pasta por tela, rotas centralizadas, um único lugar para falar com a API (`services/`) e componentes reutilizáveis (`components/common/`).

## 2. Tecnologias

React 19 · Vite · TypeScript · React Router · CSS Modules · ESLint · npm.
Não há bibliotecas de HTTP, UI ou ícones: o cliente HTTP usa `fetch` e os ícones são SVG próprios (`Icone`). Adicione dependências só com necessidade e combinando com o time.

## 3. Instalação

Requer Node.js 20+ (testado com 22).

```bash
npm install
cp .env.example .env     # ajuste se necessário
```

## 4. Executar localmente

```bash
npm run dev              # http://localhost:5173
```

Para usar a API, suba a `contae-api` (porta 8080 por padrão). A API **não tem CORS**, então em desenvolvimento o Vite faz proxy: o frontend chama `/backend/...` e o Vite repassa para `VITE_API_PROXY_TARGET`. O prefixo existe porque as rotas da API (`/contas`, `/categorias`) colidem com as das telas.

## 5. Build de produção

```bash
npm run build            # type-check + build em dist/
npm run preview          # serve o build localmente
npm run lint             # verifica o código (lint:fix corrige o que der)
```

Em produção, defina `VITE_API_URL` com a URL real da API (que precisará liberar CORS) ou sirva as duas atrás de um proxy reverso.

## 6. Estrutura de pastas

```text
contae-web/
├── public/                  arquivos estáticos (favicon)
├── src/
│   ├── assets/              imagens e ilustrações importadas pelo código
│   ├── components/
│   │   ├── common/          componentes reutilizáveis (Button, Input, Card, CardResumo, Icone, Logo, PageHeader, EmConstrucao)
│   │   └── layout/          estrutura das telas (AppLayout, Sidebar, AuthLayout)
│   ├── pages/               UMA PASTA POR TELA (Login, Cadastro, Inicio, Movimentacoes, ...)
│   ├── routes/              caminhos.ts (endereços), router.tsx (rotas), RotaProtegida.tsx
│   ├── services/            toda comunicação com a API (cliente http + um serviço por recurso)
│   ├── hooks/               hooks reutilizáveis (useAuth, useTituloPagina)
│   ├── contexts/            estado global (sessão/autenticação)
│   ├── types/               tipos que espelham os DTOs da API
│   ├── utils/               funções puras (formatarMoeda, formatarData)
│   ├── styles/              variaveis.css (tokens de design) e base.css (reset/tipografia)
│   ├── config/              env.ts (único ponto que lê variáveis de ambiente)
│   ├── App.tsx              provedores + roteador
│   └── main.tsx             ponto de entrada
├── .env.example
├── eslint.config.js
├── tsconfig.json
└── vite.config.ts           alias "@" -> src e proxy da API
```

## 7. O que já está pronto e o que falta

| Pronto | A implementar (por tela) |
| --- | --- |
| Vite + React + TS + ESLint, scripts | Conteúdo de **todas** as telas (os esqueletos listam o que falta no comentário do topo de cada arquivo) |
| Rotas de todas as telas + 404 | Validação de formulários e chamadas aos serviços |
| Layouts: sidebar responsiva (completa / só ícones / gaveta) e painel dividido de login | Gráfico do dashboard, tabelas, paginação, filtros |
| Tokens de design e estilos globais | Cartão do usuário na sidebar e menu do avatar |
| Cliente HTTP com token JWT, tratamento de erros e 401 | Fluxo real de login (guardar token com `useAuth().entrar`) |
| Serviços e tipos de todos os endpoints existentes na API | Ícone de olho (mostrar senha) e seletor de cor, quando necessários |

## 8. Como trabalhar

### Criar uma nova página e registrar a rota

1. Crie `src/pages/Metas/Metas.tsx`:

```tsx
import { PageHeader } from '@/components/common'
import { useTituloPagina } from '@/hooks/useTituloPagina'

export function Metas() {
  useTituloPagina('Metas')
  return <PageHeader titulo="Metas" />
}
```

2. Em `src/routes/caminhos.ts`, adicione `metas: '/metas'`.
3. Em `src/routes/router.tsx`, dentro do grupo das telas internas, adicione `{ path: CAMINHOS.metas, element: <Metas /> }` (e o `import`).
4. Para aparecer no menu, adicione uma linha em `ITENS_MENU` no `Sidebar.tsx`.

### Criar um componente

- **Reutilizável por várias telas** → `src/components/common/NomeDoComponente/` com `NomeDoComponente.tsx` e `NomeDoComponente.module.css`, exportado em `components/common/index.ts`. Veja `Button` e `CardResumo` como modelo.
- **Usado só por uma tela** → dentro da pasta da página, em `pages/<Tela>/components/`. Se outra tela passar a usá-lo, mova para `common`.

### Integrar com a API

- Use sempre os serviços: `import { contaService } from '@/services'`. **Componentes não chamam `fetch` diretamente.**
- Novo endpoint? Adicione a função no serviço do recurso e o tipo em `src/types/`.
- Erros chegam como `ErroApi` (com `status` e a `message` devolvida pela API):

```tsx
try {
  await contaService.salvar({ nome, tipo: 'CORRENTE', saldo: 0 })
} catch (erro) {
  if (erro instanceof ErroApi) setMensagem(erro.message)
}
```

- Regras de cálculo (totais, saldo por categoria) ficam em `utils/`, não dentro do JSX.

### Login

Enquanto a tela de login não existe, `VITE_EXIGIR_LOGIN=false` deixa navegar nas telas internas. Quem implementar o login deve usar `authService.login`, `useAuth().entrar(token)` e então mudar a variável para `true`.

## 9. Padrões de código

- **Idioma:** nomes, comentários e textos da interface em português.
- **Arquivos e componentes:** `PascalCase` para componentes (`CardResumo.tsx`) e seus CSS (`CardResumo.module.css`); `camelCase` para funções, hooks (`useAlgo`), serviços (`contaService.ts`) e variáveis.
- **Um componente por arquivo**, com responsabilidade única. Se passar de ~150 linhas, divida.
- **Estilos:** CSS Modules por componente; cores e medidas sempre via variáveis de `styles/variaveis.css`.
- **Rotas:** nunca escreva caminhos soltos; use `CAMINHOS`.
- **Imports:** use o alias `@/` (ex.: `@/components/common`).
- **Tipos:** sem `any`; contratos da API ficam em `src/types`.
- **Acessibilidade:** `label` em todo input (o `Input` já faz isso), `aria-label` em botões só com ícone, nunca usar só a cor para indicar Receita/Despesa (mantenha o texto e o sinal `-`).
- **Comentários:** explique o *propósito* de cada bloco, como nos arquivos existentes.
- **Antes de abrir PR:** `npm run lint` e `npm run build` sem erros.

## 10. Lacunas entre o design e a API (alinhar com o time da API)

| Design | API atual |
| --- | --- |
| Categoria com **tipo** (Receita/Despesa) e **cor** | `CategoriaResponseDTO` tem só `id`, `nome`, `usuarioId` |
| Tipo de conta **Cartão** | `TipoConta`: `CORRENTE`, `POUPANCA`, `CARTEIRA` |
| Editar conta e categoria | Só existem listar, buscar, criar e excluir |
| Dashboard e relatório com totais | Sem endpoints agregados: calcular no frontend |
| Filtros combinados (período, tipo, recorrentes, busca) | Filtros por rota, um de cada vez (data, categoria ou conta) |
| Perfil e saudação com o nome do usuário logado | O token só carrega o e-mail e não existe `GET /me` |
| "Meta do mês" no dashboard | Sem endpoint nem entidade |
| "Esqueceu a senha?" | Sem endpoint |
