'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TrainerGate() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/trainer/plan', {
      headers: { 'x-trainer-pin': pin },
    })
    if (res.ok) {
      sessionStorage.setItem('trainer_pin', pin)
      router.push('/trainer/dashboard')
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-white">Trainer Access</h1>
          <p className="text-gray-400 mt-2 text-sm">Enter your PIN to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(false) }}
            placeholder="Enter PIN"
            className="w-full px-4 py-3 rounded-2xl bg-gray-800 text-white border border-gray-700 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-500"
            maxLength={8}
          />
          {error && (
            <p className="text-red-400 text-sm text-center">Wrong PIN. Try again.</p>
          )}
          <button
            type="submit"
            disabled={!pin}
            className="w-full py-3 rounded-2xl bg-rose-500 text-white font-semibold disabled:opacity-40 active:scale-95 transition"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}