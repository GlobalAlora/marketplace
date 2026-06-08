import type { Banner } from '@/types'

interface BannerPublicitarioProps {
  banner: Banner
}

function LabelPublicidad({ center = false }: { center?: boolean }) {
  return (
    <p
      className={`text-[10px] font-medium text-gray-600 uppercase tracking-widest mb-1.5 ${
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
  if (!banner.posicion.startsWith('sidebar') && banner.posicion !== 'mobile_top') {
    return (
      <div className="w-full hidden sm:block">
        <LabelPublicidad center />
        <a
          href={banner.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-2xl shadow-md hover:opacity-95 hover:shadow-lg hover:shadow-black/30 transition-all duration-200 ring-1 ring-white/8"
          aria-label="Ir al sitio del anunciante"
        >
          <img
            src={banner.imagen_url}
            alt="Espacio publicitario"
            width={1200}
            height={120}
            className="w-full h-[120px] object-cover block"
            loading="lazy"
          />
        </a>
      </div>
    )
  }

  // ─── Banner mobile top ───────────────────────────────────────────────────────
  if (banner.posicion === 'mobile_top') {
    return (
      <div className="w-full lg:hidden">
        <LabelPublicidad center />
        <a
          href={banner.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-xl shadow-sm hover:opacity-95 transition-opacity ring-1 ring-white/8"
          aria-label="Ir al sitio del anunciante"
        >
          <img
            src={banner.imagen_url}
            alt="Espacio publicitario"
            width={800}
            height={72}
            className="w-full h-[72px] object-cover block"
            loading="lazy"
          />
        </a>
      </div>
    )
  }

  // ─── Banner sidebar vertical ─────────────────────────────────────────────────
  return (
    <div className="w-full">
      <LabelPublicidad center />
      <a
        href={banner.link_url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-black/30 hover:opacity-95 transition-all duration-200 ring-1 ring-white/8"
        aria-label="Ir al sitio del anunciante"
      >
        <img
          src={banner.imagen_url}
          alt="Espacio publicitario"
          width={220}
          height={320}
          className="w-full h-[320px] object-cover block"
          loading="lazy"
        />
      </a>
    </div>
  )
}
