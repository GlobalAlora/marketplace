import RevealSection from '@/components/ui/RevealSection'

const BG_URL = 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1600'

export default function SobreNosotros() {
  return (
    <section className="relative overflow-hidden bg-[#0D0F14]" aria-labelledby="sobre-nosotros-heading">

      {/* Fondo con efecto parallax en desktop */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-scroll lg:bg-fixed"
        style={{ backgroundImage: `url(${BG_URL})` }}
        aria-hidden="true"
      />
      {/* Overlay degradado profundo */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(13,15,20,0.97) 0%, rgba(7,21,38,0.95) 50%, rgba(13,15,20,0.97) 100%)' }}
        aria-hidden="true"
      />
      {/* Acento de color */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] opacity-[0.06] pointer-events-none" style={{ background: 'radial-gradient(circle, #282F8F 0%, transparent 70%)' }} aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-[0.05] pointer-events-none" style={{ background: 'radial-gradient(circle, #FFC107 0%, transparent 70%)' }} aria-hidden="true" />

      <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-20 sm:py-28">

        <RevealSection>
          {/* Label */}
          <p className="text-xs font-semibold text-[#FFC107] uppercase tracking-widest mb-4">
            Sobre nosotros
          </p>
          <h2
            id="sobre-nosotros-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-3xl"
          >
            Simplificamos la forma de{' '}
            <span className="text-[#FFC107]">encontrar y explorar</span>{' '}
            vehículos.
          </h2>
        </RevealSection>

        <RevealSection delay={120} className="mt-8 max-w-3xl">
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            AUTODUX nace para simplificar la forma en que las personas encuentran y exploran
            vehículos, centralizando la información en una plataforma moderna, organizada y confiable.
            Ayudamos a los usuarios a descubrir y comparar opciones, ahorrando tiempo y facilitando la
            toma de decisiones.
          </p>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mt-4">
            Al mismo tiempo, brindamos a las agencias una herramienta de trabajo que les permite
            gestionar su inventario, acceder a métricas relevantes y obtener una visión más completa
            del mercado. Combinamos tecnología, organización y datos para aportar mayor eficiencia,
            transparencia y oportunidades de crecimiento a todo el ecosistema automotor.
          </p>
        </RevealSection>

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
          <RevealSection delay={200}>
            <div
              className="rounded-2xl p-8 h-full"
              style={{ background: 'rgba(40,47,143,0.15)', border: '1px solid rgba(40,47,143,0.4)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#282F8F] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-white uppercase tracking-wide">Misión</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Simplificar la búsqueda y compra de vehículos en la Patagonia, reuniendo toda la oferta del
                mercado en un solo lugar para que las personas puedan comparar, elegir y decidir mejor,
                sin perder tiempo recorriendo agencias ni filtrando publicaciones dispersas en redes sociales.
              </p>
            </div>
          </RevealSection>

          <RevealSection delay={300}>
            <div
              className="rounded-2xl p-8 h-full"
              style={{ background: 'rgba(255,193,7,0.07)', border: '1px solid rgba(255,193,7,0.25)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFC107] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#0D0F14]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-white uppercase tracking-wide">Visión</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Ser la plataforma de referencia en compra y venta de vehículos de la Patagonia, presente
                en cada ciudad de Chubut, Santa Cruz, Río Negro y Neuquén, y reconocida por transformar
                la forma en que las personas acceden al mercado automotor de la región.
              </p>
            </div>
          </RevealSection>
        </div>

      </div>
    </section>
  )
}
