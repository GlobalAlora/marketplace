'use client'

// TODO: conectar a tabla banners en Supabase — posicion === 'mobile_popup'
// Por ahora usa datos mock. En producción, el banner se carga desde Supabase.
// Este componente es 'use client' porque necesita estado para el dismiss.

import { useState } from 'react'
import type { Banner } from '@/types'

interface BannerPopupMobileProps {
  banner: Banner
}

export default function BannerPopupMobile({ banner }: BannerPopupMobileProps) {
  const [dismissed, setDismissed] = useState(false)

  // Solo visible en mobile. En desktop el sidebar izquierdo cumple ese rol.
  if (!banner.activo || dismissed) return null

  return (
    <div
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]"
      role="complementary"
      aria-label="Publicidad"
    >
      <div className="relative bg-white border-t border-gray-100">
        {/* Label + botón dismiss */}
        <div className="flex items-center justify-between px-3 py-1 bg-gray-50 border-b border-gray-100">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
            Publicidad
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 -mr-1 rounded"
            aria-label="Cerrar publicidad"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Imagen con link */}
        <a
          href={banner.link_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ir al sitio del anunciante"
          className="block hover:opacity-95 transition-opacity"
        >
          <img
            src={banner.imagen_url}
            alt="Espacio publicitario"
            width={640}
            height={100}
            className="w-full h-[80px] object-cover block"
          />
        </a>
      </div>
    </div>
  )
}
