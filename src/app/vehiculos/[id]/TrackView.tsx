'use client'

import { useEffect, useRef } from 'react'
import { registrarMetrica } from './actions'

export default function TrackView({ vehiculoId }: { vehiculoId: string }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    registrarMetrica(vehiculoId, 'view')
  }, [vehiculoId])

  return null
}
