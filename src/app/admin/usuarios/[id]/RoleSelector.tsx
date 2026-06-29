'use client'

import { useTransition } from 'react'
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
  const router = useRouter()

  function handleRole(value: string) {
    startTransition(async () => {
      await updateRole(userId, value as Role)
      router.refresh()
    })
  }

  return (
    <div className={`flex flex-wrap gap-3 ${pending ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">Rol:</label>
        <div className="w-44">
          <CustomSelect options={ROLE_OPTIONS} value={currentRole} onChange={handleRole} />
        </div>
      </div>
    </div>
  )
}
