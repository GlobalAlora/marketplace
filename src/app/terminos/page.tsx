import type { Metadata } from 'next'
import MainLayout from '@/components/layout/MainLayout'

export const metadata: Metadata = {
  title: 'Términos y condiciones — AUTODUX',
}

// TODO: el cliente va a proveer el contenido final de términos y condiciones.
export default function TerminosPage() {
  return (
    <MainLayout>
      <div className="bg-[#0D0F14] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Términos y condiciones
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Estamos preparando el contenido completo de esta sección. Próximamente vas a encontrar
            acá los términos de uso de AUTODUX.
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
