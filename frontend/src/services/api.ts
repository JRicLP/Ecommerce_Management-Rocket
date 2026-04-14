import axios from 'axios'
import type { Produto, ProdutoCreate, ProdutoUpdate, AvaliacoesProduto, VendasProduto, PaginacaoProdutos } from '../types'

const api = axios.create({baseURL: 'http://localhost:8000',})

export const produtosService = {
  vendas: (id: string) =>
  api.get<VendasProduto>(`/produtos/${id}/vendas`),

  listar: (skip = 0, limit = 20) =>
  api.get<PaginacaoProdutos>(`/produtos/`, { params: { skip, limit } }),

  buscar: (q: string) =>
    api.get<Produto[]>(`/produtos/search`, { params: { q } }),

  detalhar: (id: string) =>
    api.get<Produto>(`/produtos/${id}`),

  avaliacoes: (id: string) =>
    api.get<AvaliacoesProduto>(`/produtos/${id}/avaliacoes`),

  criar: (dados: ProdutoCreate) =>
    api.post<Produto>(`/produtos/`, dados),

  atualizar: (id: string, dados: ProdutoUpdate) =>
    api.put<Produto>(`/produtos/${id}`, dados),

  deletar: (id: string) =>
    api.delete(`/produtos/${id}`),

}
