'use client'

interface Props {
  label: string
  emoji: string
  food: string
  time: string
  onFoodChange: (v: string) => void
  onTimeChange: (v: string) => void
}

export default function MealCard({
  label, emoji, food, time, onFoodChange, onTimeChange
}: Props) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{emoji}</span>
        <h3 className="font-semibold text-gray-700">{label}</h3>
      </div>
      <textarea
        value={food}
        onChange={e => onFoodChange(e.target.value)}
        placeholder={`What did you have for ${label.toLowerCase()}?`}
        rows={2}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-rose-300 mb-2"
      />
      <input
        type="time"
        value={time}
        onChange={e => onTimeChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-300"
      />
    </div>
  )
}