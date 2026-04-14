import { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { produtosService } from '../services/api'
import type { Produto } from '../types'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import { getImagemCategoria } from '../utils/categoriaImagens'

const LIMITE_POR_PAGINA = 20

export default function Catalog() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [modoBusca, setModoBusca] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()

  useEffect(() => {
    if (location.state?.mensagem) {
      setToast(location.state.mensagem)
      window.history.replaceState({}, '')
    }
  }, [location.state])

  useEffect(() => {
    if (!modoBusca) {
      carregarProdutos(pagina)
    }
  }, [pagina, modoBusca])

  async function carregarProdutos(paginaAtual: number) {
    try {
      setLoading(true)
      setErro('')
      const skip = paginaAtual * LIMITE_POR_PAGINA
      const res = await produtosService.listar(skip, LIMITE_POR_PAGINA)
      setProdutos(res.data.produtos)
      setTotalPaginas(res.data.total_paginas)
    } catch {
      setErro('Erro ao carregar produtos. Verifique se o servidor está rodando.')
    } finally {
      setLoading(false)
    }
  }

  function handleBusca(termo: string) {
    setBusca(termo)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (termo.trim() === '') {
      setModoBusca(false)
      setPagina(0)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true)
        setErro('')
        setModoBusca(true)
        const res = await produtosService.buscar(termo)
        setProdutos(res.data)
      } catch {
        setErro('Erro ao buscar produtos.')
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  function irParaPagina(novaPagina: number) {
    if (novaPagina < 0) return
    setPagina(novaPagina)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Campo de busca */}
        <div className="mb-6">
          <input
            type="text"
            id="busca"
            name="busca"
            placeholder="Buscar por nome ou categoria..."
            value={busca}
            onChange={(e) => handleBusca(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Estados de feedback */}
        {loading && (
          <p className="text-gray-500 text-sm">Carregando produtos...</p>
        )}
        {!loading && erro && (
          <p className="text-red-500 text-sm">{erro}</p>
        )}
        {!loading && !erro && produtos.length === 0 && (
          <p className="text-gray-500 text-sm">Nenhum produto encontrado.</p>
        )}

        {/* Grid de produtos */}
        {!loading && !erro && produtos.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {produtos.map((produto) => (
                <Link
                  key={produto.id_produto}
                  to={`/produtos/${produto.id_produto}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
                >
                  <img
                    src={getImagemCategoria(produto.categoria_produto)}
                    alt={produto.categoria_produto}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
                    }}
                  />
                  <div className="p-4">
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {produto.categoria_produto}
                    </span>
                    <h3 className="mt-3 font-medium text-gray-800 text-sm leading-snug">
                      {produto.nome_produto}
                    </h3>
                    {produto.peso_produto_gramas != null && (
                      <p className="mt-1 text-xs text-gray-500">
                        {produto.peso_produto_gramas}g
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Paginação — só aparece fora do modo busca */}
            {!modoBusca && (
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => irParaPagina(pagina - 1)}
                  disabled={pagina === 0 || loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>

                <span className="text-sm text-gray-500">
                  Página {pagina + 1} de {totalPaginas}
                </span>

                <button
                  onClick={() => irParaPagina(pagina + 1)}
                  disabled={pagina + 1 >= totalPaginas || loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}

      </main>

      {/* Toast — fora do main para ficar fixo na tela */}
      {toast && (
        <Toast
          mensagem={toast}
          tipo="sucesso"
          onFechar={() => setToast(null)}
        />
      )}
    </div>
  )
}