'use client'

import { useState, useRef, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createVehiculo } from './actions'

const INPUT = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-[#FFC107] transition-colors'
const LABEL = 'block text-xs font-semibold text-gray-400 mb-1.5'

export default function PublicarForm({ userId }: { userId: string }) {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (images.length + files.length > 8) {
      setError('Máximo 8 imágenes')
      return
    }
    setImages(prev => [...prev, ...files])
    files.forEach(f => {
      const url = URL.createObjectURL(f)
      setPreviews(prev => [...prev, url])
    })
  }

  function removeImage(i: number) {
    setImages(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => {
      URL.revokeObjectURL(prev[i])
      return prev.filter((_, idx) => idx !== i)
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setUploading(true)
    const formEl = e.currentTarget

    try {
      const supabase = createClient()
      const urls: string[] = []

      for (const file of images) {
        const ext = file.name.split('.').pop()
        const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('vehiculos-imagenes')
          .upload(path, file)
        if (uploadError) throw new Error(uploadError.message)

        const { data: { publicUrl } } = supabase.storage
          .from('vehiculos-imagenes')
          .getPublicUrl(path)
        urls.push(publicUrl)
      }

      const fd = new FormData(formEl)
      fd.set('imagenes', JSON.stringify(urls))

      setUploading(false)
      startTransition(() => {
        createVehiculo(fd).catch(err => setError(err.message))
      })
    } catch (err: unknown) {
      setUploading(false)
      setError(err instanceof Error ? err.message : 'Error al publicar')
    }
  }

  const isLoading = uploading || pending

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Imágenes */}
      <div>
        <label className={LABEL}>Fotos del vehículo <span className="text-gray-600">(máx. 8)</span></label>
        <div className="flex flex-wrap gap-3">
          {previews.map((src, i) => (
            <div key={i} className="relative w-24 h-20 rounded-xl overflow-hidden border border-white/10">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
          {images.length < 8 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-24 h-20 rounded-xl border border-dashed border-white/20 hover:border-[#FFC107]/60 text-gray-500 hover:text-[#FFC107] text-2xl flex items-center justify-center transition-colors"
            >
              +
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleImageSelect}
        />
      </div>

      {/* Marca / Modelo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Marca *</label>
          <input name="marca" required placeholder="Toyota" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Modelo *</label>
          <input name="modelo" required placeholder="Corolla" className={INPUT} />
        </div>
      </div>

      {/* Año / KM */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Año *</label>
          <input name="año" type="number" required min={1900} max={2100} placeholder="2020" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Kilometraje *</label>
          <input name="kilometraje" type="number" required min={0} placeholder="45000" className={INPUT} />
        </div>
      </div>

      {/* Precio */}
      <div>
        <label className={LABEL}>Precio (ARS) *</label>
        <input name="precio" type="number" required min={1} placeholder="8500000" className={INPUT} />
      </div>

      {/* Condición / Transmisión */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Condición *</label>
          <select name="condicion" required defaultValue="usado" className={INPUT}>
            <option value="usado">Usado</option>
            <option value="nuevo">Nuevo</option>
          </select>
        </div>
        <div>
          <label className={LABEL}>Transmisión</label>
          <select name="transmision" className={INPUT}>
            <option value="">Sin especificar</option>
            <option value="manual">Manual</option>
            <option value="automatica">Automática</option>
          </select>
        </div>
      </div>

      {/* Combustible / Puertas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Combustible</label>
          <select name="combustible" className={INPUT}>
            <option value="">Sin especificar</option>
            <option value="nafta">Nafta</option>
            <option value="diesel">Diésel</option>
            <option value="gnc">GNC</option>
            <option value="hibrido">Híbrido</option>
            <option value="electrico">Eléctrico</option>
          </select>
        </div>
        <div>
          <label className={LABEL}>Puertas</label>
          <select name="puertas" className={INPUT}>
            <option value="">Sin especificar</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>

      {/* Color */}
      <div>
        <label className={LABEL}>Color</label>
        <input name="color" placeholder="Blanco" className={INPUT} />
      </div>

      {/* Descripción */}
      <div>
        <label className={LABEL}>Descripción</label>
        <textarea name="descripcion" rows={4} placeholder="Describí el estado del vehículo, extras, historial de service..." className={`${INPUT} resize-none`} />
      </div>

      {/* Ubicación */}
      <div>
        <label className={LABEL}>Ubicación *</label>
        <input name="ubicacion" required placeholder="Comodoro Rivadavia, Chubut" className={INPUT} />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#FFC107] hover:bg-[#e6ad00] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D0F14] font-extrabold text-sm py-3.5 rounded-xl transition-colors"
      >
        {isLoading ? (uploading ? 'Subiendo imágenes…' : 'Publicando…') : 'Publicar vehículo'}
      </button>
    </form>
  )
}
