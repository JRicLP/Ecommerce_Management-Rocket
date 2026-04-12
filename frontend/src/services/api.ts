import axios from 'axios'
import { Produto, ProdutoCreate, ProdutoUpdate, AvaliacoesProduto } from '../types'

const api = axios.create({baseURL: 'http://localhost:8000',})

export const produtosService = {
  listar: (skip = 0, limit = 20) =>
    api.get<Produto[]>(`/produtos/`, { params: { skip, limit } }),

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
