interface Props {
  label: string
  emoji: string
  count: number
  color: string
}

export default function StreakBadge({ label, emoji, count, color }: Props) {
  return (
    <div className={`rounded-2xl p-4 text-center ${color}`}>
      <div className="text-3xl mb-1">{emoji}</div>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-xs font-medium mt-1 opacity-70">{label}</div>
    </div>
  )
}