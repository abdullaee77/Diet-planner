import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { name } = await req.json()

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 })
  }

  const rows = await query(
    'INSERT INTO users (name) VALUES ($1) RETURNING id, name, created_at',
    [name.trim()]
  )

  const user = rows[0]

  const cookieStore = await cookies()
  cookieStore.set('user_id', String(user.id), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  return NextResponse.json({ user })
}

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) return NextResponse.json({ user: null })

  const rows = await query(
    'SELECT id, name, created_at FROM users WHERE id = $1',
    [userId]
  )

  return NextResponse.json({ user: rows[0] ?? null })
}