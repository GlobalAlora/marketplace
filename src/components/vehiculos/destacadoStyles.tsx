// ── Design tokens y elementos visuales compartidos para vehículos destacados ──
// Usado por SeccionDestacados (Vitrina) y VehiculoCard para que todas las
// publicaciones destacadas tengan el mismo estilo: fondo blanco, texto negro,
// cinta "VITRINA" y escudo con estrella.

export const GOLD       = '#FFC107'
export const GOLD_LIGHT = '#FFD033'
export const GOLD_DARK  = '#E5A800'
export const NAVY       = '#0C1D36'
export const NAVY_LIGHT = '#162B4A'

/** Diagonal corner ribbon "VITRINA" in the top-left. */
export function CornerRibbon({ small = false }: { small?: boolean }) {
  const size   = small ? 90  : 110
  const stripW = 300
  const stripH = small ? 18  : 24
  const fsize  = small ? '8px' : '9.5px'

  return (
    <div
      className="absolute top-0 left-0 overflow-hidden z-10 pointer-events-none"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute font-black text-center select-none"
        style={{
          top:    small ? 18 : 27,
          left:   Math.round((size - stripW) / 2),
          width:  stripW,
          height: stripH,
          lineHeight: `${stripH}px`,
          transform: 'rotate(-45deg)',
          transformOrigin: 'center center',
          background: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, ${GOLD_DARK} 100%)`,
          color: NAVY,
          fontSize: fsize,
          letterSpacing: '0.2em',
        }}
      >
        VITRINA
      </div>
    </div>
  )
}

/** Downward-shield badge with star in the top-right */
export function ShieldBadge({ small = false }: { small?: boolean }) {
  const w = small ? 38 : 46
  const h = small ? 46 : 56
  return (
    <div className="absolute top-0 right-4 z-10 pointer-events-none" style={{ width: w, height: h }}>
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, ${GOLD_DARK} 100%)`,
          clipPath: 'polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%)',
          boxShadow: `0 4px 16px ${GOLD}66`,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill={NAVY}
          style={{ width: small ? 15 : 19, height: small ? 15 : 19, marginTop: small ? -4 : -6 }}
          aria-hidden="true"
        >
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
        </svg>
      </div>
    </div>
  )
}

export function IconVitrina({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M12 2L14.2 9.8H22L15.9 14.4L18.1 22L12 17.4L5.9 22L8.1 14.4L2 9.8H9.8L12 2Z" />
    </svg>
  )
}
