import type { Vehiculo } from '@/types'
import VehiculoCard from './VehiculoCard'

interface GrillaVehiculosProps {
  vehiculos: Vehiculo[]
}

export default function GrillaVehiculos({ vehiculos }: GrillaVehiculosProps) {
  if (vehiculos.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No hay vehículos disponibles.</p>
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
