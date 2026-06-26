'use client'

import { useState, useRef, useEffect } from 'react'

export interface CustomSelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  name: string
  options: CustomSelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
}

// Dropdown 100% custom — evita el flicker/render nativo del <select> del
// navegador (listbox blanco aunque el resto del input esté en dark mode).
export default function CustomSelect({
  name,
  options,
  value: controlledValue,
  defaultValue = '',
  onChange,
  placeholder = 'Seleccionar',
}: CustomSelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function handleSelect(v: string) {
    if (controlledValue === undefined) setInternalValue(v)
    onChange?.(v)
    setOpen(false)
  }

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-2 bg-[#1a1a2e] border border-white/10 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFC107] transition-colors"
      >
        <span className={selected ? 'text-white' : 'text-gray-500'}>{selected?.label ?? placeholder}</span>
        <svg className={`w-3.5 h-3.5 shrink-0 text-gray-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 max-h-60 overflow-y-auto bg-[#0d2137] border border-white/15 rounded-xl shadow-2xl shadow-black/60"
        >
          {options.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => handleSelect(opt.value)}
                className={[
                  'w-full text-left px-4 py-2.5 text-sm transition-colors',
                  opt.value === value
                    ? 'bg-[#FFC107]/15 text-[#FFC107] font-semibold'
                    : 'text-gray-300 hover:bg-white/8 hover:text-white',
                ].join(' ')}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
