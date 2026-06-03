import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PlanesForm from './PlanesForm'

export default async function PlanesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: config } = await supabase
    .from('plan_config')
    .select('role, max_publicaciones, updated_at')
    .order('role')

  const limits = {
    particular:      config?.find(c => c.role === 'particular')?.max_publicaciones ?? 3,
    agencia_basica:  config?.find(c => c.role === 'agencia_basica')?.max_publicaciones ?? 10,
    agencia_premium: config?.find(c => c.role === 'agencia_premium')?.max_publicaciones ?? 30,
  }

  const updatedAt = config?.[0]?.updated_at

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Configuración de planes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Límite máximo de publicaciones por rol de usuario
        </p>
      </div>

      <div className="bg-[#1a1a2e] border border-white/8 rounded-2xl p-6">
        <PlanesForm limits={limits} />
      </div>

      {updatedAt && (
        <p className="text-xs text-gray-600 mt-4 text-center">
          Última actualización: {new Date(updatedAt).toLocaleString('es-AR')}
        </p>
      )}

      {/* Info */}
      <div className="mt-6 space-y-2">
        <div className="flex items-start gap-3 bg-white/3 border border-white/8 rounded-xl p-4">
          <svg className="w-4 h-4 text-[#FFC107] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-white mb-0.5">¿Cómo funciona?</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Los cambios se aplican inmediatamente. Los usuarios que ya superaron el nuevo límite
              conservan sus publicaciones existentes pero no pueden crear nuevas hasta estar por debajo del límite.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
