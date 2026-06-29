import Link from 'next/link'
import LogoAutodux from '@/components/auth/LogoAutodux'
import { getSiteConfig } from '@/lib/site-config'

export default async function Footer() {
  const config = await getSiteConfig()
  const slogan    = config.footer_slogan    ?? 'Conectamos lo que buscas, con lo que se vende'
  const copyright = config.footer_copyright ?? '© 2026 AUTODUX. Todos los derechos reservados.'

  const whatsapp  = config.whatsapp_num  ?? '5492974015243'
  const instagram = config.instagram_user ?? 'autoduxpatagonia'
  const facebook  = config.facebook_page  ?? 'AutoDux'
  const email     = config.contact_email  ?? 'grupoautodux@gmail.com'

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

          {/* Redes y contacto */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-[#25D366] hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-1.888-.835-3.13-2.51-3.34-2.857-.184-.295-.013-.467.142-.629.13-.139.293-.36.44-.541.146-.182.194-.31.293-.519.099-.21.05-.39-.05-.539-.1-.149-.42-1.027-.583-1.412-.158-.371-.318-.32-.435-.327-.108-.005-.232-.005-.357-.005-.124 0-.327.05-.5.245-.174.198-.671.654-.671 1.595 0 .94.652 1.85 1.041 2.337.39.487 1.756 2.476 4.314 3.376 2.557.9 2.557.6 3.018.563.46-.038 1.487-.604 1.69-1.187.205-.583.205-1.084.143-1.187-.062-.103-.227-.165-.479-.314z" /><path d="M12.04 1.96A10.04 10.04 0 002 12c0 1.77.464 3.43 1.27 4.866L2 22l5.292-1.276A10.04 10.04 0 0012.04 22a10.04 10.04 0 100-20.04zm0 18.18a8.12 8.12 0 01-4.14-1.135l-.297-.176-3.143.758.749-3.07-.193-.31A8.116 8.116 0 013.92 12a8.12 8.12 0 1116.24 0 8.12 8.12 0 01-8.12 8.14z" /></svg>
            </a>
            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-[#E1306C] hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <a
              href={`https://facebook.com/${facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-[#1877F2] hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.563 9.875v-6.987h-2.54v-2.888h2.54V9.797c0-2.508 1.493-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.987A10 10 0 0022 12z" /></svg>
            </a>
            <a
              href={`mailto:${email}`}
              title="Email"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-.414.336-.75.75-.75h18a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V6.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75l8.4 6.3a1 1 0 001.2 0L21 6.75" /></svg>
            </a>
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
