import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'
import { todayISO } from '@/lib/utils'

async function getUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('user_id')?.value ?? null
}

export async function GET() {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = todayISO()

  const logs = await query(
    `SELECT * FROM daily_logs WHERE user_id = $1 AND date = $2`,
    [userId, today]
  )

  const plan = await query(
    `SELECT * FROM trainer_plan ORDER BY id LIMIT 1`
  )

  const skipFoods = await query(`SELECT * FROM skip_foods`)
  const mustEatFoods = await query(`SELECT * FROM must_eat_foods`)

  const user = await query(
    `SELECT id, name, created_at FROM users WHERE id = $1`,
    [userId]
  )

  return NextResponse.json({
    log: logs[0] ?? null,
    plan: plan[0] ?? null,
    skipFoods,
    mustEatFoods,
    user: user[0],
    today,
  })
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const today = todayISO()

  await query(
    `INSERT INTO daily_logs (
      user_id, date,
      breakfast_food, breakfast_time,
      lunch_food, lunch_time,
      dinner_food, dinner_time,
      snack_food, snack_time,
      water_glasses, steps,
      exercise_desc, exercise_mins,
      sleep_time, wake_time, sleep_hours,
      energy_level, bloating, flex_meal, completed
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
    )
    ON CONFLICT (user_id, date) DO UPDATE SET
      breakfast_food = $3, breakfast_time = $4,
      lunch_food = $5, lunch_time = $6,
      dinner_food = $7, dinner_time = $8,
      snack_food = $9, snack_time = $10,
      water_glasses = $11, steps = $12,
      exercise_desc = $13, exercise_mins = $14,
      sleep_time = $15, wake_time = $16, sleep_hours = $17,
      energy_level = $18, bloating = $19,
      flex_meal = $20, completed = $21`,
    [
      userId, today,
      body.breakfast_food ?? null, body.breakfast_time ?? null,
      body.lunch_food ?? null, body.lunch_time ?? null,
      body.dinner_food ?? null, body.dinner_time ?? null,
      body.snack_food ?? null, body.snack_time ?? null,
      body.water_glasses ?? 0, body.steps ?? null,
      body.exercise_desc ?? null, body.exercise_mins ?? null,
      body.sleep_time ?? null, body.wake_time ?? null, body.sleep_hours ?? null,
      body.energy_level ?? null, body.bloating ?? null,
      body.flex_meal ?? null, body.completed ?? false,
    ]
  )

  return NextResponse.json({ success: true })
}