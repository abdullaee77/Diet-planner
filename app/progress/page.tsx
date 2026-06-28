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
      .then(r => {
        if (r.status === 401) { router.push('/setup'); return null }
        return r.json()
      })
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <p className="text-rose-400">Loading progress...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rose-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">📈 Your Progress</h1>
          <button
            onClick={() => router.push('/home')}
            className="text-rose-500 font-medium text-sm"
          >
            ← Home
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* Streaks */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Streaks
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StreakBadge
              label="Day Streak"
              emoji="🔥"
              count={streak}
              color="bg-orange-100 text-orange-700"
            />
            <StreakBadge
              label="Total Days Logged"
              emoji="📅"
              count={totalDays}
              color="bg-rose-100 text-rose-700"
            />
            <StreakBadge
              label="Water Goal Streak"
              emoji="💧"
              count={waterStreak}
              color="bg-blue-100 text-blue-700"
            />
            <StreakBadge
              label="Steps Goal Streak"
              emoji="👟"
              count={stepsStreak}
              color="bg-green-100 text-green-700"
            />
          </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">⚖️ Weight (kg)</h2>
          {weightData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300">
              <p className="text-4xl mb-2">⚖️</p>
              <p className="text-sm">No weight entries yet</p>
              <p className="text-xs">Weight is logged every 3 days</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ fill: '#f43f5e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Measurements Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">📏 Body Measurements (cm)</h2>
          {measurementData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300">
              <p className="text-4xl mb-2">📏</p>
              <p className="text-sm">No measurements yet</p>
              <p className="text-xs">Measurements logged every 7 days</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={measurementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
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