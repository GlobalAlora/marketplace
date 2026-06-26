'use client'

import { useState, useTransition } from 'react'
import { updatePlanHome } from './actions'
import type { PlanHome } from '@/lib/planes-home'

const INPUT = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-[#FFC107] transition-colors'
const LABEL = 'block text-xs font-semibold text-gray-400 mb-1.5'

export default function PlanesHomeForm({ plan }: { plan: PlanHome }) {
  const [pending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccess(false)
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updatePlanHome(plan.id, fd)
      if (result?.error) setError(result.error)
      else setSuccess(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Nombre del plan</label>
          <input name="nombre" defaultValue={plan.nombre} required className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Subtítulo</label>
          <input name="subtitulo" defaultValue={plan.subtitulo} className={INPUT} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Precio mostrado</label>
          <input name="precio" defaultValue={plan.precio} placeholder="Gratis / Consultar / $50.000" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Aclaración del precio</label>
          <input name="precio_sub" defaultValue={plan.precio_sub} placeholder="para siempre / por mes" className={INPUT} />
        </div>
      </div>

      <div>
        <label className={LABEL}>Features (una por línea)</label>
        <textarea
          name="features"
          rows={6}
          defaultValue={plan.features.join('\n')}
          className={`${INPUT} resize-none`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Texto del botón</label>
          <input name="cta_label" defaultValue={plan.cta_label} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Link del botón</label>
          <input name="cta_href" defaultValue={plan.cta_href} className={INPUT} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" name="destacado" defaultChecked={plan.destacado} className="w-4 h-4 accent-[#FFC107]" />
          Plan destacado (&quot;Más completo&quot;)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" name="cta_externo" defaultChecked={plan.cta_externo} className="w-4 h-4 accent-[#FFC107]" />
          Botón abre link externo (ej. WhatsApp)
        </label>
      </div>

      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
      {success && <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">Guardado correctamente</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-[#FFC107] hover:bg-[#e6ad00] disabled:opacity-50 text-[#0D0F14] font-extrabold text-sm px-5 py-2.5 rounded-xl transition-colors"
      >
        {pending ? 'Guardando…' : `Guardar "${plan.nombre}"`}
      </button>
    </form>
  )
}
