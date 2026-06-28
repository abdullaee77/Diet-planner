import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'
import { todayISO } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { waist_cm, hips_cm, arms_cm } = await req.json()
  const today = todayISO()

  await query(
    `INSERT INTO measurements (user_id, date, waist_cm, hips_cm, arms_cm)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, date) DO UPDATE SET
       waist_cm = $3, hips_cm = $4, arms_cm = $5`,
    [userId, today, waist_cm, hips_cm, arms_cm]
  )

  return NextResponse.json({ success: true })
}

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await query(
    `SELECT date, waist_cm, hips_cm, arms_cm FROM measurements
     WHERE user_id = $1 ORDER BY date ASC`,
    [userId]
  )

  return NextResponse.json({ measurements: rows })
}