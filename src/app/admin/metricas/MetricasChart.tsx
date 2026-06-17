'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DayData {
  fecha: string
  registros: number
}

export default function MetricasChart({ data }: { data: DayData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-600">
        Sin datos de registro en los últimos 30 días
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="colorRegistros" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#282F8F" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#282F8F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="fecha"
          tick={{ fill: '#6b7280', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            fontSize: 12,
            color: '#fff',
          }}
          labelStyle={{ color: '#9ca3af', marginBottom: 2 }}
          itemStyle={{ color: '#818cf8' }}
          formatter={(value) => [value, 'Registros']}
        />
        <Area
          type="monotone"
          dataKey="registros"
          stroke="#282F8F"
          strokeWidth={2}
          fill="url(#colorRegistros)"
          dot={false}
          activeDot={{ r: 4, fill: '#FFC107', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
