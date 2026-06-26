import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import Hero from '@/components/vehiculos/Hero'
import GrillaVehiculos from '@/components/vehiculos/GrillaVehiculos'
import SeccionDestacados from '@/components/vehiculos/SeccionDestacados'
import SeccionBeneficios from '@/components/vehiculos/SeccionBeneficios'
import SobreNosotros from '@/components/home/SobreNosotros'
import SeccionPlanes from '@/components/home/SeccionPlanes'
import BannerPublicitario from '@/components/ui/BannerPublicitario'
import RevealSection from '@/components/ui/RevealSection'
import { createClient } from '@/lib/supabase/server'
import { getBanners } from '@/lib/banners'
import { getSiteConfig } from '@/lib/site-config'
import { getPlanesHome } from '@/lib/planes-home'
import type { Vehiculo } from '@/types'

export const revalidate = 300 // 5 min cache

export default async function Home() {
  const supabase = await createClient()

  const [
    { data: rawDestacados },
    { data: rawUltimos },
    { data: rawTodos },
    { count: totalCount },
    banners,
    siteConfig,
    planesHome,
  ] = await Promise.all([
    // Vitrina: solo destacados activos, máx 3
    supabase
      .from('vehiculos')
      .select('*, profiles!vehiculos_user_id_fkey(id,nombre,apellido,telefono,role,nombre_agencia,verificado,activo,slug)')
      .eq('activo', true).eq('vendido', false).eq('destacado', true)
      .order('created_at', { ascending: false })
      .limit(3),

    // Últimos publicados: 4 más recientes
    supabase
      .from('vehiculos')
      .select('*, profiles!vehiculos_user_id_fkey(id,nombre,apellido,telefono,role,nombre_agencia,verificado,activo,slug)')
      .eq('activo', true).eq('vendido', false)
      .order('created_at', { ascending: false })
      .limit(4),

    // Preview todos: destacados primero, 1 fila (máx 4)
    supabase
      .from('vehiculos')
      .select('*, profiles!vehiculos_user_id_fkey(id,nombre,apellido,telefono,role,nombre_agencia,verificado,activo,slug)')
      .eq('activo', true).eq('vendido', false)
      .order('destacado', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(4),

    // Total count
    supabase.from('vehiculos').select('*', { count: 'exact', head: true })
      .eq('activo', true).eq('vendido', false),

    // Banners de home
    getBanners(['home_top', 'home_mid', 'home_bottom']),

    // Config del sitio (CMS)
    getSiteConfig(),

    // Planes editables desde /admin/planes-home
    getPlanesHome(),
  ])

  const destacados      = (rawDestacados ?? []) as unknown as Vehiculo[]
  const ultimos         = (rawUltimos    ?? []) as unknown as Vehiculo[]
  const todosPreview    = (rawTodos      ?? []) as unknown as Vehiculo[]
  const total           = totalCount ?? 0

  return (
    <MainLayout>
      <Hero config={siteConfig} />

      {/* Banner home_top — debajo del hero */}
      {banners.home_top && (
        <div className="bg-[#071526]">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-4">
            <BannerPublicitario banner={banners.home_top} />
          </div>
        </div>
      )}

      {/* Vitrina AUTODUX */}
      <SeccionDestacados
        vehiculos={destacados}
        titulo={siteConfig.vitrina_titulo}
        subtitulo={siteConfig.vitrina_subtitulo}
      />

      {/* Últimos publicados */}
      <div className="bg-[#071526]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 pt-10 pb-6">
          <RevealSection>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-extrabold text-white">Últimos publicados</h2>
                <p className="text-sm text-gray-400 mt-0.5">Recién agregados</p>
              </div>
              <Link href="/vehiculos" className="text-sm font-semibold text-[#FFC107] hover:text-white transition-colors shrink-0">
                Ver todos →
              </Link>
            </div>
            <GrillaVehiculos vehiculos={ultimos} />
          </RevealSection>
        </div>
      </div>

      {/* Banner home_mid — entre secciones */}
      {banners.home_mid && (
        <div className="bg-[#071526]">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-4">
            <BannerPublicitario banner={banners.home_mid} />
          </div>
        </div>
      )}

      {/* Todos los vehículos — preview */}
      <div className="bg-[#071526]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 pt-6 pb-10">
          <RevealSection>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-extrabold text-white">Todos los vehículos</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {total} publicaciones disponibles en la Patagonia
                </p>
              </div>
              <Link href="/vehiculos" className="text-sm font-semibold text-[#FFC107] hover:text-white transition-colors shrink-0">
                Ver todos →
              </Link>
            </div>
            <GrillaVehiculos vehiculos={todosPreview} />
            <div className="mt-8 flex justify-center">
              <Link
                href="/vehiculos"
                className="inline-flex items-center gap-2 bg-[#282F8F] text-white font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-[#1f2570] active:scale-[0.98] transition-all"
              >
                Ver los {total} vehículos disponibles
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </RevealSection>
        </div>
      </div>

      {/* Banner home_bottom */}
      {banners.home_bottom && (
        <div className="bg-[#071526]">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-4">
            <BannerPublicitario banner={banners.home_bottom} />
          </div>
        </div>
      )}

      {/* Sobre Nosotros */}
      <SobreNosotros />

      {/* ¿Por qué usar AUTODUX? — rediseñado con carrusel */}
      <SeccionBeneficios config={siteConfig} />

      {/* Planes */}
      <SeccionPlanes config={siteConfig} planesHome={planesHome} />

    </MainLayout>
  )
}
