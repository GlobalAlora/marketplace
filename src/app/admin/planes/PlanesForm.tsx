'use client'

import { useState, useTransition } from 'react'
import { updatePlanLimits } from './actions'

const INPUT = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-2 py-3 focus:outline-none focus:border-[#FFC107] transition-colors text-center font-bold tabular-nums'

interface Limits {
  particular: number
  agencia_basica: number
  agencia_premium: number
}

interface Props {
  limits: Limits
  destacadosLimits: Limits
}

const ROLE_INFO = [
  {
    key: 'particular' as const,
    label: 'Particular',
    desc: 'Usuario privado que vende su propio vehículo',
    badge: 'bg-white/10 text-gray-400',
  },
  {
    key: 'agencia_basica' as const,
    label: 'Agencia PRIME',
    desc: 'Concesionaria con funcionalidades básicas',
    badge: 'bg-[#282F8F]/30 text-[#7b85e0]',
  },
  {
    key: 'agencia_premium' as const,
    label: 'Agencia DUX',
    desc: 'Concesionaria con acceso completo + métricas',
    badge: 'bg-[#FFC107]/15 text-[#FFC107]',
  },
]

export default function PlanesForm({ limits, destacadosLimits }: Props) {
  const [pending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccess(false)
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updatePlanLimits(fd)
      if (result?.error) setError(result.error)
      else setSuccess(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {ROLE_INFO.map(({ key, label, desc, badge }) => (
        <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-4 border-b border-white/5 last:border-0">
          <div className="sm:w-52 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge}`}>{label}</span>
            <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed">{desc}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 sm:ml-auto">
            <div className="flex items-center gap-2">
              <input
                name={key}
                type="number"
                min={1}
                max={9999}
                defaultValue={limits[key]}
                required
                className={`${INPUT} w-20`}
              />
              <span className="text-xs text-gray-500 whitespace-nowrap">publicaciones</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                name={`destacados_${key}`}
                type="number"
                min={0}
                max={999}
                defaultValue={destacadosLimits[key]}
                required
                className={`${INPUT} w-20`}
              />
              <span className="text-xs text-gray-500 whitespace-nowrap">destacados</span>
            </div>
          </div>
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
      )}
      {success && (
        <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
          Límites actualizados correctamente
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[#FFC107] hover:bg-[#e6ad00] disabled:opacity-50 text-[#0D0F14] font-extrabold text-sm py-3 rounded-xl transition-colors mt-2"
      >
        {pending ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </form>
  )
}
