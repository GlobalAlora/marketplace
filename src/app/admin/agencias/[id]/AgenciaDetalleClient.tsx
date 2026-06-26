'use client'

import { useState, useTransition } from 'react'
import { setLimiteDestacadosCustom } from '../actions'

interface Props {
  agenciaId: string
  limitePlan: number
  limiteCustom: number | null
}

export default function AgenciaDetalleClient({ agenciaId, limitePlan, limiteCustom }: Props) {
  const [usarCustom, setUsarCustom] = useState(limiteCustom !== null)
  const [valor, setValor] = useState(String(limiteCustom ?? limitePlan))
  const [pending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    setSuccess(false)
    setError(null)
    const value = usarCustom ? parseInt(valor, 10) : null
    if (usarCustom && (!Number.isFinite(value) || (value as number) < 0)) {
      setError('Ingresá un número válido (0 o más)')
      return
    }
    startTransition(async () => {
      try {
        await setLimiteDestacadosCustom(agenciaId, value)
        setSuccess(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al guardar')
      }
    })
  }

  return (
    <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-6">
      <h2 className="text-sm font-bold text-white mb-1">Límite de destacados</h2>
      <p className="text-xs text-gray-500 mb-4">
        Por defecto esta agencia tiene <span className="text-white font-semibold">{limitePlan}</span> destacado{limitePlan !== 1 ? 's' : ''} según su plan.
        Podés asignarle un límite personalizado que lo sobreescribe.
      </p>

      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setUsarCustom(false)}
          className={`flex-1 text-sm font-semibold py-2.5 rounded-xl border transition-colors ${!usarCustom ? 'bg-[#282F8F]/20 border-[#282F8F]/50 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
        >
          Usar límite del plan ({limitePlan})
        </button>
        <button
          type="button"
          onClick={() => setUsarCustom(true)}
          className={`flex-1 text-sm font-semibold py-2.5 rounded-xl border transition-colors ${usarCustom ? 'bg-[#FFC107]/15 border-[#FFC107]/50 text-[#FFC107]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
        >
          Límite personalizado
        </button>
      </div>

      {usarCustom && (
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Cantidad de destacados permitidos</label>
          <input
            type="number"
            min={0}
            value={valor}
            onChange={e => setValor(e.target.value)}
            className="w-32 bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 text-center font-bold tabular-nums focus:outline-none focus:border-[#FFC107] transition-colors"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">{error}</p>}
      {success && <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-4">Guardado correctamente</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={pending}
        className="bg-[#FFC107] hover:bg-[#e6ad00] disabled:opacity-50 text-[#0D0F14] font-extrabold text-sm px-5 py-2.5 rounded-xl transition-colors"
      >
        {pending ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </div>
  )
}
