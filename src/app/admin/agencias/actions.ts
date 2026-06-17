'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') throw new Error('Sin permisos')
  return supabase
}

export async function toggleVerificadoAgencia(id: string, verificado: boolean) {
  const supabase = await getAdminClient()
  const { error } = await supabase.from('profiles').update({ verificado }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/agencias')
}
