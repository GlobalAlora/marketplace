'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Global error]', error)
  }, [error])

  return (
    <html lang="es">
      <body className="min-h-screen bg-[#0D0F14] flex items-center justify-center p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-red-400 font-semibold mb-2">Ocurrió un error inesperado</p>
          <p className="text-xs text-gray-500 mb-6 font-mono">{error.digest}</p>
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-bold bg-[#FFC107] hover:bg-yellow-400 text-[#0D0F14] rounded-xl transition-colors"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
