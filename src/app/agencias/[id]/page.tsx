import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import PerfilVehiculosSection from '@/components/vehiculos/PerfilVehiculosSection'
import BannerPublicitario from '@/components/ui/BannerPublicitario'
import { createClient } from '@/lib/supabase/server'
import { getBanners } from '@/lib/banners'
import type { Vehiculo, Profile } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

function formatFecha(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })
}

function getIniciales(nombre: string): string {
  return nombre.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

async function getAgencia(id: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id,email,nombre,apellido,telefono,role,avatar_url,nombre_agencia,logo_agencia,bio,verificado,activo,created_at')
    .eq('id', id)
    .eq('activo', true)
    .in('role', ['agencia_basica', 'agencia_premium'])
    .maybeSingle()
  return data as Profile | null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const agencia = await getAgencia(id)
  if (!agencia) return { title: 'Agencia no encontrada — AUTODUX' }
  const nombre = agencia.nombre_agencia ?? `${agencia.nombre} ${agencia.apellido}`
  return {
    title: `${nombre} — AUTODUX`,
    description: agencia.bio ?? `Vehículos publicados por ${nombre} en AUTODUX.`,
  }
}

export default async function AgenciaPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [agencia, banners] = await Promise.all([
    getAgencia(id),
    getBanners(['sidebar_derecho_1']),
  ])

  if (!agencia) notFound()

  const [{ data: rawVehiculos }, { count: vendidosCount }] = await Promise.all([
    supabase
      .from('vehiculos')
      .select('*, profiles!vehiculos_user_id_fkey(id,nombre,apellido,telefono,role,nombre_agencia,verificado,activo)')
      .eq('user_id', agencia.id)
      .eq('activo', true)
      .eq('vendido', false)
      .order('destacado', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('vehiculos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', agencia.id)
      .eq('vendido', true),
  ])

  const vehiculos = (rawVehiculos ?? []) as unknown as Vehiculo[]
  const vendidos = vendidosCount ?? 0
  const nombre = agencia.nombre_agencia ?? `${agencia.nombre} ${agencia.apellido}`
  const iniciales = getIniciales(nombre)
  const logoUrl = agencia.logo_agencia

  return (
    <MainLayout>
      <div className="bg-[#0D0F14] min-h-screen">

        {/* Hero agencia */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D0F14 0%, #071526 50%, #0a1f3d 100%)' }}>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} aria-hidden="true" />
          <div className="absolute top-0 right-0 w-[600px] h-[400px] opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 100% 0%, #282F8F 0%, transparent 70%)' }} aria-hidden="true" />

          <div className="relative max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-sm">
              <Link href="/" className="text-gray-500 hover:text-[#FFC107] transition-colors">Inicio</Link>
              <span className="text-gray-600" aria-hidden="true">›</span>
              <Link href="/vehiculos" className="text-gray-500 hover:text-[#FFC107] transition-colors">Vehículos</Link>
              <span className="text-gray-600" aria-hidden="true">›</span>
              <span className="text-gray-300">Agencias</span>
              <span className="text-gray-600" aria-hidden="true">›</span>
              <span className="text-gray-300 truncate max-w-[160px]">{nombre}</span>
            </nav>

            <div className="flex flex-col sm:flex-row gap-8 sm:items-start">
              {/* Logo */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-2xl shadow-[#FFC107]/10 border-2 border-[#FFC107]/30" style={{ background: 'linear-gradient(135deg, #FFC107 0%, #f59e0b 100%)' }} aria-hidden="true">
                {logoUrl
                  ? <img src={logoUrl} alt={`Logo ${nombre}`} className="w-full h-full object-cover" />
                  : <span className="text-[#0D0F14] font-extrabold text-3xl">{iniciales}</span>
                }
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">{nombre}</h1>
                  {agencia.verificado && (
                    <span className="inline-flex items-center gap-1.5 bg-[#FFC107] text-[#0D0F14] text-xs font-extrabold px-3 py-1.5 rounded-full shrink-0 uppercase tracking-wide">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                      Agencia verificada
                    </span>
                  )}
                </div>

                {agencia.bio && <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">{agencia.bio}</p>}

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-extrabold text-white">{vehiculos.length}</span>
                      <span className="text-sm text-gray-400">vehículos</span>
                    </div>
                    <span className="text-gray-700" aria-hidden="true">|</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-extrabold text-emerald-400">{vendidos}</span>
                      <span className="text-sm text-gray-400">vendidos</span>
                    </div>
                    <span className="text-gray-700" aria-hidden="true">|</span>
                    <div className="text-sm text-gray-400">Desde <span className="text-gray-300 font-medium">{formatFecha(agencia.created_at)}</span></div>
                  </div>
                  <span className="hidden sm:block text-gray-700" aria-hidden="true">|</span>
                  {agencia.telefono && (
                    <a href={`tel:${agencia.telefono}`} className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors">
                      <svg className="w-4 h-4 text-[#FFC107] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                      {agencia.telefono}
                    </a>
                  )}
                  {agencia.telefono && (
                    <a href={`https://wa.me/549${agencia.telefono}?text=${encodeURIComponent(`Hola ${nombre}, vi su perfil en AUTODUX y me gustaría consultar sobre sus vehículos.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#1DA851] active:scale-[0.98] transition-all">
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      Contactar por WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#FFC107]/20 to-transparent" />

        <div className="bg-[#071526]">
          <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-extrabold text-white mb-6">Vehículos disponibles</h2>
                <PerfilVehiculosSection
                  vehiculos={vehiculos}
                  emptyText="Esta agencia no tiene vehículos disponibles."
                />
              </div>
              <aside className="w-full lg:w-[220px] shrink-0 hidden lg:block">
                <div className="sticky top-24 space-y-4">
                  {banners.sidebar_derecho_1 && <BannerPublicitario banner={banners.sidebar_derecho_1} />}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
