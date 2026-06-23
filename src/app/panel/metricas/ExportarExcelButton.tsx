'use client'

import { useState } from 'react'

export interface VehiculoMetricaExport {
  titulo: string
  marca: string
  modelo: string
  año: number
  vistas: number
  whatsapp: number
}

interface Props {
  totalViews: number
  totalWhatsapp: number
  vehiculos: VehiculoMetricaExport[]
}

export default function ExportarExcelButton({ totalViews, totalWhatsapp, vehiculos }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleExport() {
    setLoading(true)
    setError(null)
    try {
      const XLSX = await import('xlsx')

      const wsResumen = XLSX.utils.json_to_sheet([
        { Métrica: 'Visualizaciones totales', Valor: totalViews },
        { Métrica: 'Clicks en WhatsApp', Valor: totalWhatsapp },
        { Métrica: 'Publicaciones', Valor: vehiculos.length },
      ])

      const wsVehiculos = XLSX.utils.json_to_sheet(
        vehiculos.map(v => ({
          Título: v.titulo,
          Marca: v.marca,
          Modelo: v.modelo,
          Año: v.año,
          Vistas: v.vistas,
          'Clicks WhatsApp': v.whatsapp,
        }))
      )

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen')
      XLSX.utils.book_append_sheet(wb, wsVehiculos, 'Mis publicaciones')

      const fecha = new Date().toISOString().slice(0, 10)
      XLSX.writeFile(wb, `autodux-metricas-${fecha}.xlsx`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el Excel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleExport}
        disabled={loading}
        className="flex items-center gap-2 bg-[#1a1a2e] border border-white/10 hover:border-[#FFC107]/40 hover:bg-white/5 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
      >
        <svg className="w-4 h-4 text-[#FFC107]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        {loading ? 'Generando…' : 'Descargar Excel'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
