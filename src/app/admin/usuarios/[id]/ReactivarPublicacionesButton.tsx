'use client'

import { useState, useTransition } from 'react'
import { reactivarPublicacionesUsuario } from '../actions'

export default function ReactivarPublicacionesButton({ userId, count }: { userId: string; count: number }) {
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (count === 0) return null

  function handleClick() {
    setError(null)
    startTransition(async () => {
      try {
        await reactivarPublicacionesUsuario(userId)
        setDone(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al reactivar publicaciones')
      }
    })
  }

  if (done) {
    return <span className="text-xs font-semibold text-emerald-400">Publicaciones reactivadas</span>
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-400">{error}</span>}
      <button
        onClick={handleClick}
        disabled={pending}
        className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
        </svg>
        {pending ? 'Reactivando…' : `Reactivar publicaciones pausadas (${count})`}
      </button>
    </div>
  )
}
