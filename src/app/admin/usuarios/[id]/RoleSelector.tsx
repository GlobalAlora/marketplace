'use client'

import { useState, useTransition } from 'react'
import { updateRole, toggleVerificado, toggleActivo } from '@/app/admin/usuarios/actions'
import { useRouter } from 'next/navigation'
import CustomSelect from '@/components/ui/CustomSelect'

type Role = 'particular' | 'agencia_basica' | 'agencia_premium' | 'admin'

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'particular', label: 'Particular' },
  { value: 'agencia_basica', label: 'Agencia PRIME' },
  { value: 'agencia_premium', label: 'Agencia DUX' },
  { value: 'admin', label: 'Admin' },
]

interface Props {
  userId: string
  currentRole: Role
}

export default function RoleSelector({ userId, currentRole }: Props) {
  const [pending, startTransition] = useTransition()
  const [pendingAdmin, setPendingAdmin] = useState(false)
  const router = useRouter()

  function applyRole(value: Role) {
    startTransition(async () => {
      await updateRole(userId, value)
      router.refresh()
    })
  }

  // Hacer admin a alguien es una acción sensible (acceso total al panel),
  // así que pedimos una confirmación extra en vez de aplicarla apenas se
  // elige en el dropdown — a diferencia del listado masivo de Usuarios,
  // donde "admin" ni siquiera aparece como opción.
  function handleRole(value: string) {
    if (value === 'admin' && currentRole !== 'admin') {
      setPendingAdmin(true)
      return
    }
    applyRole(value as Role)
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${pending ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">Rol:</label>
        <div className="w-44">
          <CustomSelect options={ROLE_OPTIONS} value={currentRole} onChange={handleRole} />
        </div>
      </div>

      {pendingAdmin && (
        <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-xl px-3 py-2">
          <span className="text-xs text-purple-300">¿Dar acceso de administrador a este usuario?</span>
          <button
            type="button"
            onClick={() => { setPendingAdmin(false); applyRole('admin') }}
            className="text-xs font-bold text-purple-300 hover:text-purple-200 px-2 py-1 rounded-lg hover:bg-purple-500/15 transition-colors"
          >
            Confirmar
          </button>
          <button
            type="button"
            onClick={() => setPendingAdmin(false)}
            className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
