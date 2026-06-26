'use client'

import { useState, useRef, useEffect, useMemo } from 'react'

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxSelectProps {
  name?: string
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  theme?: 'dark' | 'light'
}

// Dropdown con buscador arriba del listado — usado en filtros donde hay
// muchas opciones (marcas, ciudades) y escanear visualmente no escala.
export default function ComboboxSelect({
  name,
  options,
  value,
  onChange,
  placeholder = 'Seleccionar',
  searchPlaceholder = 'Buscar...',
  className = '',
  theme = 'dark',
}: ComboboxSelectProps) {
  const isLight = theme === 'light'
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (open) {
      setQuery('')
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter(o => o.label.toLowerCase().includes(q))
  }, [options, query])

  const selected = options.find(o => o.value === value)

  function handleSelect(v: string) {
    onChange(v)
    setOpen(false)
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={
          isLight
            ? 'w-full flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#282F8F] transition-colors'
            : 'w-full flex items-center justify-between gap-2 bg-[#1a1a2e] border border-white/10 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFC107] transition-colors'
        }
      >
        <span className={selected ? `truncate ${isLight ? 'text-gray-800' : 'text-white'}` : `truncate ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>{selected?.label ?? placeholder}</span>
        <svg className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-gray-400' : 'text-gray-400'} transition-transform duration-150 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className={
          isLight
            ? 'absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden'
            : 'absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-[#0d2137] border border-white/15 rounded-xl shadow-2xl shadow-black/60 overflow-hidden'
        }>
          <div className={`p-2 border-b ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className={
                isLight
                  ? 'w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#282F8F]'
                  : 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-[#FFC107]/60'
              }
            />
          </div>
          <ul role="listbox" className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className={`px-4 py-3 text-sm ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>Sin resultados</li>
            ) : (
              filtered.map(opt => (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={opt.value === value}
                    onClick={() => handleSelect(opt.value)}
                    className={
                      opt.value === value
                        ? (isLight ? 'w-full text-left px-4 py-2.5 text-sm bg-[#282F8F]/10 text-[#282F8F] font-semibold' : 'w-full text-left px-4 py-2.5 text-sm bg-[#FFC107]/15 text-[#FFC107] font-semibold')
                        : (isLight ? 'w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50' : 'w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/8 hover:text-white')
                    }
                  >
                    {opt.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
