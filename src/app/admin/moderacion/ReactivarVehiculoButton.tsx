'use client'

import { useState, useTransition } from 'react'
import { toggleActivoVehiculo } from '../vehiculos/actions'

export default function ReactivarVehiculoButton({ vehiculoId }: { vehiculoId: string }) {
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      try {
        await toggleActivoVehiculo(vehiculoId, true)
        setDone(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al reactivar')
      }
    })
  }

  if (done) {
    return <span className="text-xs font-semibold text-emerald-400">Reactivado</span>
  }

  return (
    <div className="inline-flex items-center gap-2">
      {error && <span className="text-xs text-red-400">{error}</span>}
      <button
        onClick={handleClick}
        disabled={pending}
        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {pending ? 'Reactivando…' : 'Reactivar'}
      </button>
    </div>
  )
}
