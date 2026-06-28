import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'
import { todayISO } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { glasses } = await req.json()
  const today = todayISO()

  await query(
    `INSERT INTO daily_logs (user_id, date, water_glasses)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, date) DO UPDATE SET water_glasses = $3`,
    [userId, today, glasses]
  )

  return NextResponse.json({ success: true, glasses })
}