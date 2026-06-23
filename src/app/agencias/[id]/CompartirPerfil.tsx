'use client'

import { useState, useRef, useEffect } from 'react'

interface CompartirPerfilProps {
  slug: string
  nombre: string
}

function IconShare() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
  )
}

export default function CompartirPerfil({ slug, nombre }: CompartirPerfilProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function getUrl(): string {
    return `${window.location.origin}/agencias/${slug}`
  }

  async function handleMainClick() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: nombre,
          text: `Mirá los vehículos de ${nombre} en AUTODUX`,
          url: getUrl(),
        })
      } catch {
        // el usuario canceló el share nativo — no hacemos nada
      }
      return
    }
    setOpen(v => !v)
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
      setOpen(false)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard no disponible — silencioso
    }
  }

  function handleWhatsapp() {
    const texto = `Mirá los vehículos de ${nombre} en AUTODUX: ${getUrl()}`
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleMainClick}
        className="inline-flex items-center gap-2 border border-white/15 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all"
      >
        <IconShare />
        Compartir perfil
      </button>

      {copied && (
        <span className="absolute -bottom-8 left-0 whitespace-nowrap text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          ¡Link copiado!
        </span>
      )}

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 min-w-[200px] bg-[#0d2137] border border-white/15 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/8 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5A2.25 2.25 0 0118 21.75H6A2.25 2.25 0 013.75 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            Copiar link
          </button>
          <button
            type="button"
            onClick={handleWhatsapp}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/8 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Compartir por WhatsApp
          </button>
        </div>
      )}
    </div>
  )
}
