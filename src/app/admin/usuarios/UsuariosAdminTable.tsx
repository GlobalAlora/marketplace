'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { updateRole, toggleVerificado, toggleActivo } from '@/app/admin/usuarios/actions'
import CustomSelect from '@/components/ui/CustomSelect'

type Role = 'particular' | 'agencia_basica' | 'agencia_premium' | 'admin'

interface Profile {
  id: string
  email: string
  nombre: string
  apellido: string
  telefono: string
  role: Role
  verificado: boolean
  activo: boolean
  created_at: string
  avatar_url: string | null
  vehiculos_count: number
}

// "admin" se excluye deliberadamente de este selector rápido: el cliente
// pidió que no sea posible hacer admin a alguien por error en este listado
// masivo. Para promover a admin hay que entrar al detalle del usuario.
const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'particular', label: 'Particular' },
  { value: 'agencia_basica', label: 'Agencia PRIME' },
  { value: 'agencia_premium', label: 'Agencia DUX' },
]

const ROLE_STYLES: Record<Role, string> = {
  admin: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  agencia_premium: 'bg-[#FFC107]/15 text-[#FFC107] border-[#FFC107]/25',
  agencia_basica: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  particular: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

type FiltroRol = 'todos' | Role
type FiltroEstado = 'todos' | 'activo' | 'suspendido'
type FiltroFecha = 'todos' | '7d' | '30d' | '90d'

const FECHA_LABELS: Record<FiltroFecha, string> = {
  todos: 'Toda la historia',
  '7d': 'Última semana',
  '30d': 'Último mes',
  '90d': 'Últimos 3 meses',
}

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function exportCSV(usuarios: Profile[]) {
  const header = ['ID', 'Nombre', 'Apellido', 'Email', 'Rol', 'Verificado', 'Activo', 'Vehículos', 'Registro']
  const rows = usuarios.map(u => [
    u.id,
    u.nombre,
    u.apellido,
    u.email,
    u.role,
    u.verificado ? 'Sí' : 'No',
    u.activo ? 'Sí' : 'No',
    u.vehiculos_count,
    new Date(u.created_at).toLocaleDateString('es-AR'),
  ])
  const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `usuarios-autodux-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function UsuariosAdminTable({ usuarios }: { usuarios: Profile[] }) {
  const [filtroRol, setFiltroRol] = useState<FiltroRol>('todos')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')
  const [filtroFecha, setFiltroFecha] = useState<FiltroFecha>('todos')
  const [busqueda, setBusqueda] = useState('')

  const now = Date.now()
  const fechaMs: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }

  const filtered = usuarios.filter(u => {
    if (filtroRol !== 'todos' && u.role !== filtroRol) return false
    if (filtroEstado === 'activo' && !u.activo) return false
    if (filtroEstado === 'suspendido' && u.activo) return false
    if (filtroFecha !== 'todos') {
      const dias = fechaMs[filtroFecha]
      const cutoff = now - dias * 24 * 60 * 60 * 1000
      if (new Date(u.created_at).getTime() < cutoff) return false
    }
    if (busqueda) {
      const q = busqueda.toLowerCase()
      if (!u.nombre.toLowerCase().includes(q) &&
          !u.apellido.toLowerCase().includes(q) &&
          !u.email.toLowerCase().includes(q)) return false
    }
    return true
  })

  const FILTRO_ROL_OPTS = [
    { value: 'todos', label: 'Todos los roles' },
    ...ROLE_OPTIONS,
    { value: 'admin', label: 'Admin' },
  ]
  const FILTRO_ESTADO_OPTS = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'activo', label: 'Activos' },
    { value: 'suspendido', label: 'Suspendidos' },
  ]
  const FILTRO_FECHA_OPTS = (Object.keys(FECHA_LABELS) as FiltroFecha[]).map(k => ({ value: k, label: FECHA_LABELS[k] }))

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
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#282F8F]/60 w-52"
          />
        </div>

        <CustomSelect options={FILTRO_ROL_OPTS} value={filtroRol} onChange={v => setFiltroRol(v as FiltroRol)} />
        <CustomSelect options={FILTRO_ESTADO_OPTS} value={filtroEstado} onChange={v => setFiltroEstado(v as FiltroEstado)} />
        <CustomSelect options={FILTRO_FECHA_OPTS} value={filtroFecha} onChange={v => setFiltroFecha(v as FiltroFecha)} />

        <span className="text-xs text-gray-600">
          {filtered.length} de {usuarios.length} usuarios
        </span>

        <button
          onClick={() => exportCSV(filtered)}
          title="Exportar CSV"
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/6 px-5 py-12 text-center text-sm text-gray-600">
          No hay usuarios que coincidan con los filtros
        </div>
      ) : (
        <>
          {/* Tabla — desktop */}
          <div className="hidden lg:block rounded-2xl border border-white/6 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/2 border-b border-white/6">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Usuario</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Rol</th>
                  <th className="text-center px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Autos</th>
                  <th className="text-center px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Verificado</th>
                  <th className="text-center px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Estado</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Registro</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(u => <UsuarioRow key={u.id} usuario={u} />)}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile */}
          <div className="lg:hidden space-y-3">
            {filtered.map(u => <UsuarioCardMobile key={u.id} usuario={u} />)}
          </div>
        </>
      )}
    </div>
  )
}

function UsuarioRow({ usuario: u }: { usuario: Profile }) {
  const [pending, startTransition] = useTransition()

  return (
    <tr className={`hover:bg-white/2 transition-colors ${pending ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Usuario */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#282F8F]/20 border border-[#282F8F]/30 flex items-center justify-center shrink-0 overflow-hidden">
            {u.avatar_url
              ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
              : <span className="text-xs font-bold text-[#FFC107]">{u.nombre.charAt(0).toUpperCase()}</span>
            }
          </div>
          <div>
            <p className="font-semibold text-white">{u.nombre} {u.apellido}</p>
            <p className="text-xs text-gray-500">{u.email}</p>
          </div>
        </div>
      </td>

      {/* Rol */}
      <td className="px-5 py-4">
        {u.role === 'admin' ? (
          <span
            title="Para cambiar el rol de un admin, entrá al detalle del usuario"
            className={`inline-flex items-center text-xs font-bold px-2.5 py-1.5 rounded-lg border ${ROLE_STYLES.admin}`}
          >
            Admin
          </span>
        ) : (
          <CustomSelect
            options={ROLE_OPTIONS}
            value={u.role}
            onChange={v => startTransition(() => updateRole(u.id, v as Role))}
            buttonClassName={`flex items-center justify-between gap-2 text-xs font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${ROLE_STYLES[u.role]}`}
          />
        )}
      </td>

      {/* Vehículos count */}
      <td className="px-5 py-4 text-center">
        <span className={`text-sm font-bold tabular-nums ${u.vehiculos_count > 0 ? 'text-white' : 'text-gray-700'}`}>
          {u.vehiculos_count}
        </span>
      </td>

      {/* Verificado */}
      <td className="px-5 py-4 text-center">
        <button
          onClick={() => startTransition(() => toggleVerificado(u.id, !u.verificado))}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
            u.verificado
              ? 'bg-green-500/10 text-green-400 border-green-500/25 hover:bg-green-500/20'
              : 'bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20'
          }`}
        >
          {u.verificado ? '✓ Verificado' : 'Sin verificar'}
        </button>
      </td>

      {/* Estado */}
      <td className="px-5 py-4 text-center">
        <button
          onClick={() => startTransition(() => toggleActivo(u.id, !u.activo))}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
            u.activo
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/25'
              : 'bg-red-500/10 text-red-400 border-red-500/25 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/25'
          }`}
          title={u.activo ? 'Clic para suspender' : 'Clic para activar'}
        >
          {u.activo ? 'Activo' : 'Suspendido'}
        </button>
      </td>

      {/* Fecha */}
      <td className="px-5 py-4 text-xs text-gray-500">
        {formatFecha(u.created_at)}
      </td>

      {/* Acciones */}
      <td className="px-5 py-4 text-right">
        <Link
          href={`/admin/usuarios/${u.id}`}
          className="text-xs font-semibold text-[#282F8F] hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg border border-[#282F8F]/30 hover:border-blue-400/30"
        >
          Ver perfil →
        </Link>
      </td>
    </tr>
  )
}

