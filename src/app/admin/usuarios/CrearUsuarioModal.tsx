'use client'

import { useState, useTransition } from 'react'
import { crearUsuario } from './actions'
import CustomSelect from '@/components/ui/CustomSelect'

const ROL_OPTS = [
  { value: 'particular',       label: 'Particular' },
  { value: 'agencia_basica',   label: 'Agencia básica' },
  { value: 'agencia_premium',  label: 'Agencia premium' },
]

const INPUT = 'w-full bg-[#0D0F14] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FFC107]/50 focus:ring-1 focus:ring-[#FFC107]/30 transition'

export default function CrearUsuarioModal() {
  const [open, setOpen]       = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string } | null>(null)
  const [copied, setCopied]   = useState(false)
  const [isPending, start]    = useTransition()

  function copyAll() {
    if (!createdCreds) return
    const text = `Email: ${createdCreds.email}\nContraseña temporal: ${createdCreds.password}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [nombre, setNombre]         = useState('')
  const [apellido, setApellido]     = useState('')
  const [telefono, setTelefono]     = useState('')
  const [role, setRole]             = useState('particular')
  const [nombreAgencia, setNombreAgencia] = useState('')

  const esAgencia = role === 'agencia_basica' || role === 'agencia_premium'

  function reset() {
    setEmail(''); setPassword(''); setNombre(''); setApellido('')
    setTelefono(''); setRole('particular'); setNombreAgencia('')
    setError(null); setSuccess(false); setCreatedCreds(null)
  }

  function handleClose() { reset(); setOpen(false) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email || !password || !nombre || !apellido) {
      setError('Email, contraseña, nombre y apellido son obligatorios')
      return
    }
    if (nombre.trim().length < 2) { setError('El nombre debe tener al menos 2 caracteres'); return }
    if (nombre.length > 50) { setError('El nombre no puede superar los 50 caracteres'); return }
    if (apellido.trim().length < 2) { setError('El apellido debe tener al menos 2 caracteres'); return }
    if (apellido.length > 50) { setError('El apellido no puede superar los 50 caracteres'); return }
    if (email.length > 100) { setError('El email no puede superar los 100 caracteres'); return }
    if (esAgencia && nombreAgencia.length > 80) { setError('El nombre de agencia no puede superar los 80 caracteres'); return }
    if (telefono.length > 20) { setError('El teléfono no puede superar los 20 caracteres'); return }
    if (password.length < 6) {
      setError('La contraseña temporal debe tener al menos 6 caracteres')
      return
    }
    if (password.length > 72) { setError('La contraseña no puede superar los 72 caracteres'); return }
    start(async () => {
      const result = await crearUsuario({
        email, password, nombre, apellido, telefono,
        role: role as 'particular' | 'agencia_basica' | 'agencia_premium' | 'admin',
        nombre_agencia: nombreAgencia,
      })
      if (result?.error) { setError(result.error); return }
      setCreatedCreds({ email, password })
      setSuccess(true)
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#FFC107] text-[#0D0F14] font-bold text-sm px-4 py-2 rounded-xl hover:bg-yellow-400 active:scale-[0.98] transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Crear usuario
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

          <div className="relative z-10 w-full max-w-md bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-extrabold text-white">Crear usuario</h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors" aria-label="Cerrar">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {success ? (
              <div className="py-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Usuario creado</p>
                    <p className="text-xs text-gray-400">Compartí estas credenciales con el usuario.</p>
                  </div>
                </div>
                {createdCreds && (
                  <div className="bg-[#0D0F14] border border-white/10 rounded-xl p-4 mb-4">
                    <div className="space-y-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Email</p>
                        <p className="text-sm text-white font-mono">{createdCreds.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Contraseña temporal</p>
                        <p className="text-sm text-[#FFC107] font-mono">{createdCreds.password}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={copyAll}
                      className={`w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-lg transition-colors ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      {copied ? (
                        <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>¡Copiado!</>
                      ) : (
                        <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>Copiar credenciales</>
                      )}
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500">Al iniciar sesión por primera vez, el usuario deberá cambiar su contraseña y aceptar los términos.</p>
                <button onClick={handleClose} className="mt-4 w-full py-2.5 text-sm font-bold text-[#0D0F14] bg-[#FFC107] rounded-xl hover:bg-yellow-400 transition-colors">
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Rol</label>
                  <CustomSelect
                    options={ROL_OPTS}
                    value={role}
                    onChange={setRole}
                    placeholder="Seleccioná un rol"
                  />
                </div>

                {esAgencia && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Nombre de agencia</label>
                    <input type="text" value={nombreAgencia} onChange={e => setNombreAgencia(e.target.value)} placeholder="Nombre de la agencia" maxLength={80} className={INPUT} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Nombre</label>
                    <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Juan" maxLength={50} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Apellido</label>
                    <input type="text" value={apellido} onChange={e => setApellido(e.target.value)} placeholder="Pérez" maxLength={50} className={INPUT} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@email.com" maxLength={100} className={INPUT} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Contraseña temporal</label>
                  <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mín. 6 caracteres" maxLength={72} className={INPUT} />
                  <p className="text-xs text-gray-600 mt-1">El usuario deberá cambiarla en su primer ingreso.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Teléfono</label>
                  <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Opcional" maxLength={20} className={INPUT} />
                </div>

                {error && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/25 rounded-xl px-3 py-2.5">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-[#FFC107] text-[#0D0F14] font-bold text-sm py-2.5 rounded-xl hover:bg-yellow-400 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPending && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                    {isPending ? 'Creando…' : 'Crear usuario'}
                  </button>
                  <button type="button" onClick={handleClose} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                    Cancelar
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
