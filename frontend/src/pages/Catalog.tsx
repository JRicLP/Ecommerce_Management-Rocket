import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { produtosService } from '../services/api'
import type { Produto } from '../types'
import Navbar from '../components/Navbar'
import { getImagemCategoria } from '../utils/categoriaImagens'

export default function Catalog() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    try {
      setLoading(true)
      setErro('')
      const res = await produtosService.listar()
      setProdutos(res.data)
    } catch {
      setErro('Erro ao carregar produtos. Verifique se o servidor está rodando.')
    } finally {
      setLoading(false)
    }
  }

  function handleBusca(termo: string) {
    setBusca(termo)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      if (termo.trim() === '') {
        carregarProdutos()
        return
      }
      try {
        setLoading(true)
        setErro('')
        const res = await produtosService.buscar(termo)
        setProdutos(res.data)
      } catch {
        setErro('Erro ao buscar produtos.')
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <input
            type="text"
            id ="busca"
            name="busca"
            placeholder="Buscar por nome ou categoria..."
            value={busca}
            onChange={(e) => handleBusca(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && (
          <p className="text-gray-500 text-sm">Carregando produtos...</p>
        )}

        {!loading && erro && (
          <p className="text-red-500 text-sm">{erro}</p>
        )}

        {!loading && !erro && produtos.length === 0 && (
          <p className="text-gray-500 text-sm">Nenhum produto encontrado.</p>
        )}

        {!loading && !erro && produtos.length > 0 && (
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
        )}
      </main>
    </div>
  )
}
