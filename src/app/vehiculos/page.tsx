import { Suspense } from 'react'
import type { Metadata } from 'next'
import MainLayout from '@/components/layout/MainLayout'
import ListadoVehiculos from './ListadoVehiculos'

export const metadata: Metadata = {
  title: 'Todos los vehículos — AUTODUX | Comodoro Rivadavia',
  description: 'Explorá todos los autos disponibles en Comodoro Rivadavia y la región patagónica. Filtrá por marca, precio, año y ubicación.',
}

export default function VehiculosPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen bg-[#071526]" />}>
        <ListadoVehiculos />
      </Suspense>
    </MainLayout>
  )
}
