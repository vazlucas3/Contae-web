import type { CategoriaResponse } from '@/types'


function normalizar(texto: string): string {
return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

export function filtrarEOrdenar(categorias: CategoriaResponse[], busca: string): CategoriaResponse[] {
const termo = normalizar(busca.trim())

return categorias
.filter((categoria) => normalizar(categoria.nome).includes(termo))
.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
}