const BENEFICIOS = [
  {
    titulo: 'Solo autos de la zona',
    descripcion: 'Vehículos de Comodoro, Rada Tilly y la región. Sin publicaciones de afuera.',
    bg: '#282F8F',
    iconColor: 'white',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.076 3.218-4.688 3.218-7.327 0-5.19-4.054-9-9-9s-9 3.81-9 9c0 2.639 1.274 5.251 3.218 7.327a19.579 19.579 0 002.682 2.282 16.944 16.944 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    titulo: 'Vendedores verificados',
    descripcion: 'Perfiles validados por el equipo AUTODUX para que comprés con total tranquilidad.',
    bg: '#FFC107',
    iconColor: '#0D0F14',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    titulo: 'Contacto directo por WhatsApp',
    descripcion: 'Sin intermediarios ni formularios. Hablás directamente con el vendedor.',
    bg: '#282F8F',
    iconColor: 'white',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    titulo: 'Rápido y simple',
    descripcion: 'Publicá tu auto en minutos con fotos y descripción. Sin costos para empezar.',
    bg: '#FFC107',
    iconColor: '#0D0F14',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export default function SeccionBeneficios() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0F14]">
            ¿Por qué usar AUTODUX?
          </h2>
          <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Diseñado para el mercado patagónico. Sin vueltas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFICIOS.map((b) => (
            <div
              key={b.titulo}
              className="flex flex-col gap-4 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: b.bg, color: b.iconColor }}
              >
                {b.icon}
              </div>
              <div>
                <h3 className="font-extrabold text-[#0D0F14] text-sm leading-snug">{b.titulo}</h3>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">{b.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
