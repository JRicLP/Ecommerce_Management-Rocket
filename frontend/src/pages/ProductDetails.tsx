import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { produtosService } from '../services/api'
import type { Produto, AvaliacoesProduto, VendasProduto } from '../types'
import Navbar from '../components/Navbar'
import StarRating from '../components/StarRating'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'
import { getImagemCategoria } from '../utils/categoriaImagens'

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [produto, setProduto] = useState<Produto | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<AvaliacoesProduto | null>(null)
  const [vendas, setVendas] = useState<VendasProduto | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [confirmarDelete, setConfirmarDelete] = useState(false)
  const [deletando, setDeletando] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (location.state?.mensagem) {
      setToast(location.state.mensagem)
      window.history.replaceState({}, '')
    }
  }, [location.state])

  useEffect(() => {
    if (!id) {
      setErro('ID do produto não encontrado.')
      setLoading(false)
      return
    }

    async function carregar() {
      try {
        const [resProduto, resAvaliacoes, resVendas] = await Promise.all([
          produtosService.detalhar(id!),
          produtosService.avaliacoes(id!),
          produtosService.vendas(id!),
        ])
        setProduto(resProduto.data)
        setAvaliacoes(resAvaliacoes.data)
        setVendas(resVendas.data)
      } catch {
        setErro('Produto não encontrado ou erro ao carregar dados.')
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [id])

  async function handleDelete() {
    if (!id) return
    try {
      setDeletando(true)
      await produtosService.deletar(id)
      navigate('/', {
        state: { mensagem: `"${produto?.nome_produto}" removido com sucesso.` },
      })
    } catch {
      setErro('Erro ao deletar produto. Tente novamente.')
      setConfirmarDelete(false)
    } finally {
      setDeletando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="p-8 text-gray-500 text-sm">Carregando...</p>
      </div>
    )
  }

  if (erro || !produto) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-red-500 text-sm mb-4">{erro}</p>
          <Link to="/" className="text-blue-600 text-sm hover:underline">
            ← Voltar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  const medidas = [
    { label: 'Peso', valor: produto.peso_produto_gramas, unidade: 'g' },
    { label: 'Comprimento', valor: produto.comprimento_centimetros, unidade: 'cm' },
    { label: 'Altura', valor: produto.altura_centimetros, unidade: 'cm' },
    { label: 'Largura', valor: produto.largura_centimetros, unidade: 'cm' },
  ]

  const indicadoresVendas = vendas
    ? [
        {
          label: 'Unidades vendidas',
          valor: vendas.quantidade_vendida.toLocaleString('pt-BR'),
        },
        {
          label: 'Receita total',
          valor: vendas.receita_total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        },
        {
          label: 'Frete total',
          valor: vendas.frete_total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        },
        {
          label: 'Ticket médio',
          valor: vendas.ticket_medio.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        },
      ]
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {confirmarDelete && (
        <ConfirmModal
          mensagem={`Deseja remover "${produto.nome_produto}"? Essa ação não pode ser desfeita.`}
          onConfirmar={handleDelete}
          onCancelar={() => setConfirmarDelete(false)}
        />
      )}

      <main className="max-w-4xl mx-auto px-6 py-8">

        {erro && (
          <p className="text-red-500 text-sm mb-4">{erro}</p>
        )}

        {/* Card principal — imagem, nome, categoria e medidas */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <img
            src={getImagemCategoria(produto.categoria_produto)}
            alt={produto.categoria_produto}
            className="w-full h-56 object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
            }}
          />
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {produto.categoria_produto}
                </span>
                <h1 className="text-2xl font-semibold text-gray-800 mt-2">
                  {produto.nome_produto}
                </h1>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                <Link
                  to={`/produtos/${id}/editar`}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Editar
                </Link>
                <button
                  onClick={() => setConfirmarDelete(true)}
                  disabled={deletando}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deletando ? 'Removendo...' : 'Remover'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {medidas.map(({ label, valor, unidade }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-lg font-medium text-gray-800">
                    {valor != null ? (
                      <>
                        {valor}{' '}
                        <span className="text-xs text-gray-400">{unidade}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card de vendas */}
        {vendas && indicadoresVendas.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Desempenho de vendas
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {indicadoresVendas.map(({ label, valor }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-base font-medium text-gray-800">{valor}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card de avaliações */}
        {avaliacoes && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Avaliações</h2>
              <StarRating media={avaliacoes.media} total={avaliacoes.total} />
            </div>

            {avaliacoes.avaliacoes.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Nenhuma avaliação para este produto.
              </p>
            ) : (
              <div className="space-y-3">
                {avaliacoes.avaliacoes.map((av) => (
                  <div
                    key={av.id_avaliacao}
                    className="border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-400">
                        {'★'.repeat(av.avaliacao)}
                        {'☆'.repeat(5 - av.avaliacao)}
                      </span>
                      {av.data_comentario && (
                        <span className="text-xs text-gray-400">
                          {new Date(av.data_comentario).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                    {av.titulo_comentario &&
                      av.titulo_comentario !== 'Sem título' && (
                        <p className="text-sm font-medium text-gray-700">
                          {av.titulo_comentario}
                        </p>
                      )}
                    {av.comentario &&
                      av.comentario !== 'Sem comentário' && (
                        <p className="text-sm text-gray-600">{av.comentario}</p>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
