import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import Hero from '@/components/vehiculos/Hero'
import GrillaVehiculos from '@/components/vehiculos/GrillaVehiculos'
import GrillaConPaginacion from '@/components/vehiculos/GrillaConPaginacion'
import SeccionDestacados from '@/components/vehiculos/SeccionDestacados'
import SeccionBeneficios from '@/components/vehiculos/SeccionBeneficios'
import FiltrosHorizontales from '@/components/vehiculos/FiltrosHorizontales'
import BannerPublicitario from '@/components/ui/BannerPublicitario'
import BannerPopupMobile from '@/components/ui/BannerPopupMobile'
import RevealSection from '@/components/ui/RevealSection'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'
import { MOCK_BANNERS } from '@/lib/utils/mock-banner'

const byDate = (a: { created_at: string }, b: { created_at: string }) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()

const destacados = MOCK_VEHICULOS.filter(v => v.destacado).sort(byDate).slice(0, 3)

const vehiculosOrdenados = [
  ...MOCK_VEHICULOS.filter(v => v.destacado).sort(byDate),
  ...MOCK_VEHICULOS.filter(v => !v.destacado).sort(byDate),
]

const ultimosPublicados = [...MOCK_VEHICULOS].sort(byDate).slice(0, 4)

export default function Home() {
  return (
    <MainLayout>
      {/* Hero: headline + animated subtitle + 3 user-type cards */}
      <Hero />

      {/* Banner mobile top — solo mobile, debajo del hero */}
      <div className="px-4 sm:px-8 py-2 bg-[#071526] lg:hidden">
        <BannerPublicitario banner={MOCK_BANNERS.mobile_top} />
      </div>

      {/* Vitrina AUTODUX — fondo azul oscuro */}
      <RevealSection>
        <SeccionDestacados vehiculos={destacados} />
      </RevealSection>

      {/* Banner horizontal top */}
      <div className="bg-[#071526]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-3">
          <BannerPublicitario banner={MOCK_BANNERS.horizontal_top} />
        </div>
      </div>

      {/* Filtros horizontales */}
      <div className="bg-[#071526] border-b border-white/8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-3">
          <FiltrosHorizontales />
        </div>
      </div>

      {/* Main area: content + right banner */}
      <div className="bg-[#071526]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 pt-6 pb-10">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Content columns */}
            <div className="flex-1 min-w-0 flex flex-col gap-10">

              {/* Últimos publicados */}
              <RevealSection>
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-extrabold text-white">Últimos publicados</h2>
                      <p className="text-sm text-gray-400 mt-0.5">Recién agregados</p>
                    </div>
                    <Link
                      href="/vehiculos"
                      className="text-sm font-semibold text-[#FFC107] hover:text-white transition-colors"
                    >
                      Ver todos →
                    </Link>
                  </div>
                  <GrillaVehiculos vehiculos={ultimosPublicados} />
                </section>
              </RevealSection>

              {/* Banner horizontal mid */}
              <BannerPublicitario banner={MOCK_BANNERS.horizontal_mid} />

              {/* Todos los vehículos */}
              <RevealSection delay={100}>
                <section>
                  <div className="mb-5">
                    <h2 className="text-xl font-extrabold text-white">Todos los vehículos</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {MOCK_VEHICULOS.length} publicaciones disponibles
                    </p>
                  </div>
                  <GrillaConPaginacion vehiculos={vehiculosOrdenados} initialLimit={8} pageSize={8} />
                </section>
              </RevealSection>

            </div>

            {/* Right sidebar: banner sticky */}
            <aside className="w-[220px] shrink-0 hidden xl:block">
              <div className="sticky top-20">
                <BannerPublicitario banner={MOCK_BANNERS.sidebar_right} />
              </div>
            </aside>

          </div>
        </div>
      </div>

      <RevealSection>
        <SeccionBeneficios />
      </RevealSection>

      {/* Banner popup mobile */}
      <BannerPopupMobile banner={MOCK_BANNERS.mobile_popup} />
    </MainLayout>
  )
}
