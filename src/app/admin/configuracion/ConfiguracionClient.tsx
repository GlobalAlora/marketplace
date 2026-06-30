'use client'

import { useRef, useTransition, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateSiteConfig } from './actions'
import type { SiteConfig } from '@/lib/site-config'

interface Field {
  key: string
  label: string
  type: 'text' | 'textarea' | 'image'
  placeholder?: string
}

const FIELDS: Field[] = [
  // Hero
  { key: 'hero_titulo_linea1',     label: 'Hero — Título línea 1',          type: 'text',     placeholder: 'Conectamos lo que buscas,' },
  { key: 'hero_titulo_linea2',     label: 'Hero — Título línea 2',          type: 'text',     placeholder: 'con lo que se vende.' },
  { key: 'hero_subtitulo',         label: 'Hero — Subtítulo de ubicación',  type: 'text',     placeholder: 'Comodoro Rivadavia, Rada Tilly…' },
  { key: 'hero_imagen_fondo',      label: 'Hero — Imagen de fondo',         type: 'image' },
  // Sobre nosotros
  { key: 'sobre_nosotros_imagen_fondo', label: 'Sobre nosotros — Imagen de fondo', type: 'image' },
  // Beneficios
  { key: 'beneficios_titulo',      label: 'Beneficios — Título',            type: 'text',     placeholder: '¿Por qué usar AUTODUX?' },
  { key: 'beneficios_subtitulo_1', label: 'Beneficios — Subtítulo línea 1', type: 'text',    placeholder: 'Encontrá tu próximo vehículo…' },
  { key: 'beneficios_subtitulo_2', label: 'Beneficios — Subtítulo línea 2', type: 'text',    placeholder: 'Compará agencias, vehículos…' },
  // Vitrina
  { key: 'vitrina_titulo',         label: 'Vitrina — Título',               type: 'text',     placeholder: 'Vitrina AUTODUX' },
  { key: 'vitrina_subtitulo',      label: 'Vitrina — Subtítulo',            type: 'text',     placeholder: 'Los mejores vehículos…' },
  // Footer
  { key: 'footer_slogan',          label: 'Footer — Slogan',                type: 'text',     placeholder: 'Conectamos lo que buscas…' },
  { key: 'footer_copyright',       label: 'Footer — Texto copyright',       type: 'text',     placeholder: '© 2026 AUTODUX…' },
  // General
  { key: 'site_slogan',            label: 'General — Slogan del sitio',     type: 'textarea', placeholder: 'Conectamos lo que buscas, con lo que se vende.' },
  { key: 'whatsapp_num',           label: 'General — Número de WhatsApp (sin +)', type: 'text', placeholder: '5492974015243' },
  { key: 'instagram_user',         label: 'General — Usuario de Instagram (sin @)', type: 'text', placeholder: 'autoduxpatagonia' },
  { key: 'facebook_page',          label: 'General — Página de Facebook',   type: 'text',     placeholder: 'AutoDux' },
  { key: 'contact_email',          label: 'General — Email de contacto',    type: 'text',     placeholder: 'grupoautodux@gmail.com' },
]

const SECTIONS = [
  { label: 'Hero',          keys: ['hero_titulo_linea1', 'hero_titulo_linea2', 'hero_subtitulo', 'hero_imagen_fondo'] },
  { label: 'Sobre nosotros', keys: ['sobre_nosotros_imagen_fondo'] },
  { label: 'Beneficios',    keys: ['beneficios_titulo', 'beneficios_subtitulo_1', 'beneficios_subtitulo_2'] },
  { label: 'Vitrina',       keys: ['vitrina_titulo', 'vitrina_subtitulo'] },
  { label: 'Footer',        keys: ['footer_slogan', 'footer_copyright'] },
  { label: 'General',       keys: ['site_slogan', 'whatsapp_num', 'instagram_user', 'facebook_page', 'contact_email'] },
]

function ImageField({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string
  value: string
  onChange: (value: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${fieldKey}-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('site-config').upload(path, file, { upsert: true })
      if (error) throw new Error(error.message)
      const { data: { publicUrl } } = supabase.storage.from('site-config').getPublicUrl(path)
      onChange(publicUrl)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center gap-3 bg-[#0D0F14] border border-white/10 rounded-xl px-4 py-3 hover:border-[#FFC107]/50 transition-colors disabled:opacity-60"
      >
        {value ? (
          <img src={value} alt="" className="w-20 h-12 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-20 h-12 rounded-lg bg-white/5 shrink-0" />
        )}
        <span className="text-sm text-gray-400">
          {uploading ? 'Subiendo…' : value ? 'Cambiar imagen' : 'Subir imagen…'}
        </span>
      </button>
      {uploadError && <p className="text-xs text-red-400 mt-1.5">{uploadError}</p>}
    </div>
  )
}

export default function ConfiguracionClient({ config }: { config: SiteConfig }) {
  const [values, setValues] = useState<SiteConfig>({ ...config })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChange(key: string, value: string) {
    setValues(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await updateSiteConfig(values)
      if (result?.error) {
        setError(result.error)
      } else {
        setSaved(true)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {SECTIONS.map(section => {
        const sectionFields = FIELDS.filter(f => section.keys.includes(f.key))
        return (
          <div key={section.label}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#FFC107] mb-4">
              {section.label}
            </h2>
            <div className="space-y-4">
              {sectionFields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    {field.label}
                  </label>

                  {field.type === 'image' ? (
                    <ImageField
                      fieldKey={field.key}
                      value={values[field.key] ?? ''}
                      onChange={v => handleChange(field.key, v)}
                    />
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={values[field.key] ?? ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full bg-[#0D0F14] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FFC107]/50 focus:ring-1 focus:ring-[#FFC107]/30 transition resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.key] ?? ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-[#0D0F14] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FFC107]/50 focus:ring-1 focus:ring-[#FFC107]/30 transition"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#FFC107] text-[#0D0F14] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#FFD033] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {saved && !isPending && (
          <span className="text-sm text-green-400 font-medium">
            ✓ Cambios guardados
          </span>
        )}
      </div>
    </form>
  )
}
