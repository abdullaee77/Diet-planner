'use client'

interface Props {
  glasses: number
  target?: number
  onChange: (glasses: number) => void
}

export default function WaterTracker({ glasses, target = 8, onChange }: Props) {
  function add() {
    if (glasses < 12) onChange(glasses + 1)
  }

  function remove() {
    if (glasses > 0) onChange(glasses - 1)
  }

  const percent = Math.min((glasses / target) * 100, 100)

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700">💧 Water</h3>
        <span className="text-sm text-blue-500 font-medium">
          {glasses} / {target} glasses
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-blue-50 rounded-full h-3 mb-4">
        <div
          className="bg-blue-400 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Glass grid */}
      <div className="grid grid-cols-6 gap-2 mb-4">
        {Array.from({ length: target }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i < glasses ? i : i + 1)}
            className={`text-2xl transition-transform active:scale-90 ${
              i < glasses ? 'opacity-100' : 'opacity-25'
            }`}
          >
            🥤
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={remove}
          disabled={glasses === 0}
          className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-lg disabled:opacity-30 active:scale-95 transition"
        >
          −
        </button>
        <button
          onClick={add}
          disabled={glasses >= 12}
          className="flex-1 py-2 rounded-xl bg-blue-500 text-white font-bold text-lg disabled:opacity-30 active:scale-95 transition"
        >
          + Add Glass
        </button>
      </div>
    </div>
  )
}