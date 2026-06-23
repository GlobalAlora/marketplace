'use client'

import { useState } from 'react'

export interface ResumenExport {
  totalUsuarios: number
  usuariosHoy: number
  usuariosSemana: number
  usuariosMes: number
  vehiculosActivos: number
  vehiculosPausados: number
  vehiculosVendidos: number
  totalVistas: number
  totalWhatsapp: number
}

export interface TopVehiculoExport {
  titulo: string
  marca: string
  modelo: string
  views: number
  clicks: number
}

export interface TopAgenciaExport {
  nombre: string
  vehiculosPublicados: number
  vehiculosVendidos: number
}

export interface ActividadDiaExport {
  fecha: string
  nuevosUsuarios: number
  vistas: number
  whatsapp: number
}

interface Props {
  resumen: ResumenExport
  topVehiculos: TopVehiculoExport[]
  topAgencias: TopAgenciaExport[]
  actividad: ActividadDiaExport[]
}

export default function ExportarExcelButton({ resumen, topVehiculos, topAgencias, actividad }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleExport() {
    setLoading(true)
    setError(null)
    try {
      const XLSX = await import('xlsx')

      const wsResumen = XLSX.utils.json_to_sheet([
        { Métrica: 'Usuarios totales', Valor: resumen.totalUsuarios },
        { Métrica: 'Usuarios nuevos hoy', Valor: resumen.usuariosHoy },
        { Métrica: 'Usuarios nuevos (últimos 7 días)', Valor: resumen.usuariosSemana },
        { Métrica: 'Usuarios nuevos (últimos 30 días)', Valor: resumen.usuariosMes },
        { Métrica: 'Vehículos activos', Valor: resumen.vehiculosActivos },
        { Métrica: 'Vehículos pausados', Valor: resumen.vehiculosPausados },
        { Métrica: 'Vehículos vendidos', Valor: resumen.vehiculosVendidos },
        { Métrica: 'Vistas totales', Valor: resumen.totalVistas },
        { Métrica: 'Clicks WhatsApp totales', Valor: resumen.totalWhatsapp },
      ])

      const wsVehiculos = XLSX.utils.json_to_sheet(
        topVehiculos.map(v => ({
          Título: v.titulo,
          Marca: v.marca,
          Modelo: v.modelo,
          Vistas: v.views,
          'Clicks WhatsApp': v.clicks,
        }))
      )

      const wsAgencias = XLSX.utils.json_to_sheet(
        topAgencias.map(a => ({
          Agencia: a.nombre,
          'Vehículos publicados': a.vehiculosPublicados,
          'Vehículos vendidos': a.vehiculosVendidos,
        }))
      )

      const wsActividad = XLSX.utils.json_to_sheet(
        actividad.map(d => ({
          Fecha: d.fecha,
          'Nuevos usuarios': d.nuevosUsuarios,
          Vistas: d.vistas,
          'Clicks WhatsApp': d.whatsapp,
        }))
      )

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen general')
      XLSX.utils.book_append_sheet(wb, wsVehiculos, 'Top vehículos')
      XLSX.utils.book_append_sheet(wb, wsAgencias, 'Top agencias')
      XLSX.utils.book_append_sheet(wb, wsActividad, 'Actividad por día')

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
