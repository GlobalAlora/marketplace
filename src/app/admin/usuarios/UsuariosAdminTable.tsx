'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { updateRole, toggleVerificado, toggleActivo } from '@/app/dashboard/admin/usuarios/actions'

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
}

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'particular', label: 'Particular' },
  { value: 'agencia_basica', label: 'Agencia Básica' },
  { value: 'agencia_premium', label: 'Agencia Premium' },
  { value: 'admin', label: 'Admin' },
]

const ROLE_STYLES: Record<Role, string> = {
  admin: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  agencia_premium: 'bg-[#FFC107]/15 text-[#FFC107] border-[#FFC107]/25',
  agencia_basica: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  particular: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  agencia_premium: 'Premium',
  agencia_basica: 'Agencia',
  particular: 'Particular',
}

type FiltroRol = 'todos' | Role
type FiltroEstado = 'todos' | 'activo' | 'suspendido'

export default function UsuariosAdminTable({ usuarios }: { usuarios: Profile[] }) {
  const [filtroRol, setFiltroRol] = useState<FiltroRol>('todos')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')
  const [busqueda, setBusqueda] = useState('')

  const filtered = usuarios.filter(u => {
    if (filtroRol !== 'todos' && u.role !== filtroRol) return false
    if (filtroEstado === 'activo' && !u.activo) return false
    if (filtroEstado === 'suspendido' && u.activo) return false
    if (busqueda) {
      const q = busqueda.toLowerCase()
      if (!u.nombre.toLowerCase().includes(q) &&
          !u.apellido.toLowerCase().includes(q) &&
          !u.email.toLowerCase().includes(q)) return false
    }
    return true
  })

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

        <select
          value={filtroRol}
          onChange={e => setFiltroRol(e.target.value as FiltroRol)}
          className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-[#282F8F]/60"
        >
          <option value="todos" className="bg-[#111827]">Todos los roles</option>
          {ROLE_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="bg-[#111827]">{o.label}</option>
          ))}
        </select>

        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value as FiltroEstado)}
          className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-[#282F8F]/60"
        >
          <option value="todos" className="bg-[#111827]">Todos los estados</option>
          <option value="activo" className="bg-[#111827]">Activos</option>
          <option value="suspendido" className="bg-[#111827]">Suspendidos</option>
        </select>

        <span className="ml-auto text-xs text-gray-600">
          {filtered.length} de {usuarios.length} usuarios
        </span>
      </div>

      {/* Tabla */}
      <div className="rounded-2xl border border-white/6 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/2 border-b border-white/6">
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Usuario</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Rol</th>
              <th className="text-center px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Verificado</th>
              <th className="text-center px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Estado</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Registro</th>
              <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-600">
                  No hay usuarios que coincidan con los filtros
                </td>
              </tr>
            ) : (
              filtered.map(u => <UsuarioRow key={u.id} usuario={u} />)
            )}
          </tbody>
        </table>
      </div>
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
          <div className="w-8 h-8 rounded-full bg-[#282F8F]/20 border border-[#282F8F]/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#FFC107]">{u.nombre.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="font-semibold text-white">{u.nombre} {u.apellido}</p>
            <p className="text-xs text-gray-500">{u.email}</p>
          </div>
        </div>
      </td>

      {/* Rol */}
      <td className="px-5 py-4">
        <select
          value={u.role}
          onChange={e => startTransition(() => updateRole(u.id, e.target.value as Role))}
          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${ROLE_STYLES[u.role]} bg-transparent`}
        >
          {ROLE_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="bg-[#111827] text-white font-normal">
              {o.label}
            </option>
          ))}
        </select>
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
        {new Date(u.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
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
