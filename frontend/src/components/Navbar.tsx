import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-semibold text-gray-800">
        Gerenciador de Produtos
      </Link>
      <Link
        to="/produtos/novo"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
      >
        + Novo Produto
      </Link>
    </nav>
  )
}