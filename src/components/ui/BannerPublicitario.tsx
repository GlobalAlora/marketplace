import type { Banner } from '@/types'

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
  // home_top / home_mid / home_bottom / vehiculos_top / vehiculos_mid
  if (!banner.posicion.startsWith('sidebar') && banner.posicion !== 'mobile_top') {
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

  // ─── Banner sidebar vertical — 220×300px ────────────────────────────────────
  return (
    <div className="w-full">
      <LabelPublicidad center />
      <a
        href={banner.link_url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:opacity-95 transition-all duration-200"
        aria-label="Ir al sitio del anunciante"
      >
        <img
          src={banner.imagen_url}
          alt="Espacio publicitario"
          width={220}
          height={300}
          className="w-full h-[300px] object-cover block"
          loading="lazy"
        />
      </a>
    </div>
  )
}
