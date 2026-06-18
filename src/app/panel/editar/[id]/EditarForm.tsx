'use client'

import { useState, useRef, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateVehiculo } from './actions'

const INPUT = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-[#FFC107] transition-colors'
const LABEL = 'block text-xs font-semibold text-gray-400 mb-1.5'

interface VehiculoData {
  id: string
  marca: string
  modelo: string
  año: number
  kilometraje: number
  precio: number
  descripcion: string | null
  ubicacion: string
  condicion: string
  transmision: string | null
  combustible: string | null
  puertas: number | null
  color: string | null
  imagenes: string[]
}

export default function EditarForm({ vehiculo, userId }: { vehiculo: VehiculoData; userId: string }) {
  const [existingImages, setExistingImages] = useState<string[]>(vehiculo.imagenes ?? [])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const totalImages = existingImages.length + newFiles.length

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (totalImages + files.length > 8) {
      setError('Máximo 8 imágenes')
      return
    }
    setNewFiles(prev => [...prev, ...files])
    files.forEach(f => {
      const url = URL.createObjectURL(f)
      setNewPreviews(prev => [...prev, url])
    })
  }

  function removeExisting(i: number) {
    setExistingImages(prev => prev.filter((_, idx) => idx !== i))
  }

  function removeNew(i: number) {
    setNewFiles(prev => prev.filter((_, idx) => idx !== i))
    setNewPreviews(prev => {
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
      const uploadedUrls: string[] = []

      for (const file of newFiles) {
        const ext = file.name.split('.').pop()
        const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('vehiculos-imagenes')
          .upload(path, file)
        if (uploadError) throw new Error(uploadError.message)

        const { data: { publicUrl } } = supabase.storage
          .from('vehiculos-imagenes')
          .getPublicUrl(path)
        uploadedUrls.push(publicUrl)
      }

      const allImages = [...existingImages, ...uploadedUrls]
      const fd = new FormData(formEl)
      fd.set('imagenes', JSON.stringify(allImages))

      setUploading(false)
      startTransition(() => {
        updateVehiculo(vehiculo.id, fd).catch(err => setError(err instanceof Error ? err.message : 'Error al guardar'))
      })
    } catch (err: unknown) {
      setUploading(false)
      setError(err instanceof Error ? err.message : 'Error al guardar')
    }
  }

  const isLoading = uploading || pending

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Imágenes */}
      <div>
        <label className={LABEL}>Fotos del vehículo <span className="text-gray-600">(máx. 8)</span></label>
        <div className="flex flex-wrap gap-3">
          {existingImages.map((src, i) => (
            <div key={`ex-${i}`} className="relative w-24 h-20 rounded-xl overflow-hidden border border-white/10">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeExisting(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
          {newPreviews.map((src, i) => (
            <div key={`new-${i}`} className="relative w-24 h-20 rounded-xl overflow-hidden border border-[#FFC107]/30">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeNew(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
          {totalImages < 8 && (
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
          <input name="marca" required defaultValue={vehiculo.marca} placeholder="Toyota" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Modelo *</label>
          <input name="modelo" required defaultValue={vehiculo.modelo} placeholder="Corolla" className={INPUT} />
        </div>
      </div>

      {/* Año / KM */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Año *</label>
          <input name="año" type="number" required min={1900} max={2100} defaultValue={vehiculo.año} placeholder="2020" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Kilometraje *</label>
          <input name="kilometraje" type="number" required min={0} defaultValue={vehiculo.kilometraje} placeholder="45000" className={INPUT} />
        </div>
      </div>

      {/* Precio */}
      <div>
        <label className={LABEL}>Precio (ARS) *</label>
        <input name="precio" type="number" required min={1} defaultValue={vehiculo.precio} placeholder="8500000" className={INPUT} />
      </div>

      {/* Condición / Transmisión */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Condición *</label>
          <select name="condicion" required defaultValue={vehiculo.condicion ?? 'usado'} className={INPUT}>
            <option value="usado">Usado</option>
            <option value="nuevo">Nuevo</option>
          </select>
        </div>
        <div>
          <label className={LABEL}>Transmisión</label>
          <select name="transmision" defaultValue={vehiculo.transmision ?? ''} className={INPUT}>
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
          <select name="combustible" defaultValue={vehiculo.combustible ?? ''} className={INPUT}>
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
          <select name="puertas" defaultValue={vehiculo.puertas?.toString() ?? ''} className={INPUT}>
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
        <input name="color" defaultValue={vehiculo.color ?? ''} placeholder="Blanco" className={INPUT} />
      </div>

      {/* Descripción */}
      <div>
        <label className={LABEL}>Descripción</label>
        <textarea name="descripcion" rows={4} defaultValue={vehiculo.descripcion ?? ''} placeholder="Describí el estado del vehículo, extras, historial de service..." className={`${INPUT} resize-none`} />
      </div>

      {/* Ubicación */}
      <div>
        <label className={LABEL}>Ubicación *</label>
        <input name="ubicacion" required defaultValue={vehiculo.ubicacion} placeholder="Comodoro Rivadavia, Chubut" className={INPUT} />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#FFC107] hover:bg-[#e6ad00] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D0F14] font-extrabold text-sm py-3.5 rounded-xl transition-colors"
      >
        {isLoading ? (uploading ? 'Subiendo imágenes…' : 'Guardando…') : 'Guardar cambios'}
      </button>
    </form>
  )
}
