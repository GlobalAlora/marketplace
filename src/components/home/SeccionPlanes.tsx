import RevealSection from '@/components/ui/RevealSection'

interface Plan {
  nombre: string
  subtitulo: string
  precio: string
  precioSub: string
  destacado: boolean
  features: string[]
  ctaLabel: string
}

const PLANES: Plan[] = [
  {
    nombre: 'Particular',
    subtitulo: 'Para personas que quieren vender su auto',
    precio: 'Gratis',
    precioSub: 'para siempre',
    destacado: false,
    features: [
      'Hasta 2 publicaciones activas',
      'Fotos y descripción del vehículo',
      'Contacto directo por WhatsApp',
      'Perfil público de vendedor',
      'Panel de gestión básico',
    ],
    ctaLabel: 'Comenzar gratis',
  },
  {
    nombre: 'Agencia Básica',
    subtitulo: 'Para agencias que quieren crecer online',
    precio: 'A consultar',
    precioSub: 'por mes',
    destacado: true,
    features: [
      'Hasta 20 publicaciones activas',
      'Perfil de agencia verificada',
      'Métricas de vistas y contactos',
      'Destacados en listados',
      'Soporte prioritario',
      'Logo y branding propio',
    ],
    ctaLabel: 'Consultar precio',
  },
  {
    nombre: 'Agencia Premium',
    subtitulo: 'Para agencias que quieren máxima visibilidad',
    precio: 'A consultar',
    precioSub: 'por mes',
    destacado: false,
    features: [
      'Publicaciones ilimitadas',
      'Posición preferencial en búsquedas',
      'Banners publicitarios en plataforma',
      'Analítica avanzada de mercado',
      'Integración con sistema de gestión',
      'Ejecutivo de cuenta dedicado',
    ],
    ctaLabel: 'Consultar precio',
  },
]

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

export default function SeccionPlanes() {
  return (
    <section
      className="bg-[#071526] py-16 sm:py-20"
      style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      aria-labelledby="planes-heading"
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">

        <RevealSection className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-full px-4 py-1.5 mb-5">
            <svg className="w-3.5 h-3.5 text-[#FFC107]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold text-[#FFC107] uppercase tracking-widest">Próximamente</span>
          </div>
          <h2 id="planes-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
            Planes y precios
          </h2>
          <p className="mt-3 text-gray-400 text-base max-w-xl mx-auto">
            Estamos trabajando en un sistema de planes flexible para particulares y agencias. Dejá tu contacto y te avisamos cuando esté disponible.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANES.map((plan, i) => (
            <RevealSection key={plan.nombre} delay={i * 100}>
              <div
                className={`relative rounded-2xl h-full flex flex-col transition-all duration-300 hover:shadow-xl ${
                  plan.destacado
                    ? 'bg-gradient-to-b from-[#282F8F]/30 to-[#1a1f6b]/20 border-2 border-[#282F8F]/60 shadow-lg shadow-[#282F8F]/20 hover:shadow-[#282F8F]/30'
                    : 'bg-white/4 border border-white/10 hover:border-white/20'
                }`}
              >
                {plan.destacado && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#282F8F] text-white text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                      Más popular
                    </span>
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-lg font-extrabold text-white">{plan.nombre}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">{plan.subtitulo}</p>
                  </div>

                  {/* Precio */}
                  <div className="mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <span
                      className={`text-3xl font-black ${plan.destacado ? 'text-[#7cb9ff]' : 'text-white'}`}
                    >
                      {plan.precio}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">{plan.precioSub}</span>
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-3 flex-1" role="list">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className={`mt-0.5 ${plan.destacado ? 'text-[#7cb9ff]' : 'text-[#FFC107]'}`}>
                          <CheckIcon />
                        </span>
                        <span className="text-sm text-gray-300 leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    disabled
                    className={`mt-8 w-full py-3 rounded-xl text-sm font-bold transition-all cursor-not-allowed opacity-50 ${
                      plan.destacado
                        ? 'bg-[#282F8F] text-white'
                        : 'bg-white/8 text-gray-300 border border-white/15'
                    }`}
                    aria-label={`${plan.ctaLabel} — próximamente disponible`}
                  >
                    {plan.ctaLabel}
                  </button>
                  <p className="text-center text-xs text-gray-600 mt-2">Disponible próximamente</p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>

      </div>
    </section>
  )
}
