import MainLayout from '@/components/layout/MainLayout'
import Hero from '@/components/vehiculos/Hero'
import GrillaVehiculos from '@/components/vehiculos/GrillaVehiculos'
import { MOCK_VEHICULOS } from '@/lib/utils/mock-data'

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <GrillaVehiculos vehiculos={MOCK_VEHICULOS} />
    </MainLayout>
  )
}
