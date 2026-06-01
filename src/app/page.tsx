import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import Hero from '@/components/vehiculos/Hero'
import GrillaVehiculos from '@/components/vehiculos/GrillaVehiculos'
import SeccionBeneficios from '@/components/vehiculos/SeccionBeneficios'
import SidebarFiltros from '@/components/vehiculos/SidebarFiltros'
import PanelLoginHero from '@/components/auth/PanelLoginHero'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'

const destacados = MOCK_VEHICULOS.filter(v => v.destacado)

const ultimosPublicados = [...MOCK_VEHICULOS]
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  .slice(0, 4)

export default function Home() {
  return (
    <MainLayout>
      {/* Hero: headline + login panel */}
      <Hero panelLogin={<PanelLoginHero />} />

      {/* Main area: sidebar + content sections */}
      <div className="bg-[#F5F6FA]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-start">

            {/* Sidebar filtros — colapsable en mobile, sticky en desktop */}
            <SidebarFiltros />

            {/* Content columns */}
            <div className="flex-1 min-w-0 flex flex-col gap-10">

              {/* Autos destacados */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold text-[#0D0F14]">Autos destacados</h2>
                    <span className="bg-[#FFC107] text-[#0D0F14] text-xs font-extrabold px-2.5 py-1 rounded-full">
                      ★ Selección
                    </span>
                  </div>
                  <Link
                    href="/vehiculos"
                    className="text-sm font-semibold text-[#282F8F] hover:text-[#FFC107] transition-colors"
                  >
                    Ver todos →
                  </Link>
                </div>
                <GrillaVehiculos vehiculos={destacados} />
              </section>

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

              {/* Todos los vehículos */}
              <section>
                <div className="mb-5">
                  <h2 className="text-xl font-extrabold text-[#0D0F14]">Todos los vehículos</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {MOCK_VEHICULOS.length} publicaciones disponibles
                  </p>
                </div>
                <GrillaVehiculos vehiculos={MOCK_VEHICULOS} />
              </section>

            </div>
          </div>
        </div>
      </div>

      <SeccionBeneficios />
    </MainLayout>
  )
}
