'use server'

import { createClient } from '@/lib/supabase/server'

export async function registrarMetrica(vehiculoId: string, tipo: 'view' | 'whatsapp_click') {
  try {
    const supabase = await createClient()
    await supabase.from('metricas_vehiculos').insert({ vehiculo_id: vehiculoId, tipo })
  } catch {
    // métricas son best-effort, no bloquean la experiencia
  }
}
