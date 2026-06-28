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
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <p className="text-rose-400">Loading your plan...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rose-50 pb-24">
      <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">📋 My Plan</h1>
          <button onClick={() => router.push('/home')}
            className="text-rose-500 font-medium text-sm">← Home</button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Exercise target */}
        {plan?.exercise_desc && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-700 mb-2">🏃 Exercise Goal</h2>
            <p className="text-gray-800">{plan.exercise_desc}</p>
            <p className="text-rose-500 text-sm mt-1">{plan.exercise_mins} minutes per day</p>
          </div>
        )}

        {/* Sleep target */}
        {plan?.sleep_hours && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-700 mb-2">😴 Sleep Goal</h2>
            <p className="text-gray-800">{plan.sleep_hours} hours per night</p>
          </div>
        )}

        {/* Skip foods */}
        {skipFoods.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100">
            <h2 className="font-semibold text-gray-700 mb-3">🚫 Foods to Skip</h2>
            <div className="space-y-3">
              {skipFoods.map(food => (
                <div key={food.id} className="bg-red-50 rounded-xl p-3">
                  <p className="font-medium text-red-700">{food.name}</p>
                  <p className="text-sm text-red-500 mt-1">{food.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Must-eat foods */}
        {mustEatFoods.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
            <h2 className="font-semibold text-gray-700 mb-3">✅ Foods to Add</h2>
            <div className="space-y-3">
              {mustEatFoods.map(food => (
                <div key={food.id} className="bg-green-50 rounded-xl p-3">
                  <p className="font-medium text-green-700">{food.name}</p>
                  <p className="text-sm text-green-600 mt-1">{food.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}