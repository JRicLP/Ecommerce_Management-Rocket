import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-xl mx-auto px-6 py-24 text-center">
        <p className="text-6xl font-semibold text-gray-200 mb-4">404</p>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Página não encontrada
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          A página que você tentou acessar não existe ou foi removida.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          ← Voltar ao catálogo
        </Link>
      </main>
    </div>
  )
}
