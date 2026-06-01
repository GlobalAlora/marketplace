import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import Hero from '@/components/vehiculos/Hero'
import GrillaVehiculos from '@/components/vehiculos/GrillaVehiculos'
import CardDestacado from '@/components/vehiculos/CardDestacado'
import SeccionBeneficios from '@/components/vehiculos/SeccionBeneficios'
import SidebarFiltros from '@/components/vehiculos/SidebarFiltros'
import PanelLoginHero from '@/components/auth/PanelLoginHero'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'

// ADMIN ONLY: El campo `destacado` en un vehículo solo puede ser activado
// por un usuario con role === 'admin' (ver types/index.ts y tabla profiles en Supabase).
// Los usuarios particulares y agencias NO pueden automarcar sus publicaciones como destacadas.
// Es un producto comercial gestionado por el equipo AUTODUX.
const destacados = MOCK_VEHICULOS.filter(v => v.destacado).slice(0, 4)

const ultimosPublicados = [...MOCK_VEHICULOS]
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  .slice(0, 4)

export default function Home() {
  return (
    <MainLayout>
      {/* Hero: headline + login panel */}
      <Hero panelLogin={<PanelLoginHero />} />

      {/* Sección Destacados — fondo oscuro propio, fuera del área principal */}
      <section className="bg-gradient-to-br from-[#0D0F14] to-[#1a1a2e]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-14">

          {/* Encabezado de sección */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                ⭐ Autos Destacados
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Seleccionados por el equipo AUTODUX
              </p>
            </div>
            <Link
              href="/vehiculos"
              className="text-sm font-semibold text-[#FFC107] hover:text-yellow-300 transition-colors shrink-0"
            >
              Ver todos →
            </Link>
          </div>

          {/* Cards destacados — apiladas verticalmente */}
          <div className="flex flex-col gap-5">
            {destacados.map(v => (
              <CardDestacado key={v.id} vehiculo={v} />
            ))}
          </div>

        </div>
      </section>

      {/* Main area: sidebar + content sections */}
      <div className="bg-[#F5F6FA]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-start">

            {/* Sidebar filtros — colapsable en mobile, sticky en desktop */}
            <SidebarFiltros />

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
