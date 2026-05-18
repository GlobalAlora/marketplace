import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-[#0D0F14] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Comprá y vendé<br />
            <span className="text-[#FFC107]">vehículos en Comodoro</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-lg">
            El marketplace de autos, camionetas y utilitarios de Comodoro Rivadavia y la región.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/vehiculos"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#FFC107] text-[#0D0F14] font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Ver vehículos
            </Link>
            <Link
              href="/publicar"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#FFC107] text-[#FFC107] font-semibold rounded-lg hover:bg-[#FFC107]/10 transition-colors"
            >
              Publicar mi vehículo
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-8 text-gray-400">
          <div>
            <p className="text-3xl font-extrabold text-white">+500</p>
            <p className="text-sm mt-1">Vehículos publicados</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">+200</p>
            <p className="text-sm mt-1">Vendedores activos</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">100%</p>
            <p className="text-sm mt-1">Patagónico</p>
          </div>
        </div>
      </div>
    </section>
  )
}
