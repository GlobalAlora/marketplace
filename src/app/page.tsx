import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import Hero from '@/components/vehiculos/Hero'
import GrillaVehiculos from '@/components/vehiculos/GrillaVehiculos'
import SeccionBeneficios from '@/components/vehiculos/SeccionBeneficios'
import PanelLoginHero from '@/components/auth/PanelLoginHero'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'

const destacados = MOCK_VEHICULOS.filter(v => v.destacado)

export default function Home() {
  return (
    <MainLayout>
      <Hero panelLogin={<PanelLoginHero />} />

      {/* Autos destacados */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-[#0D0F14]">Autos destacados</h2>
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
        </div>
      </section>

      <SeccionBeneficios />

      {/* Todos los vehículos */}
      <section className="bg-[#F5F6FA] py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-[#0D0F14]">Todos los vehículos</h2>
            <p className="text-sm text-gray-500 mt-1">
              {MOCK_VEHICULOS.length} publicaciones disponibles
            </p>
          </div>
          <GrillaVehiculos vehiculos={MOCK_VEHICULOS} />
        </div>
      </section>
    </MainLayout>
  )
}
