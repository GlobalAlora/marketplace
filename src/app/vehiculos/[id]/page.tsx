import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import MainLayout from '@/components/layout/MainLayout'
import GaleriaImagenes from '@/components/vehiculos/GaleriaImagenes'
import InfoVehiculo from '@/components/vehiculos/InfoVehiculo'
import BotonWhatsApp from '@/components/vehiculos/BotonWhatsApp'
import VehiculoCard from '@/components/vehiculos/VehiculoCard'
import BannerPublicitario from '@/components/ui/BannerPublicitario'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'
import { MOCK_BANNERS } from '@/lib/utils/mock-banner'

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

  // Vehículos similares: destacados primero > misma marca > rango de precio similar
  const similares = MOCK_VEHICULOS
    .filter(v => v.id !== vehiculo.id && v.activo && !v.vendido)
    .map(v => {
      const priceDiff = Math.abs(v.precio - vehiculo.precio) / vehiculo.precio
      const score =
        (v.destacado ? 100 : 0) +
        (v.marca === vehiculo.marca ? 50 : 0) +
        (priceDiff <= 0.3 ? 25 : 0)
      return { v, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ v }) => v)

  const esAgencia =
    vehiculo.profiles?.role === 'agencia_premium' ||
    vehiculo.profiles?.role === 'agencia_basica'

  const nombreVendedor = (vehiculo.profiles?.nombre_agencia ??
    `${vehiculo.profiles?.nombre ?? ''} ${vehiculo.profiles?.apellido ?? ''}`.trim()) ||
    'este vendedor'

  const agenciaHref = esAgencia
    ? `/agencias/${vehiculo.profiles?.id ?? vehiculo.user_id}`
    : `/usuarios/${vehiculo.profiles?.id ?? vehiculo.user_id}`

  return (
    <MainLayout>
      <div className="bg-[#0D0F14] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

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

          {/* Layout 3 columnas: info izq | galería centro | banner der */}
          {/* En mobile: galería primero, luego info */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 lg:items-start">

            {/* Columna izquierda: info + CTA (orden 2 en mobile, 1 en desktop) */}
            <div className="w-full lg:w-[300px] xl:w-[320px] lg:shrink-0 lg:sticky lg:top-24 flex flex-col gap-5 order-2 lg:order-1">
              <InfoVehiculo vehiculo={vehiculo} />
              {vehiculo.profiles?.telefono && (
                <BotonWhatsApp
                  telefono={vehiculo.profiles.telefono}
                  marca={vehiculo.marca}
                  modelo={vehiculo.modelo}
                  año={vehiculo.año}
                />
              )}
            </div>

            {/* Columna central: galería (orden 1 en mobile, 2 en desktop) */}
            <div className="flex-1 min-w-0 order-1 lg:order-2">
              <GaleriaImagenes imagenes={vehiculo.imagenes} titulo={vehiculo.titulo} />
            </div>

            {/* Columna derecha: banner publicitario vertical */}
            <div className="w-full lg:w-[200px] xl:w-[220px] lg:shrink-0 hidden lg:block order-3">
              <div className="sticky top-24">
                <BannerPublicitario banner={MOCK_BANNERS.sidebar_right} />
              </div>
            </div>

          </div>
        </div>

        {/* Secciones de recomendación */}
        {(masDelVendedor.length > 0 || similares.length > 0) && (
          <div className="mt-6 border-t border-white/5">

            {/* Más vehículos de este vendedor */}
            {masDelVendedor.length > 0 && (
              <section className="bg-[#071526] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-xl font-extrabold text-white mb-6">
                    Más vehículos de{' '}
                    <Link
                      href={agenciaHref}
                      className="text-[#FFC107] hover:text-white transition-colors underline underline-offset-2"
                    >
                      {nombreVendedor}
                    </Link>
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
              <section className={`py-12 ${masDelVendedor.length > 0 ? 'bg-[#0D0F14] border-t border-white/5' : 'bg-[#071526]'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-xl font-extrabold text-white mb-2">
                    Vehículos similares
                  </h2>
                  <p className="text-sm text-gray-400 mb-6">Destacados primero, luego por marca y precio.</p>
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
