interface Props {
  media: number
  total: number
}

export default function StarRating({ media, total }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((estrela) => (
          <span
            key={estrela}
            className={estrela <= Math.round(media) ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm text-gray-600">
        {media.toFixed(1)} ({total} avaliações)
      </span>
    </div>
  )
}