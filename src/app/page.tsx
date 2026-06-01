import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import Hero from '@/components/vehiculos/Hero'
import GrillaVehiculos from '@/components/vehiculos/GrillaVehiculos'
import SeccionDestacados from '@/components/vehiculos/SeccionDestacados'
import SeccionBeneficios from '@/components/vehiculos/SeccionBeneficios'
import SidebarFiltros from '@/components/vehiculos/SidebarFiltros'
import BannerPublicitario from '@/components/ui/BannerPublicitario'
import BannerPopupMobile from '@/components/ui/BannerPopupMobile'
import PanelLoginHero from '@/components/auth/PanelLoginHero'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'
import { MOCK_BANNERS } from '@/lib/utils/mock-banner'

const byDate = (a: { created_at: string }, b: { created_at: string }) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()

// ADMIN ONLY: solo role === 'admin' puede marcar un vehículo como destacado.
const destacados = MOCK_VEHICULOS.filter(v => v.destacado).sort(byDate).slice(0, 3)

// Destacados primero (por fecha), luego el resto (por fecha).
const vehiculosOrdenados = [
  ...MOCK_VEHICULOS.filter(v => v.destacado).sort(byDate),
  ...MOCK_VEHICULOS.filter(v => !v.destacado).sort(byDate),
]

const ultimosPublicados = [...MOCK_VEHICULOS].sort(byDate).slice(0, 4)

export default function Home() {
  return (
    <MainLayout>
      {/* Hero: headline + login panel */}
      <Hero panelLogin={<PanelLoginHero />} />

      {/* Banner mobile top — solo mobile, debajo del hero (lg:hidden inside component) */}
      <div className="px-4 sm:px-8 py-2 bg-white lg:hidden">
        <BannerPublicitario banner={MOCK_BANNERS.mobile_top} />
      </div>

      {/* Sección Autos Destacados — bento editorial, fondo blanco */}
      <SeccionDestacados vehiculos={destacados} />

      {/* Banner horizontal top — debajo de destacados, ancho completo */}
      <div className="bg-[#F5F6FA]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-3">
          <BannerPublicitario banner={MOCK_BANNERS.horizontal_top} />
        </div>
      </div>

      {/* Main area: sidebar + content sections */}
      <div className="bg-[#F5F6FA]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 pt-4 pb-10">
          {/*
            Sin items-start — align-self: stretch (default) hace que el aside izquierdo
            tenga la misma altura que la columna de contenido, permitiendo sticky.
          */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Columna izquierda: filtros + banner sidebar, sticky como unidad */}
            <aside className="w-[260px] shrink-0 hidden lg:block">
              <div className="sticky top-20 flex flex-col gap-4">
                <SidebarFiltros />
                <BannerPublicitario banner={MOCK_BANNERS.sidebar} />
              </div>
            </aside>

            {/* Content columns */}
            <div className="flex-1 min-w-0 flex flex-col gap-10">

              {/* Últimos publicados */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#0D0F14]">Últimos publicados</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Recién agregados</p>
                  </div>
                  <Link
                    href="/vehiculos"
                    className="text-sm font-semibold text-[#282F8F] hover:text-[#FFC107] transition-colors"
                  >
                    Ver todos →
                  </Link>
                </div>
                <GrillaVehiculos vehiculos={ultimosPublicados} />
              </section>

              {/* Banner horizontal mid — entre "Últimos publicados" y "Todos los vehículos" */}
              <BannerPublicitario banner={MOCK_BANNERS.horizontal_mid} />

              {/* Todos los vehículos — destacados al tope */}
              <section>
                <div className="mb-5">
                  <h2 className="text-xl font-extrabold text-[#0D0F14]">Todos los vehículos</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {MOCK_VEHICULOS.length} publicaciones disponibles
                  </p>
                </div>
                <GrillaVehiculos vehiculos={vehiculosOrdenados} />
              </section>

            </div>
          </div>
        </div>
      </div>

      <SeccionBeneficios />

      {/* Banner popup mobile — barra fija inferior, solo mobile, dismissable */}
      <BannerPopupMobile banner={MOCK_BANNERS.mobile_popup} />
    </MainLayout>
  )
}
