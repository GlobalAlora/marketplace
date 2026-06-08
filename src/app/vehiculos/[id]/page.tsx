import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import MainLayout from '@/components/layout/MainLayout'
import GaleriaImagenes from '@/components/vehiculos/GaleriaImagenes'
import InfoVehiculo from '@/components/vehiculos/InfoVehiculo'
import BotonWhatsApp from '@/components/vehiculos/BotonWhatsApp'
import VehiculoCard from '@/components/vehiculos/VehiculoCard'
import BannerPublicitario from '@/components/ui/BannerPublicitario'
import { createClient } from '@/lib/supabase/server'
import { getBanners } from '@/lib/banners'
import type { Vehiculo } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

const SELECT_FIELDS =
  '*, profiles!vehiculos_user_id_fkey(id,nombre,apellido,telefono,role,nombre_agencia,verificado,activo)'

async function getVehiculo(id: string): Promise<Vehiculo | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('vehiculos')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .eq('activo', true)
    .eq('vendido', false)
    .maybeSingle()
  return data ? (data as unknown as Vehiculo) : null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const vehiculo = await getVehiculo(id)
  if (!vehiculo) return { title: 'Vehículo no encontrado — AUTODUX' }
  return {
    title: `${vehiculo.titulo} — AUTODUX`,
    description: vehiculo.descripcion ?? undefined,
  }
}

export default async function VehiculoPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [vehiculo, banners] = await Promise.all([
    getVehiculo(id),
    getBanners(['sidebar_derecho_1', 'sidebar_derecho_2', 'sidebar_derecho_3']),
  ])

  if (!vehiculo) notFound()

  // ── Queries en paralelo ────────────────────────────────────────────────────
  const [
    { data: rawMismaMarca },
    { data: rawMasVendedor },
  ] = await Promise.all([
    // 1. Misma marca — destacados primero
    supabase
      .from('vehiculos')
      .select(SELECT_FIELDS)
      .eq('activo', true)
      .eq('vendido', false)
      .eq('marca', vehiculo.marca)
      .neq('id', vehiculo.id)
      .order('destacado', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8),

    // 2. Más del mismo vendedor — destacados primero
    supabase
      .from('vehiculos')
      .select(SELECT_FIELDS)
      .eq('user_id', vehiculo.user_id)
      .eq('activo', true)
      .eq('vendido', false)
      .neq('id', vehiculo.id)
      .order('destacado', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const mismaMarca   = (rawMismaMarca  ?? []) as unknown as Vehiculo[]
  const masDelVendedor = (rawMasVendedor ?? []) as unknown as Vehiculo[]

  // ── Similares: misma marca (hasta 4). Si faltan, rellenar con rango precio ─
  let similares: Vehiculo[] = mismaMarca.slice(0, 4)

  if (similares.length < 4) {
    const yaEnLista = new Set([vehiculo.id, ...similares.map(v => v.id)])
    const precioMin = vehiculo.precio * 0.55
    const precioMax = vehiculo.precio * 1.45

    const { data: rawRelleno } = await supabase
      .from('vehiculos')
      .select(SELECT_FIELDS)
      .eq('activo', true)
      .eq('vendido', false)
      .neq('marca', vehiculo.marca)    // ya tenemos los de misma marca
      .gte('precio', precioMin)
      .lte('precio', precioMax)
      .order('destacado', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8)

    const relleno = ((rawRelleno ?? []) as unknown as Vehiculo[])
      .filter(v => !yaEnLista.has(v.id))
      .slice(0, 4 - similares.length)

    similares = [...similares, ...relleno]
  }

  // ── Labels y links de vendedor ─────────────────────────────────────────────
  const esAgencia = vehiculo.profiles?.role === 'agencia_premium' || vehiculo.profiles?.role === 'agencia_basica'
  const nombreVendedor = vehiculo.profiles?.nombre_agencia ||
    `${vehiculo.profiles?.nombre ?? ''} ${vehiculo.profiles?.apellido ?? ''}`.trim() || 'este vendedor'
  const agenciaHref = esAgencia
    ? `/agencias/${vehiculo.profiles?.id ?? vehiculo.user_id}`
    : `/usuarios/${vehiculo.profiles?.id ?? vehiculo.user_id}`

  // Título de la sección similares
  const hayDeMismaMarca = mismaMarca.length > 0
  const tituloSimilares = hayDeMismaMarca
    ? `Más ${vehiculo.marca}`
    : 'Vehículos similares'
  const subtituloSimilares = hayDeMismaMarca
    ? `Destacados primero · ${vehiculo.marca} disponibles ahora`
    : 'Rango de precio similar · Destacados primero'

  return (
    <MainLayout>
      <div className="bg-[#0D0F14] min-h-screen">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">

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

          {/* Layout 3 columnas */}
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">

            {/* Columna izquierda: info + CTA */}
            <div className="w-full lg:w-[360px] xl:w-[400px] lg:shrink-0 lg:sticky lg:top-24 flex flex-col gap-4 order-2 lg:order-1">
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

            {/* Columna central: galería */}
            <div className="flex-1 min-w-0 order-1 lg:order-2">
              <GaleriaImagenes imagenes={vehiculo.imagenes} titulo={vehiculo.titulo} />
            </div>

            {/* Columna derecha: banners sidebar */}
            <div className="w-full lg:w-[220px] lg:shrink-0 hidden lg:block order-3">
              <div className="sticky top-24 space-y-4">
                {banners.sidebar_derecho_1 && <BannerPublicitario banner={banners.sidebar_derecho_1} />}
                {banners.sidebar_derecho_2 && <BannerPublicitario banner={banners.sidebar_derecho_2} />}
                {banners.sidebar_derecho_3 && <BannerPublicitario banner={banners.sidebar_derecho_3} />}
              </div>
            </div>
          </div>
        </div>

        {/* ── Secciones recomendación ─────────────────────────────────────── */}
        <div className="mt-6 border-t border-white/5">

          {/* Similares — siempre primero */}
          {similares.length > 0 && (
            <section className="bg-[#071526] py-12">
              <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">{tituloSimilares}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{subtituloSimilares}</p>
                  </div>
                  <Link
                    href={`/vehiculos?marca=${encodeURIComponent(vehiculo.marca)}`}
                    className="text-sm font-semibold text-[#FFC107] hover:text-white transition-colors shrink-0"
                  >
                    Ver todos →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {similares.map(v => <VehiculoCard key={v.id} vehiculo={v} />)}
                </div>
              </div>
            </section>
          )}

          {/* Más del mismo vendedor */}
          {masDelVendedor.length > 0 && (
            <section className="bg-[#0D0F14] border-t border-white/5 py-12">
              <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">
                      Más de{' '}
                      <Link
                        href={agenciaHref}
                        className="text-[#FFC107] hover:text-white transition-colors underline underline-offset-2"
                      >
                        {nombreVendedor}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">Otros vehículos de este vendedor · Destacados primero</p>
                  </div>
                  <Link
                    href={agenciaHref}
                    className="text-sm font-semibold text-[#FFC107] hover:text-white transition-colors shrink-0"
                  >
                    Ver perfil →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {masDelVendedor.map(v => <VehiculoCard key={v.id} vehiculo={v} />)}
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </MainLayout>
  )
}
