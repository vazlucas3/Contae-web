/* ------------------------------------------------------------------
 * CAMINHOS DAS ROTAS
 * Fonte única dos endereços das telas. Use sempre estas constantes em
 * <Link>, navigate() e no menu — nunca escreva "/contas" direto no código.
 * ------------------------------------------------------------------ */
export const CAMINHOS = {
  login: '/login',
  cadastro: '/cadastro',
  inicio: '/',
  movimentacoes: '/movimentacoes',
  relatorio: '/relatorio',
  contas: '/contas',
  novaConta: '/contas/nova',
  categorias: '/categorias',
  novaCategoria: '/categorias/nova',
  perfil: '/perfil',
} as const
