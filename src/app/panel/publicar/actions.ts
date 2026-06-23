'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPlanLimits, resolveLimit } from '@/lib/plan-config'

export async function createVehiculo(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, max_publicaciones_override')
    .eq('id', user.id)
    .single()

  const planLimits = await getPlanLimits()
  const limite = resolveLimit(profile ?? { role: 'particular' }, planLimits)

  const { count } = await supabase
    .from('vehiculos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('vendido', false)

  if ((count ?? 0) >= limite) {
    throw new Error(`Límite de ${limite} publicaciones alcanzado para tu plan`)
  }

  const tipo_vehiculo = formData.get('tipo_vehiculo') as string
  const marca       = formData.get('marca') as string
  const modelo      = formData.get('modelo') as string
  const año         = parseInt(formData.get('año') as string)
  const kilometraje = parseInt(formData.get('kilometraje') as string)
  const precio      = parseInt(formData.get('precio') as string)
  const descripcion = formData.get('descripcion') as string
  const ubicacion   = formData.get('ubicacion') as string
  const condicion   = formData.get('condicion') as string
  const transmision = formData.get('transmision') as string || null
  const combustible = formData.get('combustible') as string || null
  const puertas     = formData.get('puertas') ? parseInt(formData.get('puertas') as string) : null
  const color       = formData.get('color') as string || null
  const imagenes    = JSON.parse(formData.get('imagenes') as string ?? '[]') as string[]
  const cilindrada  = tipo_vehiculo === 'moto' && formData.get('cilindrada')
    ? parseInt(formData.get('cilindrada') as string) : null
  const tipo_moto   = tipo_vehiculo === 'moto' ? (formData.get('tipo_moto') as string || null) : null

  const titulo = `${marca} ${modelo} ${año}`

  const { error } = await supabase
    .from('vehiculos')
    .insert({
      user_id: user.id,
      titulo,
      tipo_vehiculo,
      marca,
      modelo,
      año,
      kilometraje,
      precio,
      descripcion,
      ubicacion,
      condicion,
      transmision,
      combustible,
      puertas,
      color,
      imagenes,
      cilindrada,
      tipo_moto,
    })

  if (error) throw new Error(error.message)

  revalidatePath('/panel')
  revalidatePath('/panel/mis-publicaciones')
  redirect('/panel/mis-publicaciones')
}
