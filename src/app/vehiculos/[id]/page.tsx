import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import MainLayout from '@/components/layout/MainLayout'
import GaleriaImagenes from '@/components/vehiculos/GaleriaImagenes'
import InfoVehiculo from '@/components/vehiculos/InfoVehiculo'
import BotonWhatsApp from '@/components/vehiculos/BotonWhatsApp'
import VehiculoCard from '@/components/vehiculos/VehiculoCard'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const vehiculo = MOCK_VEHICULOS.find(v => v.id === id)
  if (!vehiculo) return { title: 'Vehículo no encontrado — AUTODUX' }
  return {
    title: `${vehiculo.titulo} — AUTODUX`,
    description: vehiculo.descripcion,
  }
}

export default async function VehiculoPage({ params }: PageProps) {
  const { id } = await params
  const vehiculo = MOCK_VEHICULOS.find(v => v.id === id)

  if (!vehiculo) notFound()

  // Más vehículos del mismo vendedor (excluye el actual, máx 3)
  const masDelVendedor = MOCK_VEHICULOS
    .filter(v => v.user_id === vehiculo.user_id && v.id !== vehiculo.id && v.activo && !v.vendido)
    .slice(0, 3)

  // Vehículos similares: misma marca O precio ±30% (excluye el actual y los del mismo vendedor)
  const precioMin = vehiculo.precio * 0.7
  const precioMax = vehiculo.precio * 1.3
  const similares = MOCK_VEHICULOS
    .filter(v =>
      v.id !== vehiculo.id &&
      v.activo &&
      !v.vendido &&
      (v.marca === vehiculo.marca || (v.precio >= precioMin && v.precio <= precioMax))
    )
    .slice(0, 3)

  const nombreVendedor = vehiculo.profiles?.nombre_agencia ??
    `${vehiculo.profiles?.nombre ?? ''} ${vehiculo.profiles?.apellido ?? ''}`.trim() ||
    'este vendedor'

  return (
    <MainLayout>
      <div className="bg-[#0D0F14] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#FFC107] transition-colors">Inicio</Link>
            <span className="text-gray-600" aria-hidden="true">›</span>
            <Link href="/vehiculos" className="text-gray-500 hover:text-[#FFC107] transition-colors">Vehículos</Link>
            <span className="text-gray-600" aria-hidden="true">›</span>
            <span className="text-gray-300 truncate max-w-[180px] sm:max-w-xs">{vehiculo.titulo}</span>
          </nav>

          {/* Título + badges */}
          <div className="flex flex-wrap items-start gap-3 mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight flex-1 min-w-0">
              {vehiculo.titulo}
            </h1>
            {vehiculo.destacado && (
              <span className="shrink-0 bg-[#FFC107] text-[#0D0F14] text-xs font-extrabold px-3 py-1.5 rounded-full">
                ★ Destacado
              </span>
            )}
          </div>

          {/* Layout principal: galería izq | info derecha */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 lg:items-start">

            {/* Galería */}
            <div className="w-full lg:flex-[3]">
              <GaleriaImagenes imagenes={vehiculo.imagenes} titulo={vehiculo.titulo} />
            </div>

            {/* Info + CTA (sticky en desktop) */}
            <div className="w-full lg:flex-[2] lg:sticky lg:top-8">
              <InfoVehiculo vehiculo={vehiculo} />
              {vehiculo.profiles?.telefono && (
                <div className="mt-5">
                  <BotonWhatsApp
                    telefono={vehiculo.profiles.telefono}
                    marca={vehiculo.marca}
                    modelo={vehiculo.modelo}
                    año={vehiculo.año}
                  />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Secciones de recomendación — sobre fondo ligeramente más claro */}
        {(masDelVendedor.length > 0 || similares.length > 0) && (
          <div className="mt-6 border-t border-white/5">

            {/* Más vehículos de este vendedor */}
            {masDelVendedor.length > 0 && (
              <section className="bg-[#F5F6FA] py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-xl font-extrabold text-[#0D0F14] mb-6">
                    Más vehículos de <span className="text-[#282F8F]">{nombreVendedor}</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {masDelVendedor.map(v => (
                      <VehiculoCard key={v.id} vehiculo={v} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Vehículos similares */}
            {similares.length > 0 && (
              <section className={`py-12 ${masDelVendedor.length > 0 ? 'bg-white border-t border-gray-100' : 'bg-[#F5F6FA]'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-xl font-extrabold text-[#0D0F14] mb-6">
                    Vehículos similares
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {similares.map(v => (
                      <VehiculoCard key={v.id} vehiculo={v} />
                    ))}
                  </div>
                </div>
              </section>
            )}

          </div>
        )}

      </div>
    </MainLayout>
  )
}
