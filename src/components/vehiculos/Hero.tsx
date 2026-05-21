interface HeroProps {
  panelLogin?: React.ReactNode
}

export default function Hero({ panelLogin }: HeroProps) {
  return (
    <section className="relative bg-[#0D0F14] text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1600)' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#0D0F14]/80" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Conectamos lo que buscas,<br />
              <span className="text-[#FFC107]">con lo que se vende.</span>
            </h1>
            <div className="mt-4 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 text-[#FFC107] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.076 3.218-4.688 3.218-7.327 0-5.19-4.054-9-9-9s-9 3.81-9 9c0 2.639 1.274 5.251 3.218 7.327a19.579 19.579 0 002.682 2.282 16.944 16.944 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <p className="text-base text-gray-300 max-w-md leading-relaxed">
                La plataforma para comprar y vender autos en Comodoro Rivadavia y la región patagónica.
              </p>
            </div>
          </div>

          {panelLogin && (
            <div className="w-full lg:w-[360px] lg:shrink-0">
              {panelLogin}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
