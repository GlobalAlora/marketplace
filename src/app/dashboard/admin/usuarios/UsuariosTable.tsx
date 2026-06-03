'use client'

import { useTransition } from 'react'
import { updateRole, toggleVerificado, toggleActivo } from './actions'

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

const ROLE_COLORS: Record<Role, string> = {
  particular: 'text-gray-400 bg-gray-400/10',
  agencia_basica: 'text-blue-400 bg-blue-400/10',
  agencia_premium: 'text-yellow-400 bg-yellow-400/10',
  admin: 'text-purple-400 bg-purple-400/10',
}

export default function UsuariosTable({ usuarios }: { usuarios: Profile[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/8">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/8 bg-white/2">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Usuario</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rol</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Verificado</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Activo</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Registro</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {usuarios.map(u => (
            <UsuarioRow key={u.id} usuario={u} />
          ))}
        </tbody>
      </table>
      {usuarios.length === 0 && (
        <div className="text-center py-12 text-gray-600 text-sm">No hay usuarios registrados</div>
      )}
    </div>
  )
}

function UsuarioRow({ usuario: u }: { usuario: Profile }) {
  const [pending, startTransition] = useTransition()

  function handleRole(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(() => updateRole(u.id, e.target.value as Role))
  }

  function handleVerificado() {
    startTransition(() => toggleVerificado(u.id, !u.verificado))
  }

  function handleActivo() {
    startTransition(() => toggleActivo(u.id, !u.activo))
  }

  return (
    <tr className={`transition-colors hover:bg-white/2 ${pending ? 'opacity-50' : ''}`}>
      {/* Usuario */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FFC107]/15 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#FFC107]">
              {u.nombre.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-white">{u.nombre} {u.apellido}</p>
            <p className="text-xs text-gray-500">{u.email}</p>
          </div>
        </div>
      </td>

      {/* Rol */}
      <td className="px-4 py-3">
        <select
          value={u.role}
          onChange={handleRole}
          disabled={pending}
          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FFC107]/50 ${ROLE_COLORS[u.role]} bg-transparent`}
          style={{ backgroundImage: 'none' }}
        >
          {ROLE_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="bg-[#1a1a2e] text-white">
              {o.label}
            </option>
          ))}
        </select>
      </td>

      {/* Verificado */}
      <td className="px-4 py-3 text-center">
        <button
          onClick={handleVerificado}
          disabled={pending}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            u.verificado
              ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
              : 'bg-gray-500/15 text-gray-500 hover:bg-gray-500/25'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${u.verificado ? 'bg-green-400' : 'bg-gray-500'}`} />
          {u.verificado ? 'Verificado' : 'Sin verificar'}
        </button>
      </td>

      {/* Activo */}
      <td className="px-4 py-3 text-center">
        <button
          onClick={handleActivo}
          disabled={pending}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            u.activo
              ? 'bg-blue-500/15 text-blue-400 hover:bg-red-500/15 hover:text-red-400'
              : 'bg-red-500/15 text-red-400 hover:bg-blue-500/15 hover:text-blue-400'
          }`}
          title={u.activo ? 'Clic para suspender' : 'Clic para activar'}
        >
          {u.activo ? 'Activo' : 'Suspendido'}
        </button>
      </td>

      {/* Fecha */}
      <td className="px-4 py-3 text-xs text-gray-600">
        {new Date(u.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>
    </tr>
  )
}
