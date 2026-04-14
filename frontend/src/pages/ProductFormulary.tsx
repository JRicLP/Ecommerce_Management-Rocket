import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { produtosService } from '../services/api'
import type { ProdutoCreate } from '../types'
import Navbar from '../components/Navbar'

const camposVazios: ProdutoCreate = {
  nome_produto: '',
  categoria_produto: '',
  peso_produto_gramas: undefined,
  comprimento_centimetros: undefined,
  altura_centimetros: undefined,
  largura_centimetros: undefined,
}

const campos = [
  { name: 'nome_produto', label: 'Nome do produto', type: 'text', obrigatorio: true },
  { name: 'categoria_produto', label: 'Categoria', type: 'text', obrigatorio: true },
  { name: 'peso_produto_gramas', label: 'Peso (g)', type: 'number', obrigatorio: false },
  { name: 'comprimento_centimetros', label: 'Comprimento (cm)', type: 'number', obrigatorio: false },
  { name: 'altura_centimetros', label: 'Altura (cm)', type: 'number', obrigatorio: false },
  { name: 'largura_centimetros', label: 'Largura (cm)', type: 'number', obrigatorio: false },
]

export default function ProductFormulary() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const editando = Boolean(id)
  const [form, setForm] = useState<ProdutoCreate>(camposVazios)
  const [loading, setLoading] = useState(false)
  const [carregando, setCarregando] = useState(editando)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!editando || !id) return
    produtosService
      .detalhar(id)
      .then((res) => {
        const { id_produto, ...dados } = res.data
        setForm({
          nome_produto: dados.nome_produto,
          categoria_produto: dados.categoria_produto,
          peso_produto_gramas: dados.peso_produto_gramas ?? undefined,
          comprimento_centimetros: dados.comprimento_centimetros ?? undefined,
          altura_centimetros: dados.altura_centimetros ?? undefined,
          largura_centimetros: dados.largura_centimetros ?? undefined,
        })
      })
      .catch(() => {
        setErro('Erro ao carregar dados do produto.')
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [id, editando])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome_produto.trim() || !form.categoria_produto.trim()) {
      setErro('Nome e categoria são obrigatórios.')
      return
    }
    try {
      setLoading(true)
      setErro('')
      if (editando && id) {
        await produtosService.atualizar(id, form)
        navigate(`/produtos/${id}`, {
          state: { mensagem: 'Produto atualizado com sucesso.' },
        })
      } else {
        const res = await produtosService.criar(form)
        navigate(`/produtos/${res.data.id_produto}`, {
          state: { mensagem: 'Produto criado com sucesso.' },
        })
      }
    } catch {
      setErro('Erro ao salvar produto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="p-8 text-gray-500 text-sm">Carregando dados do produto...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">
            {editando ? 'Editar produto' : 'Novo produto'}
          </h1>

          {erro && (
            <p className="text-red-500 text-sm mb-4">{erro}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {campos.map(({ name, label, type, obrigatorio }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="block text-sm text-gray-700 mb-1"
                >
                  {label}{' '}
                  {obrigatorio && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={(form[name as keyof ProdutoCreate] ?? '') as string | number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading
                  ? 'Salvando...'
                  : editando
                  ? 'Salvar alterações'
                  : 'Criar produto'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
