'use client'

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

interface RevealSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'none'
}

export default function RevealSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const transform = !visible
    ? direction === 'up' ? 'translateY(32px)'
    : direction === 'left' ? 'translateX(-20px)'
    : 'none'
    : 'none'

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform,
    transition: `opacity 0.65s ease, transform 0.65s ease`,
    transitionDelay: `${delay}ms`,
  }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
