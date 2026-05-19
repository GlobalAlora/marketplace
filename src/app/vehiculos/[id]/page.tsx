import { notFound } from 'next/navigation'
import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import GaleriaImagenes from '@/components/vehiculos/GaleriaImagenes'
import InfoVehiculo from '@/components/vehiculos/InfoVehiculo'
import BotonWhatsApp from '@/components/vehiculos/BotonWhatsApp'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function VehiculoPage({ params }: PageProps) {
  const { id } = await params
  const vehiculo = MOCK_VEHICULOS.find(v => v.id === id)

  if (!vehiculo) notFound()

  return (
    <MainLayout>
      <div className="bg-[#0D0F14] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-[#FFC107] transition-colors">Inicio</Link>
            <span aria-hidden="true">›</span>
            <Link href="/vehiculos" className="hover:text-[#FFC107] transition-colors">Vehículos</Link>
            <span aria-hidden="true">›</span>
            <span className="text-white truncate max-w-[200px]">{vehiculo.titulo}</span>
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

          {/* Contenido principal */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 lg:items-start">

            {/* Izquierda: galería */}
            <div className="w-full lg:flex-[3]">
              <GaleriaImagenes imagenes={vehiculo.imagenes} titulo={vehiculo.titulo} />
            </div>

            {/* Derecha: info + CTA */}
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
      </div>
    </MainLayout>
  )
}
