import { useEffect } from 'react'

interface Props {
  mensagem: string
  tipo?: 'sucesso' | 'erro'
  onFechar: () => void
  duracao?: number
}

export default function Toast({
  mensagem,
  tipo = 'sucesso',
  onFechar,
  duracao = 3000,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(onFechar, duracao)
    return () => clearTimeout(timer)
  }, [onFechar, duracao])

  const estilos = {
    sucesso: 'bg-green-50 border-green-200 text-green-800',
    erro: 'bg-red-50 border-red-200 text-red-800',
  }

  const icones = {
    sucesso: '✓',
    erro: '✕',
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 border rounded-xl shadow-md text-sm ${estilos[tipo]}`}
    >
      <span className="font-semibold">{icones[tipo]}</span>
      <span>{mensagem}</span>
      <button
        onClick={onFechar}
        className="ml-2 opacity-50 hover:opacity-100 transition"
      >
        ✕
      </button>
    </div>
  )
}