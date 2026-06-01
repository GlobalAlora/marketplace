// TODO: conectar a tabla banners en Supabase
// Props actuales son mock. Cuando el backend esté listo, este componente recibirá
// el banner desde un server component que haga fetch a tabla `banners`
// filtrado por posicion. Cada posicion tiene 1 banner activo a la vez.

import type { Banner } from '@/lib/utils/mock-banner'

interface BannerPublicitarioProps {
  banner: Banner
}

// Label estándar de transparencia requerido en todas las variantes
function LabelPublicidad({ center = false }: { center?: boolean }) {
  return (
    <p
      className={`text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1 ${
        center ? 'text-center' : ''
      }`}
    >
      Publicidad
    </p>
  )
}

export default function BannerPublicitario({ banner }: BannerPublicitarioProps) {
  if (!banner.activo) return null

  // ─── Banners horizontales (leaderboard) ─────────────────────────────────────
  // Posiciones: horizontal_top (debajo de destacados) y horizontal_mid (entre secciones)
  // Tamaño estándar IAB Leaderboard: 100% ancho × 90px altura
  if (banner.posicion === 'horizontal_top' || banner.posicion === 'horizontal_mid') {
    return (
      <div className="w-full hidden sm:block">
        <LabelPublicidad center />
        <a
          href={banner.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-xl shadow-sm hover:opacity-95 hover:shadow-md transition-all duration-200"
          aria-label="Ir al sitio del anunciante"
        >
          <img
            src={banner.imagen_url}
            alt="Espacio publicitario"
            width={1200}
            height={90}
            className="w-full h-[90px] object-cover block"
            loading="lazy"
          />
        </a>
      </div>
    )
  }

  // ─── Banner mobile top ───────────────────────────────────────────────────────
  // Solo visible en mobile (lg:hidden). Slim strip debajo del hero.
  if (banner.posicion === 'mobile_top') {
    return (
      <div className="w-full lg:hidden">
        <LabelPublicidad center />
        <a
          href={banner.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-xl shadow-sm hover:opacity-95 transition-opacity"
          aria-label="Ir al sitio del anunciante"
        >
          <img
            src={banner.imagen_url}
            alt="Espacio publicitario"
            width={800}
            height={60}
            className="w-full h-[60px] object-cover block"
            loading="lazy"
          />
        </a>
      </div>
    )
  }

  // ─── Banner sidebar (vertical) ───────────────────────────────────────────────
  // Posición por defecto. 260×400px, visible en desktop dentro del aside izquierdo.
  return (
    <div className="w-full">
      <LabelPublicidad center />
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
