'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function PanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Panel error]', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md w-full">
        <p className="text-red-400 font-semibold mb-2">Ocurrió un error</p>
        <p className="text-xs text-gray-500 mb-6 font-mono">{error.digest}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-bold bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/panel"
            className="px-4 py-2 text-sm font-bold bg-[#FFC107] hover:bg-yellow-400 text-[#0D0F14] rounded-xl transition-colors"
          >
            Ir al panel
          </Link>
        </div>
      </div>
    </div>
  )
}
