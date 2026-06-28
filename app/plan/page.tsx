'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PlanPage() {
  const [plan, setPlan] = useState<any>(null)
  const [skipFoods, setSkipFoods] = useState<any[]>([])
  const [mustEatFoods, setMustEatFoods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/trainer/plan')
      .then(r => r.json())
      .then(data => {
        setPlan(data.plan)
        setSkipFoods(data.skipFoods)
        setMustEatFoods(data.mustEatFoods)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <p className="text-zinc-500">Loading your plan...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-24">
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">📋 My Plan</h1>
          <button onClick={() => router.push('/home')} className="text-rose-400 font-medium text-sm">← Home</button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {plan?.exercise_desc && (
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h2 className="font-semibold text-white mb-2">🏃 Exercise Goal</h2>
            <p className="text-zinc-300">{plan.exercise_desc}</p>
            <p className="text-rose-400 text-sm mt-1">{plan.exercise_mins} minutes per day</p>
          </div>
        )}

        {plan?.sleep_hours && (
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h2 className="font-semibold text-white mb-2">😴 Sleep Goal</h2>
            <p className="text-zinc-300">{plan.sleep_hours} hours per night</p>
          </div>
        )}

        {skipFoods.length > 0 && (
          <div className="bg-zinc-900 rounded-2xl p-4 border border-red-500/20">
            <h2 className="font-semibold text-white mb-3">🚫 Foods to Skip</h2>
            <div className="space-y-3">
              {skipFoods.map(food => (
                <div key={food.id} className="bg-red-500/10 rounded-xl p-3">
                  <p className="font-medium text-red-400">{food.name}</p>
                  <p className="text-sm text-zinc-400 mt-1">{food.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {mustEatFoods.length > 0 && (
          <div className="bg-zinc-900 rounded-2xl p-4 border border-green-500/20">
            <h2 className="font-semibold text-white mb-3">✅ Foods to Add</h2>
            <div className="space-y-3">
              {mustEatFoods.map(food => (
                <div key={food.id} className="bg-green-500/10 rounded-xl p-3">
                  <p className="font-medium text-green-400">{food.name}</p>
                  <p className="text-sm text-zinc-400 mt-1">{food.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}