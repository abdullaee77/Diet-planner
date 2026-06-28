'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getDayNumber, shouldShowWeight, shouldShowMeasurements } from '@/lib/utils'
import WaterTracker from '@/components/WaterTracker'
import MealCard from '@/components/MealCard'

interface DailyLog {
  breakfast_food: string; breakfast_time: string
  lunch_food: string; lunch_time: string
  dinner_food: string; dinner_time: string
  snack_food: string; snack_time: string
  water_glasses: number; steps: string
  exercise_desc: string; exercise_mins: string
  sleep_time: string; wake_time: string; sleep_hours: string
  energy_level: string; bloating: boolean | null
  flex_meal: string; completed: boolean
}

interface Plan {
  exercise_desc: string; exercise_mins: number
  sleep_hours: number; daily_quote: string
}

interface User {
  id: number; name: string; created_at: string
}

const emptyLog: DailyLog = {
  breakfast_food: '', breakfast_time: '',
  lunch_food: '', lunch_time: '',
  dinner_food: '', dinner_time: '',
  snack_food: '', snack_time: '',
  water_glasses: 0, steps: '',
  exercise_desc: '', exercise_mins: '',
  sleep_time: '', wake_time: '', sleep_hours: '',
  energy_level: '', bloating: null,
  flex_meal: '', completed: false,
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [log, setLog] = useState<DailyLog>(emptyLog)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dayNumber, setDayNumber] = useState(1)
  const [showWeight, setShowWeight] = useState(false)
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [weight, setWeight] = useState('')
  const [waist, setWaist] = useState('')
  const [hips, setHips] = useState('')
  const [arms, setArms] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/daily-log')
      .then(r => {
        if (r.status === 401) { router.push('/setup'); return null }
        return r.json()
      })
      .then(data => {
        if (!data) return
        setUser(data.user)
        setPlan(data.plan)
        if (data.log) {
          setLog({
            ...emptyLog,
            ...data.log,
            water_glasses: data.log.water_glasses ?? 0,
            steps: data.log.steps ?? '',
            exercise_mins: data.log.exercise_mins ?? '',
            sleep_hours: data.log.sleep_hours ?? '',
          })
        }
        const dn = getDayNumber(data.user.created_at)
        setDayNumber(dn)
        setShowWeight(shouldShowWeight(dn))
        setShowMeasurements(shouldShowMeasurements(dn))
      })
  }, [router])

  const updateLog = (field: keyof DailyLog, value: any) => {
    setLog(prev => ({ ...prev, [field]: value }))
  }

  const handleWaterChange = useCallback(async (glasses: number) => {
    setLog(prev => ({ ...prev, water_glasses: glasses }))
    await fetch('/api/water', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ glasses }),
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    await fetch('/api/daily-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...log, completed: true }),
    })

    if (showWeight && weight) {
      await fetch('/api/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight_kg: parseFloat(weight) }),
      })
    }

    if (showMeasurements) {
      await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waist_cm: waist ? parseFloat(waist) : null,
          hips_cm: hips ? parseFloat(hips) : null,
          arms_cm: arms ? parseFloat(arms) : null,
        }),
      })
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <p className="text-rose-400">Loading your day...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rose-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-rose-400">Day {dayNumber} of your journey</p>
            <h1 className="text-xl font-bold text-gray-800">Hi, {user.name} 🌸</h1>
          </div>
          <div className="flex gap-3 text-sm">
            <button onClick={() => router.push('/progress')} className="text-rose-500 font-medium">Progress</button>
            <button onClick={() => router.push('/plan')} className="text-rose-500 font-medium">My Plan</button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Daily quote */}
        {plan?.daily_quote && (
          <div className="bg-rose-500 text-white rounded-2xl p-4 text-center">
            <p className="text-sm opacity-80 mb-1">Today's motivation</p>
            <p className="font-medium italic">"{plan.daily_quote}"</p>
          </div>
        )}

        {/* Day 3 / Day 7 banners */}
        {showWeight && (
          <div className="bg-amber-100 border border-amber-300 rounded-2xl p-3 text-center">
            <p className="text-amber-700 font-medium">⚖️ Weigh-in day! Log your weight below.</p>
          </div>
        )}
        {showMeasurements && (
          <div className="bg-purple-100 border border-purple-300 rounded-2xl p-3 text-center">
            <p className="text-purple-700 font-medium">📏 Measurement morning! Log your measurements below.</p>
          </div>
        )}

        {/* Meals */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">Meals</h2>
          <div className="space-y-3">
            <MealCard label="Breakfast" emoji="🍳"
              food={log.breakfast_food} time={log.breakfast_time}
              onFoodChange={v => updateLog('breakfast_food', v)}
              onTimeChange={v => updateLog('breakfast_time', v)} />
            <MealCard label="Lunch" emoji="🥗"
              food={log.lunch_food} time={log.lunch_time}
              onFoodChange={v => updateLog('lunch_food', v)}
              onTimeChange={v => updateLog('lunch_time', v)} />
            <MealCard label="Dinner" emoji="🍽️"
              food={log.dinner_food} time={log.dinner_time}
              onFoodChange={v => updateLog('dinner_food', v)}
              onTimeChange={v => updateLog('dinner_time', v)} />
            <MealCard label="Snacks" emoji="🍎"
              food={log.snack_food} time={log.snack_time}
              onFoodChange={v => updateLog('snack_food', v)}
              onTimeChange={v => updateLog('snack_time', v)} />
          </div>
        </div>

        {/* Water */}
        <WaterTracker
          glasses={log.water_glasses}
          target={plan?.sleep_hours ? 8 : 8}
          onChange={handleWaterChange}
        />

        {/* Steps */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-3">👟 Steps</h3>
          <input
            type="number"
            value={log.steps}
            onChange={e => updateLog('steps', e.target.value)}
            placeholder="How many steps today?"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>

        {/* Exercise */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-700">🏃 Exercise</h3>
            {plan?.exercise_desc && (
              <span className="text-xs text-rose-400">Target: {plan.exercise_desc} · {plan.exercise_mins} min</span>
            )}
          </div>
          <textarea
            value={log.exercise_desc}
            onChange={e => updateLog('exercise_desc', e.target.value)}
            placeholder="What did you do? (e.g. 30 min walk)"
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-300 mb-2"
          />
          <input
            type="number"
            value={log.exercise_mins}
            onChange={e => updateLog('exercise_mins', e.target.value)}
            placeholder="Duration in minutes"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>

        {/* Sleep */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">😴 Sleep</h3>
            {plan?.sleep_hours && (
              <span className="text-xs text-rose-400">Target: {plan.sleep_hours}h</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Slept at</label>
              <input type="time" value={log.sleep_time}
                onChange={e => updateLog('sleep_time', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Woke at</label>
              <input type="time" value={log.wake_time}
                onChange={e => updateLog('wake_time', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
          </div>
          <input type="number" step="0.5" value={log.sleep_hours}
            onChange={e => updateLog('sleep_hours', e.target.value)}
            placeholder="Total hours slept"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
        </div>

        {/* Energy + Bloating */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-3">✨ How are you feeling?</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Energy level</p>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map(level => (
                <button key={level}
                  onClick={() => updateLog('energy_level', level)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition active:scale-95 ${
                    log.energy_level === level
                      ? 'bg-rose-500 text-white'
                      : 'bg-rose-50 text-rose-500'
                  }`}>
                  {level === 'low' ? '😓' : level === 'medium' ? '😊' : '⚡'} {level}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Bloating?</p>
            <div className="flex gap-2">
              {[true, false].map(val => (
                <button key={String(val)}
                  onClick={() => updateLog('bloating', val)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition active:scale-95 ${
                    log.bloating === val
                      ? 'bg-rose-500 text-white'
                      : 'bg-rose-50 text-rose-500'
                  }`}>
                  {val ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Flex meal */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
          <h3 className="font-semibold text-gray-700 mb-1">🍕 Flex Meal</h3>
          <p className="text-xs text-gray-400 mb-2">Ate something off plan? Log it honestly — no judgment here 💛</p>
          <textarea
            value={log.flex_meal}
            onChange={e => updateLog('flex_meal', e.target.value)}
            placeholder="What was it? (optional)"
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-orange-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        {/* Weight — every 3 days */}
        {showWeight && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200">
            <h3 className="font-semibold text-gray-700 mb-3">⚖️ Today's Weight</h3>
            <input
              type="number" step="0.1" value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="Weight in kg"
              className="w-full px-3 py-2 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        )}

        {/* Measurements — every 7 days */}
        {showMeasurements && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-200">
            <h3 className="font-semibold text-gray-700 mb-3">📏 Body Measurements</h3>
            <div className="space-y-2">
              {[
                { label: 'Waist (cm)', value: waist, set: setWaist },
                { label: 'Hips (cm)', value: hips, set: setHips },
                { label: 'Arms (cm)', value: arms, set: setArms },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                  <input type="number" step="0.1" value={value}
                    onChange={e => set(e.target.value)}
                    placeholder={label}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-rose-500 text-white text-lg font-bold shadow-md disabled:opacity-60 active:scale-95 transition"
        >
          {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save My Day'}
        </button>

      </div>
    </div>
  )
}