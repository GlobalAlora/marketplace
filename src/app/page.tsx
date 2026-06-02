import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import Hero from '@/components/vehiculos/Hero'
import GrillaVehiculos from '@/components/vehiculos/GrillaVehiculos'
import SeccionDestacados from '@/components/vehiculos/SeccionDestacados'
import SeccionBeneficios from '@/components/vehiculos/SeccionBeneficios'
import BannerPublicitario from '@/components/ui/BannerPublicitario'
import BannerPopupMobile from '@/components/ui/BannerPopupMobile'
import RevealSection from '@/components/ui/RevealSection'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'
import { MOCK_BANNERS } from '@/lib/utils/mock-banner'

const byDate = (a: { created_at: string }, b: { created_at: string }) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()

const destacados = MOCK_VEHICULOS.filter(v => v.destacado).sort(byDate).slice(0, 3)
const ultimosPublicados = [...MOCK_VEHICULOS].sort(byDate).slice(0, 4)

export default function Home() {
  return (
    <MainLayout>
      <Hero />

      {/* Banner mobile — solo mobile, debajo del hero */}
      <div className="px-4 sm:px-8 py-2 bg-[#071526] lg:hidden">
        <BannerPublicitario banner={MOCK_BANNERS.mobile_top} />
      </div>

      {/* Vitrina AUTODUX — sin RevealSection: está sobre el fold, evita flash de blanco */}
      <SeccionDestacados vehiculos={destacados} />

      {/* Banner horizontal */}
      <div className="bg-[#071526]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-3">
          <BannerPublicitario banner={MOCK_BANNERS.horizontal_top} />
        </div>
      </div>

      {/* Últimos publicados — preview de 4, CTA hacia /vehiculos */}
      <div className="bg-[#071526]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-10">
          <RevealSection>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-extrabold text-white">Últimos publicados</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {MOCK_VEHICULOS.length} publicaciones disponibles en la Patagonia
                </p>
              </div>
              <Link
                href="/vehiculos"
                className="text-sm font-semibold text-[#FFC107] hover:text-white transition-colors shrink-0"
              >
                Ver todos →
              </Link>
            </div>

            <GrillaVehiculos vehiculos={ultimosPublicados} />

            {/* CTA al listado completo */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/vehiculos"
                className="inline-flex items-center gap-2 bg-[#282F8F] text-white font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-[#1f2570] active:scale-[0.98] transition-all"
              >
                Ver los {MOCK_VEHICULOS.length} vehículos disponibles
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </RevealSection>
        </div>
      </div>

      <RevealSection>
        <SeccionBeneficios />
      </RevealSection>

      <BannerPopupMobile banner={MOCK_BANNERS.mobile_popup} />
    </MainLayout>
  )
}
