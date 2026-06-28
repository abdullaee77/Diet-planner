'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { format, parseISO } from 'date-fns'
import StreakBadge from '@/components/StreakBadge'

interface WeightEntry { date: string; weight_kg: number }
interface MeasurementEntry { date: string; waist_cm: number; hips_cm: number; arms_cm: number }

export default function ProgressPage() {
  const [weights, setWeights] = useState<WeightEntry[]>([])
  const [measurements, setMeasurements] = useState<MeasurementEntry[]>([])
  const [streak, setStreak] = useState(0)
  const [waterStreak, setWaterStreak] = useState(0)
  const [stepsStreak, setStepsStreak] = useState(0)
  const [totalDays, setTotalDays] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/progress')
      .then(r => { if (r.status === 401) { router.push('/setup'); return null } return r.json() })
      .then(data => {
        if (!data) return
        setWeights(data.weights)
        setMeasurements(data.measurements)
        setStreak(data.streak)
        setWaterStreak(data.waterStreak)
        setStepsStreak(data.stepsStreak)
        setTotalDays(data.totalDays)
        setLoading(false)
      })
  }, [router])

  const weightData = weights.map(w => ({
    date: format(parseISO(w.date), 'MMM d'),
    weight: Number(w.weight_kg),
  }))

  const measurementData = measurements.map(m => ({
    date: format(parseISO(m.date), 'MMM d'),
    waist: Number(m.waist_cm),
    hips: Number(m.hips_cm),
    arms: Number(m.arms_cm),
  }))

  const tooltipStyle = {
    backgroundColor: '#18181b',
    border: '1px solid #3f3f46',
    borderRadius: '12px',
    color: '#f4f4f5',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <p className="text-zinc-500">Loading progress...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-24">
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">📈 Your Progress</h1>
          <button onClick={() => router.push('/home')} className="text-rose-400 font-medium text-sm">← Home</button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* Streaks */}
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3 px-1">Streaks</p>
          <div className="grid grid-cols-2 gap-3">
            <StreakBadge label="Day Streak" emoji="🔥" count={streak} color="bg-zinc-900 text-orange-400" />
            <StreakBadge label="Total Days" emoji="📅" count={totalDays} color="bg-zinc-900 text-rose-400" />
            <StreakBadge label="Water Goal" emoji="💧" count={waterStreak} color="bg-zinc-900 text-blue-400" />
            <StreakBadge label="Steps Goal" emoji="👟" count={stepsStreak} color="bg-zinc-900 text-green-400" />
          </div>
        </div>

        {/* Weight chart */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
          <h2 className="font-semibold text-white mb-4">⚖️ Weight (kg)</h2>
          {weightData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
              <p className="text-4xl mb-2">⚖️</p>
              <p className="text-sm">No weight entries yet</p>
              <p className="text-xs">Logged every 3 days</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717a' }} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="weight" stroke="#f43f5e"
                  strokeWidth={2.5} dot={{ fill: '#f43f5e', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Measurements chart */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
          <h2 className="font-semibold text-white mb-4">📏 Measurements (cm)</h2>
          {measurementData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
              <p className="text-4xl mb-2">📏</p>
              <p className="text-sm">No measurements yet</p>
              <p className="text-xs">Logged every 7 days</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={measurementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717a' }} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: '#a1a1aa', fontSize: 12 }} />
                <Line type="monotone" dataKey="waist" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="hips" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="arms" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  )
}