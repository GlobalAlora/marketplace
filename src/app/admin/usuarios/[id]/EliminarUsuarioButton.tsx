'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarUsuario } from '../actions'

export default function EliminarUsuarioButton({ userId }: { userId: string }) {
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [isPending, start]    = useTransition()

  function handleClick() {
    if (!confirm) { setConfirm(true); return }
    setError(null)
    start(async () => {
      const result = await eliminarUsuario(userId)
      if (result?.error) { setError(result.error); setConfirm(false); return }
      router.push('/admin/usuarios')
    })
  }

  return (
    <div className="flex items-center gap-2">
      {error && <p className="text-xs text-red-400">{error}</p>}
      {confirm && !isPending && (
        <span className="text-xs text-red-400">¿Confirmar eliminación?</span>
      )}
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all disabled:opacity-60 ${
          confirm
            ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
            : 'bg-transparent border-red-500/30 text-red-400 hover:border-red-500/60 hover:bg-red-500/10'
        }`}
      >
        {isPending ? (
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
        )}
        {isPending ? 'Eliminando…' : confirm ? 'Sí, eliminar' : 'Eliminar usuario'}
      </button>
      {confirm && !isPending && (
        <button onClick={() => setConfirm(false)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          Cancelar
        </button>
      )}
    </div>
  )
}
