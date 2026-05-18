import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#111111]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>Marketplace Comodoro &copy; 2026</span>
          <nav className="flex items-center gap-6" aria-label="Links del pie de página">
            <Link href="/terminos" className="hover:text-white transition-colors">
              Términos y condiciones
            </Link>
            <Link href="/contacto" className="hover:text-white transition-colors">
              Contacto
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
