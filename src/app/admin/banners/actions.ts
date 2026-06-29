'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' } as const
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Sin permisos' } as const
  return { supabase } as const
}

export async function createBanner(formData: FormData): Promise<{ error?: string }> {
  const ctx = await getAdminClient()
  if ('error' in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from('banners').insert({
    imagen_url: formData.get('imagen_url') as string,
    link_url:   formData.get('link_url') as string ?? '',
    posicion:   formData.get('posicion') as string ?? 'home_top',
    activo:     formData.get('activo') === 'true',
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/banners')
  return {}
}

export async function updateBanner(id: string, formData: FormData): Promise<{ error?: string }> {
  const ctx = await getAdminClient()
  if ('error' in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from('banners').update({
    imagen_url: formData.get('imagen_url') as string,
    link_url:   formData.get('link_url') as string ?? '',
    posicion:   formData.get('posicion') as string ?? 'home_top',
    activo:     formData.get('activo') === 'true',
  }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/banners')
  return {}
}

export async function deleteBanner(id: string): Promise<{ error?: string }> {
  const ctx = await getAdminClient()
  if ('error' in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from('banners').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/banners')
  return {}
}

export async function toggleActivoBanner(id: string, activo: boolean): Promise<{ error?: string }> {
  const ctx = await getAdminClient()
  if ('error' in ctx) return { error: ctx.error }
  const { error } = await ctx.supabase.from('banners').update({ activo }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/banners')
  return {}
}
