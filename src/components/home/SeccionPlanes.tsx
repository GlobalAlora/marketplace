import Link from 'next/link'
import RevealSection from '@/components/ui/RevealSection'
import type { SiteConfig } from '@/lib/site-config'
import type { PlanHome } from '@/lib/planes-home'

const WHATSAPP_MSG = encodeURIComponent('Hola! Me interesa conocer más sobre los planes de AUTODUX para agencias.')

function buildWhatsappUrl(num: string) {
  return `https://wa.me/${num}?text=${WHATSAPP_MSG}`
}

interface Plan {
  nombre: string
  subtitulo: string
  precio: string
  precioSub: string
  destacado: boolean
  features: string[]
  ctaLabel: string
  ctaHref: string
  ctaExterno?: boolean
}

function buildPlanes(whatsappUrl: string): Plan[] {
  return [
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
      ctaHref: '/auth/registro',
    },
    {
      nombre: 'Agencia PRIME',
      subtitulo: 'Para agencias que quieren crecer online',
      precio: 'Consultar',
      precioSub: '',
      destacado: false,
      features: [
        '25 publicaciones activas',
        '3 publicaciones destacadas',
        'Perfil de agencia verificada',
        'Panel de métricas',
        'Logo y branding propio',
      ],
      ctaLabel: 'Consultar por WhatsApp',
      ctaHref: whatsappUrl,
      ctaExterno: true,
    },
    {
      nombre: 'Agencia DUX',
      subtitulo: 'Para agencias que quieren máxima visibilidad',
      precio: 'Consultar',
      precioSub: '',
      destacado: true,
      features: [
        '100 publicaciones activas',
        '20 publicaciones destacadas',
        'Perfil de agencia verificada',
        'Soporte prioritario',
        'Panel de métricas',
        'Logo y branding propio',
        'Mayor exposición en búsquedas',
        'Ejecutivo de cuenta dedicado',
      ],
      ctaLabel: 'Consultar por WhatsApp',
      ctaHref: whatsappUrl,
      ctaExterno: true,
    },
  ]
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function SeccionPlanes({ config, planesHome }: { config?: SiteConfig; planesHome?: PlanHome[] }) {
  const whatsappUrl = buildWhatsappUrl(config?.whatsapp_num ?? '5492974015243')
  const planes: Plan[] = planesHome?.length
    ? planesHome.map(p => ({
        nombre: p.nombre,
        subtitulo: p.subtitulo,
        precio: p.precio,
        precioSub: p.precio_sub,
        destacado: p.destacado,
        features: p.features,
        ctaLabel: p.cta_label,
        ctaHref: p.cta_href,
        ctaExterno: p.cta_externo,
      }))
    : buildPlanes(whatsappUrl)
  return (
    <section
      className="bg-[#071526] py-16 sm:py-20"
      aria-labelledby="planes-heading"
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">

        <RevealSection className="text-center mb-12">
          <h2 id="planes-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
            Planes y precios
          </h2>
          <p className="mt-4 text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
            Compará las características de cada opción y elegí la que mejor se adapte a tu volumen
            de publicaciones y objetivos comerciales. Disponemos de planes mensuales, semestrales
            y anuales con bonificaciones especiales de lanzamiento.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {planes.map((plan, i) => (
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
                      Más completo
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
                      className={`text-3xl font-black ${plan.destacado ? 'text-[#7cb9ff]' : plan.precio === 'Gratis' ? 'text-[#FFC107]' : 'text-white'}`}
                    >
                      {plan.precio}
                    </span>
                    {plan.precioSub && (
                      <span className="text-gray-500 text-sm ml-2">{plan.precioSub}</span>
                    )}
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
                  {plan.ctaExterno ? (
                    <a
                      href={plan.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-8 w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97] ${
                        plan.destacado
                          ? 'bg-[#282F8F] hover:bg-[#1e2470] text-white'
                          : 'bg-white/8 hover:bg-white/14 text-gray-200 border border-white/15 hover:border-white/30'
                      }`}
                    >
                      <WhatsAppIcon />
                      {plan.ctaLabel}
                    </a>
                  ) : (
                    <Link
                      href={plan.ctaHref}
                      className="mt-8 w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 bg-[#FFC107] hover:bg-[#e6ad06] text-[#0D0F14] active:scale-[0.97]"
                    >
                      {plan.ctaLabel}
                    </Link>
                  )}
                </div>
              </div>
            </RevealSection>
          ))}
        </div>

      </div>
    </section>
  )
}
