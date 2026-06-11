import Link from 'next/link'
import LogoAutodux from '@/components/auth/LogoAutodux'
import { getSiteConfig } from '@/lib/site-config'

export default async function Footer() {
  const config = await getSiteConfig()
  const slogan    = config.footer_slogan    ?? 'Conectamos lo que buscas, con lo que se vende'
  const copyright = config.footer_copyright ?? '© 2026 AUTODUX. Todos los derechos reservados.'

  return (
    <footer className="bg-[#0D0F14]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-2.5">
              <LogoAutodux size={22} />
              <span className="font-extrabold text-lg tracking-tight text-white">
                AUTO<span className="text-[#FFC107]">DUX</span>
              </span>
            </div>
            <span className="text-xs text-gray-400">{slogan}</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-400" aria-label="Links del pie de página">
            <Link href="/terminos" className="hover:text-white transition-colors">
              Términos y condiciones
            </Link>
            <Link href="/contacto" className="hover:text-white transition-colors">
              Contacto
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs text-gray-600">
          {copyright}
        </p>
      </div>
    </footer>
  )
}
