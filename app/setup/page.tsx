'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/setup')
      .then(r => r.json())
      .then(data => {
        if (data.user) router.replace('/home')
        else setChecking(false)
      })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const res = await fetch('/api/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) router.push('/home')
    else setLoading(false)
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <p className="text-zinc-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🌸</div>
          <h1 className="text-3xl font-bold text-white">Welcome</h1>
          <p className="text-zinc-500 mt-2">Let's start your journey</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              What's your name?
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-900 text-white text-lg placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-3 rounded-2xl bg-rose-500 text-white text-lg font-semibold disabled:opacity-40 active:scale-95 transition"
          >
            {loading ? 'Setting up...' : "Let's go →"}
          </button>
        </form>
      </div>
    </div>
  )
}