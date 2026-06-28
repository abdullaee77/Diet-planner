import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const weights = await query(
    `SELECT date, weight_kg FROM weight_logs
     WHERE user_id = $1 ORDER BY date ASC`,
    [userId]
  )

  const measurements = await query(
    `SELECT date, waist_cm, hips_cm, arms_cm FROM measurements
     WHERE user_id = $1 ORDER BY date ASC`,
    [userId]
  )

  // Streak — consecutive completed days
  const logs = await query(
    `SELECT date, completed, water_glasses, steps FROM daily_logs
     WHERE user_id = $1 ORDER BY date DESC`,
    [userId]
  )

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].date)
    logDate.setHours(0, 0, 0, 0)
    const diffDays = Math.round((today.getTime() - logDate.getTime()) / 86400000)

    if (diffDays === i && logs[i].completed) {
      streak++
    } else {
      break
    }
  }

  // Water goal streak (8 glasses)
  let waterStreak = 0
  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].date)
    logDate.setHours(0, 0, 0, 0)
    const diffDays = Math.round((today.getTime() - logDate.getTime()) / 86400000)
    if (diffDays === i && logs[i].water_glasses >= 8) {
      waterStreak++
    } else {
      break
    }
  }

  // Steps goal streak (8000 steps)
  let stepsStreak = 0
  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].date)
    logDate.setHours(0, 0, 0, 0)
    const diffDays = Math.round((today.getTime() - logDate.getTime()) / 86400000)
    if (diffDays === i && logs[i].steps >= 8000) {
      stepsStreak++
    } else {
      break
    }
  }

  return NextResponse.json({
    weights,
    measurements,
    streak,
    waterStreak,
    stepsStreak,
    totalDays: logs.length,
  })
}