'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Sin permisos')
  return supabase
}

export async function createBanner(formData: FormData) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from('banners').insert({
    imagen_url: formData.get('imagen_url') as string,
    link_url:   formData.get('link_url') as string ?? '',
    posicion:   formData.get('posicion') as string ?? 'home_top',
    activo:     formData.get('activo') === 'true',
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/banners')
}

export async function updateBanner(id: string, formData: FormData) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from('banners').update({
    imagen_url: formData.get('imagen_url') as string,
    link_url:   formData.get('link_url') as string ?? '',
    posicion:   formData.get('posicion') as string ?? 'home_top',
    activo:     formData.get('activo') === 'true',
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/banners')
}

export async function deleteBanner(id: string) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from('banners').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/banners')
}

export async function toggleActivoBanner(id: string, activo: boolean) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from('banners').update({ activo }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/banners')
}
