import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import EditarForm from './EditarForm'

interface VehiculoRow {
  id: string
  marca: string
  modelo: string
  año: number
  kilometraje: number
  precio: number
  descripcion: string | null
  ubicacion: string
  condicion: string
  transmision: string | null
  combustible: string | null
  puertas: number | null
  color: string | null
  imagenes: string[]
  tipo_vehiculo: string | null
  cilindrada: number | null
  tipo_moto: string | null
  ciudad: string | null
  provincia: string | null
  moneda: string | null
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: raw } = await supabase
    .from('vehiculos')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('vendido', false)
    .maybeSingle()

  if (!raw) notFound()

  const vehiculo = raw as unknown as VehiculoRow

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Link
            href="/panel/mis-publicaciones"
            className="text-gray-500 hover:text-[#FFC107] transition-colors text-sm"
          >
            ← Mis publicaciones
          </Link>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Editar vehículo</h1>
        <p className="text-sm text-gray-500 mt-1">
          {vehiculo.marca} {vehiculo.modelo} {vehiculo.año}
        </p>
      </div>

      <EditarForm vehiculo={vehiculo} userId={user.id} />
    </div>
  )
}
