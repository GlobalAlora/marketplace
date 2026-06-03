'use client'

import { useTransition } from 'react'
import { updateRole, toggleVerificado, toggleActivo } from '@/app/admin/usuarios/actions'
import { useRouter } from 'next/navigation'

type Role = 'particular' | 'agencia_basica' | 'agencia_premium' | 'admin'

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'particular', label: 'Particular' },
  { value: 'agencia_basica', label: 'Agencia Básica' },
  { value: 'agencia_premium', label: 'Agencia Premium' },
  { value: 'admin', label: 'Admin' },
]

interface Props {
  userId: string
  currentRole: Role
}

export default function RoleSelector({ userId, currentRole }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleRole(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(async () => {
      await updateRole(userId, e.target.value as Role)
      router.refresh()
    })
  }

  return (
    <div className={`flex flex-wrap gap-3 ${pending ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">Rol:</label>
        <select
          value={currentRole}
          onChange={handleRole}
          className="text-sm font-semibold px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#282F8F]/60"
        >
          {ROLE_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="bg-[#111827]">{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
