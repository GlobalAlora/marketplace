'use client'

import { useState, useTransition } from 'react'
import { setLimiteOverride } from '@/app/admin/usuarios/actions'

interface Props {
  userId: string
  currentOverride: number | null
  planLimite: number
  rolLabel: string
}

export default function LimiteOverrideForm({ userId, currentOverride, planLimite, rolLabel }: Props) {
  const [pending, startTransition] = useTransition()
  const [value, setValue] = useState(currentOverride?.toString() ?? '')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    const num = parseInt(value)
    if (!value || isNaN(num) || num < 1) return
    setSaved(false)
    startTransition(async () => {
      await setLimiteOverride(userId, num)
      setSaved(true)
    })
  }

  function handleClear() {
    setSaved(false)
    startTransition(async () => {
      await setLimiteOverride(userId, null)
      setValue('')
      setSaved(true)
    })
  }

  const hasOverride = currentOverride != null

  return (
    <div className="bg-[#111827] border border-white/6 rounded-2xl p-6 mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-sm font-bold text-white">Límite de publicaciones</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Límite del plan <span className="text-gray-400">{rolLabel}</span>: <span className="text-white font-semibold">{planLimite}</span>
          </p>
        </div>
        {hasOverride && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FFC107]/15 text-[#FFC107] border border-[#FFC107]/25 shrink-0">
            Override activo
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-[140px]">
          <input
            type="number"
            min={1}
            max={9999}
            value={value}
            onChange={e => { setValue(e.target.value); setSaved(false) }}
            placeholder={planLimite.toString()}
            className="w-full bg-[#0D0F14] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FFC107]/50 focus:ring-1 focus:ring-[#FFC107]/30 transition tabular-nums"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={pending || !value || isNaN(parseInt(value))}
          className="bg-[#FFC107] hover:bg-[#e6ad00] disabled:opacity-50 text-[#0D0F14] font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          {pending ? 'Guardando…' : 'Aplicar'}
        </button>

        {hasOverride && (
          <button
            onClick={handleClear}
            disabled={pending}
            className="text-sm text-gray-500 hover:text-red-400 px-3 py-2.5 rounded-xl border border-white/8 hover:border-red-500/30 transition-colors disabled:opacity-50"
          >
            Volver al plan
          </button>
        )}
      </div>

      {saved && !pending && (
        <p className="text-xs text-green-400 mt-2">✓ Límite actualizado</p>
      )}

      <p className="text-[11px] text-gray-600 mt-3">
        {hasOverride
          ? `Esta agencia puede publicar hasta ${currentOverride} vehículos (excepción manual).`
          : 'Ingresá un número para dar a esta agencia un límite personalizado que ignora el plan.'}
      </p>
    </div>
  )
}
