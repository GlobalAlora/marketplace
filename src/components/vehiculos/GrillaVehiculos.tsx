import type { Vehiculo } from '@/types'
import VehiculoCard from './VehiculoCard'

interface GrillaVehiculosProps {
  vehiculos: Vehiculo[]
}

export default function GrillaVehiculos({ vehiculos }: GrillaVehiculosProps) {
  if (vehiculos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-9 h-9">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-white mb-1">Sin resultados</h3>
        <p className="text-sm text-gray-400 max-w-xs">
          No encontramos autos con esos filtros. Probá con otra marca, rango de precio o revisá más tarde.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {vehiculos.map((v) => (
        <VehiculoCard key={v.id} vehiculo={v} />
      ))}
    </div>
  )
}
