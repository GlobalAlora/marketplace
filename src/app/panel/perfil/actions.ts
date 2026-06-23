'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'

async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  excludeUserId: string
): Promise<string> {
  let candidate = base
  let suffix = 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('slug', candidate)
      .neq('id', excludeUserId)
      .maybeSingle()
    if (!data) return candidate
    suffix += 1
    candidate = `${base}-${suffix}`
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const nombre        = formData.get('nombre') as string
  const apellido      = formData.get('apellido') as string
  const telefono      = formData.get('telefono') as string
  const nombre_agencia = formData.get('nombre_agencia') as string | null
  const bio           = formData.get('bio') as string | null
  const logo_agencia  = formData.get('logo_agencia') as string | null

  const updates: Record<string, unknown> = { nombre, apellido, telefono }
  if (nombre_agencia !== null) updates.nombre_agencia = nombre_agencia
  if (bio !== null) updates.bio = bio
  if (logo_agencia) updates.logo_agencia = logo_agencia

  if (nombre_agencia !== null && nombre_agencia.trim()) {
    const base = slugify(nombre_agencia) || 'agencia'
    updates.slug = await generateUniqueSlug(supabase, base, user.id)
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/panel/perfil')
  revalidatePath('/panel')
  if (updates.slug) revalidatePath(`/agencias/${updates.slug}`)
}
