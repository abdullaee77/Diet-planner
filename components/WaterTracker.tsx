'use client'

interface Props {
  glasses: number
  target?: number
  onChange: (glasses: number) => void
}

export default function WaterTracker({ glasses, target = 8, onChange }: Props) {
  const percent = Math.min((glasses / target) * 100, 100)

  return (
    <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white">💧 Water</h3>
        <span className="text-sm text-blue-400 font-medium">
          {glasses} / {target} glasses
        </span>
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-3 mb-4">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="grid grid-cols-6 gap-2 mb-4">
        {Array.from({ length: target }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i < glasses ? i : i + 1)}
            className={`text-2xl transition-transform active:scale-90 ${
              i < glasses ? 'opacity-100' : 'opacity-20'
            }`}
          >
            🥤
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => glasses > 0 && onChange(glasses - 1)}
          disabled={glasses === 0}
          className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-lg border border-zinc-700 disabled:opacity-30 active:scale-95 transition"
        >
          −
        </button>
        <button
          onClick={() => glasses < 12 && onChange(glasses + 1)}
          disabled={glasses >= 12}
          className="flex-1 py-2 rounded-xl bg-blue-500 text-white font-bold text-lg disabled:opacity-30 active:scale-95 transition"
        >
          + Add Glass
        </button>
      </div>
    </div>
  )
}