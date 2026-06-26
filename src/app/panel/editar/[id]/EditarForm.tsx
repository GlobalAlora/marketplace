'use client'

import { useState, useRef, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateVehiculo } from './actions'
import { TIPOS_VEHICULO, TIPOS_MOTO } from '@/lib/constants'
import CustomSelect from '@/components/ui/CustomSelect'

const INPUT = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-[#FFC107] transition-colors'
const LABEL = 'block text-xs font-semibold text-gray-400 mb-1.5'

const MAX_PRECIO = 999_999_999

const TIPO_VEHICULO_OPTS = TIPOS_VEHICULO.map(t => ({ value: t.value, label: t.label }))
const TIPO_MOTO_OPTS = [{ value: '', label: 'Sin especificar' }, ...TIPOS_MOTO.map(t => ({ value: t.value, label: t.label }))]
const CONDICION_OPTS = [{ value: 'usado', label: 'Usado' }, { value: 'nuevo', label: 'Nuevo' }]
const TRANSMISION_OPTS = [
  { value: '', label: 'Sin especificar' },
  { value: 'manual', label: 'Manual' },
  { value: 'automatica', label: 'Automática' },
]
const COMBUSTIBLE_OPTS = [
  { value: '', label: 'Sin especificar' },
  { value: 'nafta', label: 'Nafta' },
  { value: 'diesel', label: 'Diésel' },
  { value: 'gnc', label: 'GNC' },
  { value: 'hibrido', label: 'Híbrido' },
  { value: 'electrico', label: 'Eléctrico' },
]
const PUERTAS_OPTS = [
  { value: '', label: 'Sin especificar' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
]

function spanishValidity(e: React.InvalidEvent<HTMLInputElement>) {
  const el = e.currentTarget
  if (el.validity.valueMissing) el.setCustomValidity('Este campo es obligatorio')
  else if (el.validity.rangeUnderflow) el.setCustomValidity(`El valor mínimo es ${el.min}`)
  else if (el.validity.rangeOverflow) el.setCustomValidity(`El valor máximo es ${Number(el.max).toLocaleString('es-AR')}`)
  else if (el.validity.typeMismatch) el.setCustomValidity('Ingresá un valor válido')
  else el.setCustomValidity('')
}

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
  tipo_vehiculo: string | null
  cilindrada: number | null
  tipo_moto: string | null
}

// Unified item: existing images have only src; new uploads also have file
interface ImageItem { src: string; file?: File }

export default function EditarForm({ vehiculo, userId }: { vehiculo: VehiculoData; userId: string }) {
  const [items, setItems] = useState<ImageItem[]>(
    (vehiculo.imagenes ?? []).map(src => ({ src }))
  )
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)
  const dragIndex = useRef<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)
  const [tipoVehiculo, setTipoVehiculo] = useState(vehiculo.tipo_vehiculo ?? 'auto')
  const esMoto = tipoVehiculo === 'moto'

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const oversized = files.filter(f => f.size > 5 * 1024 * 1024)
    if (oversized.length > 0) {
      setError(`Las siguientes imágenes superan el límite de 5 MB: ${oversized.map(f => f.name).join(', ')}`)
      e.target.value = ''
      return
    }
    if (items.length + files.length > 8) {
      setError('Máximo 8 imágenes')
      e.target.value = ''
      return
    }
    setError(null)
    setItems(prev => [
      ...prev,
      ...files.map(f => ({ src: URL.createObjectURL(f), file: f })),
    ])
    e.target.value = ''
  }

  function removeItem(i: number) {
    setItems(prev => {
      const item = prev[i]
      if (item.file) URL.revokeObjectURL(item.src)
      return prev.filter((_, idx) => idx !== i)
    })
  }

  function onDragStart(i: number) { dragIndex.current = i }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    setDragOver(i)
  }
  function onDrop(i: number) {
    const from = dragIndex.current
    if (from === null || from === i) { setDragOver(null); return }
    setItems(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(i, 0, moved)
      return next
    })
    dragIndex.current = null
    setDragOver(null)
  }
  function onDragEnd() { dragIndex.current = null; setDragOver(null) }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setUploading(true)
    const formEl = e.currentTarget

    try {
      const supabase = createClient()
      const allUrls: string[] = []

      for (const item of items) {
        if (!item.file) {
          allUrls.push(item.src)
        } else {
          const ext = item.file.name.split('.').pop()
          const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const { error: uploadError } = await supabase.storage
            .from('vehiculos-imagenes')
            .upload(path, item.file)
          if (uploadError) throw new Error(
            uploadError.message.toLowerCase().includes('size')
              ? 'Una imagen supera el tamaño máximo permitido de 5 MB'
              : uploadError.message
          )

          const { data: { publicUrl } } = supabase.storage
            .from('vehiculos-imagenes')
            .getPublicUrl(path)
          allUrls.push(publicUrl)
        }
      }

      const fd = new FormData(formEl)
      fd.set('imagenes', JSON.stringify(allUrls))

      setUploading(false)
      startTransition(() => {
        updateVehiculo(vehiculo.id, fd).catch(err => {
          if (err?.message === 'NEXT_REDIRECT') return
          setError(err instanceof Error ? err.message : 'Error al guardar')
        })
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
        <label className={LABEL}>
          Fotos del vehículo <span className="text-gray-600">(máx. 8 · arrastrá para reordenar)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {items.map((item, i) => (
            <div
              key={item.src}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={e => onDragOver(e, i)}
              onDrop={() => onDrop(i)}
              onDragEnd={onDragEnd}
              className={`relative w-24 h-20 rounded-xl overflow-hidden border transition-all cursor-grab active:cursor-grabbing select-none
                ${item.file ? 'border-[#FFC107]/30' : 'border-white/10'}
                ${dragOver === i ? 'border-[#FFC107] scale-105 opacity-70' : ''}`}
            >
              <img src={item.src} alt="" className="w-full h-full object-cover pointer-events-none" />
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-[9px] font-bold text-center bg-[#FFC107] text-[#0D0F14] py-0.5">
                  PORTADA
                </span>
              )}
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
          {items.length < 8 && (
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

      {/* Tipo de vehículo */}
      <div>
        <label className={LABEL}>Tipo de vehículo *</label>
        <CustomSelect
          name="tipo_vehiculo"
          options={TIPO_VEHICULO_OPTS}
          value={tipoVehiculo}
          onChange={setTipoVehiculo}
        />
      </div>

      {/* Campos específicos de moto */}
      {esMoto && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Cilindrada (cc)</label>
            <input name="cilindrada" type="number" min={0} defaultValue={vehiculo.cilindrada ?? ''} placeholder="150" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Tipo de moto</label>
            <CustomSelect name="tipo_moto" options={TIPO_MOTO_OPTS} defaultValue={vehiculo.tipo_moto ?? ''} />
          </div>
        </div>
      )}

      {/* Marca / Modelo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Marca *</label>
          <input name="marca" required defaultValue={vehiculo.marca} placeholder="Toyota" className={INPUT}
            onInvalid={e => { const el = e.currentTarget; el.setCustomValidity(el.validity.valueMissing ? 'Este campo es obligatorio' : '') }}
            onInput={e => e.currentTarget.setCustomValidity('')} />
        </div>
        <div>
          <label className={LABEL}>Modelo *</label>
          <input name="modelo" required defaultValue={vehiculo.modelo} placeholder="Corolla" className={INPUT}
            onInvalid={e => { const el = e.currentTarget; el.setCustomValidity(el.validity.valueMissing ? 'Este campo es obligatorio' : '') }}
            onInput={e => e.currentTarget.setCustomValidity('')} />
        </div>
      </div>

      {/* Año / KM */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Año *</label>
          <input name="año" type="number" required min={1900} max={2100} defaultValue={vehiculo.año} placeholder="2020" className={INPUT}
            onInvalid={spanishValidity} onInput={e => e.currentTarget.setCustomValidity('')} />
        </div>
        <div>
          <label className={LABEL}>Kilometraje *</label>
          <input name="kilometraje" type="number" required min={0} defaultValue={vehiculo.kilometraje} placeholder="45000" className={INPUT}
            onInvalid={spanishValidity} onInput={e => e.currentTarget.setCustomValidity('')} />
        </div>
      </div>

      {/* Precio */}
      <div>
        <label className={LABEL}>Precio (ARS) * <span className="text-gray-600 font-normal">máx. $999.999.999</span></label>
        <input name="precio" type="number" required min={1} max={MAX_PRECIO} defaultValue={vehiculo.precio} placeholder="8500000" className={INPUT}
          onInvalid={spanishValidity} onInput={e => e.currentTarget.setCustomValidity('')} />
        <div className="mt-2.5 flex items-start gap-2.5 bg-white/3 border border-white/8 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-0.5">Transparencia en la publicación</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Ingresá el valor real de venta del vehículo. Las publicaciones con precios ficticios, irrisorios
              o cargados únicamente para destacarse en los listados pueden ser revisadas, corregidas o
              despublicadas por Autodux.
            </p>
          </div>
        </div>
      </div>

      {/* Condición / Transmisión */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Condición *</label>
          <CustomSelect name="condicion" options={CONDICION_OPTS} defaultValue={vehiculo.condicion ?? 'usado'} />
        </div>
        <div>
          <label className={LABEL}>Transmisión</label>
          <CustomSelect name="transmision" options={TRANSMISION_OPTS} defaultValue={vehiculo.transmision ?? ''} />
        </div>
      </div>

      {/* Combustible / Puertas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Combustible</label>
          <CustomSelect name="combustible" options={COMBUSTIBLE_OPTS} defaultValue={vehiculo.combustible ?? ''} />
        </div>
        <div>
          <label className={LABEL}>Puertas</label>
          <CustomSelect name="puertas" options={PUERTAS_OPTS} defaultValue={vehiculo.puertas?.toString() ?? ''} />
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
