import type { Vehiculo } from '@/types'
import VehiculoCard from './VehiculoCard'

interface GrillaVehiculosProps {
  vehiculos: Vehiculo[]
  titulo?: string
}

export default function GrillaVehiculos({ vehiculos, titulo }: GrillaVehiculosProps) {
  if (vehiculos.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No hay vehículos disponibles.</p>
      </div>
    )
  }

  return (
    <section>
      {titulo && (
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{titulo}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {vehiculos.map((v) => (
          <VehiculoCard key={v.id} vehiculo={v} />
        ))}
      </div>
    </section>
  )
}
