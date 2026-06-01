// TODO: conectar a tabla banners en Supabase
// Props actuales son hardcoded desde mock-banner.ts.
// Cuando el backend esté listo, recibir el banner desde un server component
// que haga fetch a la tabla `banners` de Supabase.

import type { Banner } from '@/lib/utils/mock-banner'

interface BannerPublicitarioProps {
  banner: Banner
}

export default function BannerPublicitario({ banner }: BannerPublicitarioProps) {
  // Si el banner está desactivado desde el admin, no renderiza nada
  if (!banner.activo) return null

  return (
    <div className="w-full">
      {/* Texto "Publicidad" requerido por buenas prácticas de transparencia */}
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1.5 text-center">
        Publicidad
      </p>
      <a
        href={banner.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:opacity-95 transition-all duration-200"
        aria-label="Ir al sitio del anunciante"
      >
        <img
          src={banner.imagen_url}
          alt="Espacio publicitario"
          width={260}
          height={400}
          className="w-full object-cover block"
          loading="lazy"
        />
      </a>
    </div>
  )
}
