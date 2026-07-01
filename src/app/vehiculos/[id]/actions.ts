'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function registrarMetrica(vehiculoId: string, tipo: 'view' | 'whatsapp_click') {
  try {
    const supabase = await createClient()
    await supabase.from('metricas_vehiculos').insert({ vehiculo_id: vehiculoId, tipo })

    if (tipo === 'view') {
      const admin = createAdminClient()
      await admin.rpc('incrementar_vistas', { vehiculo_uuid: vehiculoId })
    }
  } catch {
    // métricas son best-effort, no bloquean la experiencia
  }
}
