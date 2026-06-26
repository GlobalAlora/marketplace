'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { toggleVerificadoAgencia } from './actions'

type Role = 'agencia_basica' | 'agencia_premium'

interface Agencia {
  id: string
  nombre: string
  avatar_url: string | null
  role: Role
  verificado: boolean
  activo: boolean
  created_at: string
  vehiculos_count: number
}

const PLAN_LABEL: Record<Role, string> = {
  agencia_basica: 'Agencia PRIME',
  agencia_premium: 'Agencia DUX',
}

const PLAN_STYLE: Record<Role, string> = {
  agencia_premium: 'bg-[#FFC107]/10 text-[#FFC107] border-[#FFC107]/25',
  agencia_basica: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
}

export default function AgenciasAdminClient({ agencias }: { agencias: Agencia[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [filtroRole, setFiltroRole] = useState<'todos' | Role>('todos')

  const filtered = agencias.filter(a => {
    if (filtroRole !== 'todos' && a.role !== filtroRole) return false
    if (busqueda) {
      const q = busqueda.toLowerCase()
      if (!a.nombre.toLowerCase().includes(q)) return false
    }
    return true
  })

  const SELECT = 'px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-[#282F8F]/60'

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar agencia..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#282F8F]/60 w-52"
          />
        </div>

        <select value={filtroRole} onChange={e => setFiltroRole(e.target.value as 'todos' | Role)} className={SELECT}>
          <option value="todos" className="bg-[#111827]">Todos los planes</option>
          <option value="agencia_basica" className="bg-[#111827]">Agencia PRIME</option>
          <option value="agencia_premium" className="bg-[#111827]">Agencia DUX</option>
        </select>

        <span className="text-xs text-gray-600">
          {filtered.length} de {agencias.length} agencias
        </span>
      </div>

      {/* Tabla */}
      <div className="rounded-2xl border border-white/6 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/2 border-b border-white/6">
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Agencia</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Plan</th>
              <th className="text-center px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Autos</th>
              <th className="text-center px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Verificada</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Miembro desde</th>
              <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-600">
                  No hay agencias que coincidan
                </td>
              </tr>
            ) : (
              filtered.map(a => <AgenciaRow key={a.id} agencia={a} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AgenciaRow({ agencia: a }: { agencia: Agencia }) {
  const [pending, startTransition] = useTransition()

  return (
    <tr className={`hover:bg-white/2 transition-colors ${pending ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Agencia */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#282F8F]/20 border border-[#282F8F]/30 flex items-center justify-center shrink-0 overflow-hidden">
            {a.avatar_url
              ? <img src={a.avatar_url} alt="" className="w-full h-full object-cover" />
              : <span className="text-sm font-bold text-[#FFC107]">{a.nombre.charAt(0).toUpperCase()}</span>
            }
          </div>
          <div>
            <p className="font-semibold text-white">{a.nombre}</p>
            <p className="text-xs text-gray-600">{a.activo ? 'Activa' : 'Suspendida'}</p>
          </div>
        </div>
      </td>

      {/* Plan */}
      <td className="px-5 py-4">
        <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border ${PLAN_STYLE[a.role]}`}>
          {PLAN_LABEL[a.role]}
        </span>
      </td>

      {/* Vehículos */}
      <td className="px-5 py-4 text-center">
        <span className={`text-sm font-bold tabular-nums ${a.vehiculos_count > 0 ? 'text-white' : 'text-gray-700'}`}>
          {a.vehiculos_count}
        </span>
      </td>

      {/* Verificada */}
      <td className="px-5 py-4 text-center">
        <button
          onClick={() => startTransition(() => toggleVerificadoAgencia(a.id, !a.verificado))}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
            a.verificado
              ? 'bg-green-500/10 text-green-400 border-green-500/25 hover:bg-green-500/20'
              : 'bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20'
          }`}
        >
          {a.verificado ? '✓ Verificada' : 'Sin verificar'}
        </button>
      </td>

      {/* Fecha */}
      <td className="px-5 py-4 text-xs text-gray-500">
        {new Date(a.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>

      {/* Acciones */}
      <td className="px-5 py-4 text-right">
        <div className="inline-flex items-center gap-2">
          <Link
            href={`/admin/agencias/${a.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            Ver detalle
          </Link>
          <Link
            href={`/agencias/${a.id}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            Ver perfil
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </Link>
        </div>
      </td>
    </tr>
  )
}
