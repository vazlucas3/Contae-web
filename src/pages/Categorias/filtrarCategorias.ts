import type { CategoriaResponse } from '@/types'

/* ------------------------------------------------------------------
* filtrarEOrdenar — prepara a lista para exibição (funções puras, sem React).
*  - filtra pelo texto digitado, ignorando maiúsculas/minúsculas e acentos
*    ("cafe" encontra "Café");
*  - ordena de A a Z no padrão do português.
* Devolve uma NOVA lista: a original (estado) não é alterada.
* ------------------------------------------------------------------ */

/* "Café" -> "cafe" */
function normalizar(texto: string): string {
return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

export function filtrarEOrdenar(categorias: CategoriaResponse[], busca: string): CategoriaResponse[] {
const termo = normalizar(busca.trim())

return categorias
.filter((categoria) => normalizar(categoria.nome).includes(termo))
.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
}