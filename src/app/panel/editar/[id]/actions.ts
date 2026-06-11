'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateVehiculo(vehiculoId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

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
    .update({
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
    .eq('id', vehiculoId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/panel/mis-publicaciones')
  revalidatePath('/panel')
  revalidatePath(`/vehiculos/${vehiculoId}`)
  redirect('/panel/mis-publicaciones')
}
