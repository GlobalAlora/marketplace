'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPlanLimits, PLAN_FALLBACKS } from '@/lib/plan-config'

export async function createVehiculo(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const planLimits = await getPlanLimits()
  const limite = planLimits[profile?.role ?? 'particular'] ?? PLAN_FALLBACKS[profile?.role ?? 'particular'] ?? 3

  const { count } = await supabase
    .from('vehiculos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('vendido', false)

  if ((count ?? 0) >= limite) {
    throw new Error(`Límite de ${limite} publicaciones alcanzado para tu plan`)
  }

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

  const titulo = `${marca} ${modelo} ${año}`

  const { error } = await supabase
    .from('vehiculos')
    .insert({
      user_id: user.id,
      titulo,
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
    })

  if (error) throw new Error(error.message)

  revalidatePath('/panel')
  revalidatePath('/panel/mis-publicaciones')
  redirect('/panel/mis-publicaciones')
}
