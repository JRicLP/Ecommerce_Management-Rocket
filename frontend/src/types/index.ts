export interface Produto {
    id_produto: string // Obrigatorio
    nome_produto: string // Obrigatorio
    categoria_produto: string // Obrigatorio
    peso_produto_gramas: number | null // Obrigatorio
    comprimento_centimetros: number | null // Obrigatorio
    altura_centimetros: number | null // Obrigatorio
    largura_centimetros: number | null // Obrigatorio

}

export interface Avaliacao {
    id_avaliacao: string // Obrigatorio
    id_pedido: string // Obrigatorio
    avaliacao: number // Obrigatorio
    titulo_comentario: string | null // Obrigatorio
    comentario: string | null // Obrigatorio 
    data_comentario: string | null // Obrigatorio

}

export interface AvaliacoesProduto {
    avaliacoes: Avaliacao[] // Obrigatorio
    media: number // Obrigatorio
    total: number // Obrigatorio

}

export interface ProdutoCreate {
    nome_produto: string // Obrigatorio
    categoria_produto: string // Obrigatorio
    peso_produto_gramas?: number // Opcional
    comprimento_centimetros?: number // Opcional
    altura_centimetros?: number // Opcional
    largura_centimetros?: number // Opcional

}

export interface VendasProduto {
  quantidade_vendida: number
  receita_total: number
  frete_total: number
  ticket_medio: number
}

export interface PaginacaoProdutos {
  produtos: Produto[]
  total: number
  pagina: number
  total_paginas: number
}

export interface ProdutoUpdate extends Partial<ProdutoCreate> {}