function UsuarioCardMobile({ usuario: u }: { usuario: Profile }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className={`bg-[#1a1a2e] border border-white/8 rounded-2xl p-4 ${pending ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-[#282F8F]/20 border border-[#282F8F]/30 flex items-center justify-center shrink-0 overflow-hidden">
          {u.avatar_url
            ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
            : <span className="text-xs font-bold text-[#FFC107]">{u.nombre.charAt(0).toUpperCase()}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{u.nombre} {u.apellido}</p>
          <p className="text-xs text-gray-500 truncate">{u.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {u.role === 'admin' ? (
          <span
            title="Para cambiar el rol de un admin, entrá al detalle del usuario"
            className={`flex items-center justify-center text-xs font-bold px-2.5 py-2 rounded-lg border ${ROLE_STYLES.admin}`}
          >
            Admin
          </span>
        ) : (
          <CustomSelect
            options={ROLE_OPTIONS}
            value={u.role}
            onChange={v => startTransition(() => updateRole(u.id, v as Role))}
            buttonClassName={`flex items-center justify-between gap-2 text-xs font-bold px-2.5 py-2 rounded-lg border cursor-pointer focus:outline-none ${ROLE_STYLES[u.role]}`}
          />
        )}
        <div className="flex items-center justify-center gap-1.5 text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-2">
          <span className={`font-bold tabular-nums ${u.vehiculos_count > 0 ? 'text-white' : 'text-gray-700'}`}>{u.vehiculos_count}</span>
          <span className="text-gray-500">{u.vehiculos_count === 1 ? 'auto' : 'autos'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => startTransition(() => toggleVerificado(u.id, !u.verificado))}
          className={`flex-1 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
            u.verificado
              ? 'bg-green-500/10 text-green-400 border-green-500/25 hover:bg-green-500/20'
              : 'bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20'
          }`}
        >
          {u.verificado ? '✓ Verificado' : 'Sin verificar'}
        </button>
        <button
          onClick={() => startTransition(() => toggleActivo(u.id, !u.activo))}
          className={`flex-1 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
            u.activo
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
              : 'bg-red-500/10 text-red-400 border-red-500/25'
          }`}
        >
          {u.activo ? 'Activo' : 'Suspendido'}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-600">Registro: {formatFecha(u.created_at)}</span>
        <Link
          href={`/admin/usuarios/${u.id}`}
          className="text-xs font-semibold text-[#282F8F] hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg border border-[#282F8F]/30 hover:border-blue-400/30"
        >
          Ver perfil →
        </Link>
      </div>
    </div>
  )
}
