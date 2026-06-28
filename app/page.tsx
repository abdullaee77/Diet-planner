import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { query } from '@/lib/db'

export default async function RootPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) redirect('/setup')

  const rows = await query('SELECT id FROM users WHERE id = $1', [userId])
  if (rows.length === 0) redirect('/setup')

  redirect('/home')
}