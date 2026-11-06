# ContaÊ — Front-end

Front-end do ContaÊ, aplicação de gestão financeira pessoal. Esta versão preserva a estrutura original do projeto e a tela de **Movimentações**, integrada à camada de serviços e às rotas existentes.

## Tecnologias

- React e TypeScript
- Vite
- Tailwind CSS 3
- CSS Modules e tokens de design em `src/styles/variaveis.css`
- React Router
- Axios
- ESLint

## Pré-requisitos

- Node.js 20 ou superior (recomendado Node.js 22)
- npm
- Back-end ContaÊ disponível para testar operações reais da API

## Instalação

Na pasta raiz do front-end, execute:

```bash
npm install
```

Crie seu arquivo de ambiente local a partir do modelo:

```bash
cp .env.example .env.local
```

<<<<<<< HEAD
Para usar a API, suba a `contae-api` (porta 8080 por padrão). A API **não tem CORS**, então em desenvolvimento o Vite sempre faz proxy: o frontend chama `/backend/...` e o Vite repassa para `VITE_API_PROXY_TARGET` ou, se essa variável não existir, para `VITE_API_URL`. Sem nenhuma das duas, usa `http://localhost:8080`. O prefixo existe porque as rotas da API (`/contas`, `/categorias`) colidem com as das telas.
=======
No Windows PowerShell, use:
>>>>>>> b8ba0e0 (feat: salvando alterações locais antes do rebase)

```powershell
Copy-Item .env.example .env.local
```

Ajuste as variáveis conforme o ambiente. Não publique arquivos `.env*` com configurações locais ou credenciais.

## Configuração da API

O modelo `.env.example` utiliza:

- `VITE_API_URL=/backend`: endereço base utilizado pelo front-end em desenvolvimento.
- `VITE_API_PROXY_TARGET=http://localhost:8080`: endereço local do back-end para o proxy do Vite.
- `VITE_EXIGIR_LOGIN=false`: permite acessar as telas internas sem exigir token enquanto o fluxo de autenticação não estiver habilitado. Altere para `true` quando o back-end e o fluxo de login estiverem preparados para isso.

O Vite encaminha chamadas iniciadas por `/backend` ao destino configurado em `VITE_API_PROXY_TARGET`, removendo o prefixo `/backend`. Se a API estiver em outra porta ou endereço, ajuste a variável.

Em produção, configure `VITE_API_URL` para a URL apropriada da API ou para um proxy reverso. A API precisa permitir a origem do front-end por CORS quando estiver hospedada separadamente.

## Executar localmente

Na pasta raiz do front-end:

```bash
npm run dev
```

O Vite normalmente disponibiliza a aplicação em `http://localhost:5173`.

Para testar operações reais, inicie também o back-end e o banco de dados conforme as instruções do repositório da API.

## Verificações

```bash
npm run typecheck
npm run lint
npm run build
```

Para visualizar localmente o build de produção:

```bash
npm run preview
```

## Estrutura principal

```text
src/
├── components/       componentes reutilizáveis e layouts
├── config/           leitura centralizada das variáveis de ambiente
├── contexts/         contexto de autenticação
├── hooks/            hooks reutilizáveis
├── pages/            páginas do sistema, incluindo Movimentações
├── routes/           caminhos e configuração das rotas
├── services/         comunicação HTTP e serviços por recurso
├── styles/           tokens de design, estilos globais e Tailwind
├── types/            tipos de dados e contratos da API
└── utils/            funções auxiliares
```

A tela de Movimentações existente utiliza os serviços e os tipos do projeto, e oferece listagem, filtros, totais, paginação e operações de cadastro, edição e exclusão conforme os endpoints configurados no serviço.

## Tailwind CSS

As configurações estão em `tailwind.config.js` e `postcss.config.js`. As diretivas do Tailwind ficam em `src/styles/base.css`, importado pelo ponto de entrada da aplicação. Os tokens de marca e tipografia continuam centralizados em `src/styles/variaveis.css`.

## GitHub e segurança

O repositório deve conter o código-fonte, `package.json`, a documentação e o modelo `.env.example`. Não versionar `node_modules`, `dist`, arquivos `.env` locais ou credenciais. O `.gitignore` está configurado para ignorar arquivos de ambiente, exceto `.env.example`.
