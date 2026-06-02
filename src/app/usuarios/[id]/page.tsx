import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import GrillaConPaginacion from '@/components/vehiculos/GrillaConPaginacion'
import BannerPublicitario from '@/components/ui/BannerPublicitario'
import { MOCK_VEHICULOS, MOCK_VENDEDORES } from '@/lib/utils/mock-data'
import { MOCK_BANNERS } from '@/lib/utils/mock-banner'

interface PageProps {
  params: Promise<{ id: string }>
}

function formatFecha(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const vendedor = MOCK_VENDEDORES.find(v => v.id === id)
  if (!vendedor) return { title: 'Vendedor no encontrado — AUTODUX' }
  return {
    title: `${vendedor.nombre} ${vendedor.apellido} — AUTODUX`,
    description: vendedor.bio ?? `Vehículos publicados por ${vendedor.nombre} ${vendedor.apellido} en AUTODUX.`,
  }
}

export default async function UsuarioPage({ params }: PageProps) {
  const { id } = await params
  const vendedor = MOCK_VENDEDORES.find(v => v.id === id)

  if (!vendedor) notFound()

  const vehiculos = MOCK_VEHICULOS
    .filter(v => v.user_id === vendedor.id && v.activo && !v.vendido)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const iniciales = `${vendedor.nombre[0] ?? ''}${vendedor.apellido[0] ?? ''}`.toUpperCase()
  const nombreCompleto = `${vendedor.nombre} ${vendedor.apellido}`

  return (
    <MainLayout>
      <div className="bg-[#0D0F14] min-h-screen">

        {/* ── Hero de vendedor ── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0D0F14 0%, #0a1628 60%, #071526 100%)',
          }}
        >
          {/* Patrón decorativo */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
            aria-hidden="true"
          />
          {/* Resplandor azul sutil */}
          <div
            className="absolute top-0 left-0 w-[500px] h-[300px] opacity-[0.05] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 0% 0%, #282F8F 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-sm">
              <Link href="/" className="text-gray-500 hover:text-[#FFC107] transition-colors">Inicio</Link>
              <span className="text-gray-600" aria-hidden="true">›</span>
              <Link href="/vehiculos" className="text-gray-500 hover:text-[#FFC107] transition-colors">Vehículos</Link>
              <span className="text-gray-600" aria-hidden="true">›</span>
              <span className="text-gray-300">Vendedores</span>
              <span className="text-gray-600" aria-hidden="true">›</span>
              <span className="text-gray-300 truncate max-w-[160px]">{nombreCompleto}</span>
            </nav>

            <div className="flex flex-col sm:flex-row gap-7 sm:items-start">

              {/* Avatar circular */}
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shrink-0 text-white font-extrabold text-2xl border-2 border-white/15 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #282F8F 0%, #1f2570 100%)' }}
                aria-hidden="true"
              >
                {iniciales}
              </div>

              {/* Info del vendedor */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {nombreCompleto}
                  </h1>

                  {/* Badge tipo */}
                  <span className="inline-flex items-center gap-1.5 bg-white/8 border border-white/12 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full shrink-0">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>
                    Vendedor particular
                  </span>

                  {/* Badge verificado */}
                  {vendedor.verificado && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#A0AFFF] bg-[#282F8F]/50 border border-[#282F8F]/60 px-2.5 py-1 rounded-full shrink-0">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Verificado
                    </span>
                  )}
                </div>

                {/* Bio */}
                {vendedor.bio && (
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xl mb-5">
                    {vendedor.bio}
                  </p>
                )}

                {/* Stats + contacto */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Stats */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-extrabold text-white">{vehiculos.length}</span>
                      <span className="text-sm text-gray-400">
                        {vehiculos.length === 1 ? 'publicación' : 'publicaciones'}
                      </span>
                    </div>
                    <span className="text-gray-700" aria-hidden="true">|</span>
                    <span className="text-sm text-gray-400">
                      Miembro desde <span className="text-gray-300 font-medium">{formatFecha(vendedor.created_at)}</span>
                    </span>
                  </div>

                  {/* Separador */}
                  <span className="hidden sm:block text-gray-700" aria-hidden="true">|</span>

                  {/* Teléfono */}
                  <a
                    href={`tel:${vendedor.telefono}`}
                    className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {vendedor.telefono}
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/549${vendedor.telefono}?text=${encodeURIComponent(`Hola ${vendedor.nombre}, vi tu perfil en AUTODUX y me interesa alguno de tus vehículos. ¿Podemos hablar?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#1DA851] active:scale-[0.98] transition-all"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Separador decorativo ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        {/* ── Publicaciones + banner ── */}
        <div className="bg-[#071526]">
          <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Vehículos */}
              <div className="flex-1 min-w-0">
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-white">
                    Publicaciones de {vendedor.nombre}
                  </h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {vehiculos.length}{' '}
                    {vehiculos.length === 1 ? 'vehículo publicado' : 'vehículos publicados'}
                  </p>
                </div>

                {vehiculos.length > 0 ? (
                  <GrillaConPaginacion vehiculos={vehiculos} initialLimit={6} pageSize={6} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-gray-500">
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-9 h-9">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                    </div>
                    <p className="text-white font-bold mb-1">Sin publicaciones activas</p>
                    <p className="text-sm text-gray-400">Este vendedor no tiene vehículos disponibles por el momento.</p>
                  </div>
                )}
              </div>

              {/* Banner lateral derecho */}
              <aside className="w-full lg:w-[220px] shrink-0 hidden lg:block">
                <div className="sticky top-24">
                  <BannerPublicitario banner={MOCK_BANNERS.sidebar_right} />
                </div>
              </aside>

            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  )
}
