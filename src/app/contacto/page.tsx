import type { Metadata } from 'next'
import MainLayout from '@/components/layout/MainLayout'
import { getSiteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Contacto — AUTODUX',
}

export default async function ContactoPage() {
  const config = await getSiteConfig()

  const whatsapp    = config.whatsapp_num     ?? '5492974015243'
  const whatsappMsg = config.whatsapp_mensaje ?? 'Hola, me comunico desde AUTODUX. Quería consultarles sobre...'
  const instagram   = config.instagram_user   ?? 'autoduxpatagonia'
  const facebook    = config.facebook_page    ?? 'AutoDux'
  const email       = config.contact_email    ?? 'grupoautodux@gmail.com'

  const ITEMS = [
    {
      label: 'WhatsApp',
      value: `+${whatsapp}`,
      href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMsg)}`,
      external: true,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-1.888-.835-3.13-2.51-3.34-2.857-.184-.295-.013-.467.142-.629.13-.139.293-.36.44-.541.146-.182.194-.31.293-.519.099-.21.05-.39-.05-.539-.1-.149-.42-1.027-.583-1.412-.158-.371-.318-.32-.435-.327-.108-.005-.232-.005-.357-.005-.124 0-.327.05-.5.245-.174.198-.671.654-.671 1.595 0 .94.652 1.85 1.041 2.337.39.487 1.756 2.476 4.314 3.376 2.557.9 2.557.6 3.018.563.46-.038 1.487-.604 1.69-1.187.205-.583.205-1.084.143-1.187-.062-.103-.227-.165-.479-.314z" /><path d="M12.04 1.96A10.04 10.04 0 002 12c0 1.77.464 3.43 1.27 4.866L2 22l5.292-1.276A10.04 10.04 0 0012.04 22a10.04 10.04 0 100-20.04zm0 18.18a8.12 8.12 0 01-4.14-1.135l-.297-.176-3.143.758.749-3.07-.193-.31A8.116 8.116 0 013.92 12a8.12 8.12 0 1116.24 0 8.12 8.12 0 01-8.12 8.14z" /></svg>
      ),
      color: 'text-[#25D366]',
      bg: 'bg-[#25D366]/10 border-[#25D366]/20 hover:border-[#25D366]/40',
    },
    {
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
      external: false,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-.414.336-.75.75-.75h18a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V6.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75l8.4 6.3a1 1 0 001.2 0L21 6.75" /></svg>
      ),
      color: 'text-white',
      bg: 'bg-white/5 border-white/10 hover:border-white/25',
    },
    {
      label: 'Instagram',
      value: `@${instagram}`,
      href: `https://instagram.com/${instagram}`,
      external: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></svg>
      ),
      color: 'text-[#E1306C]',
      bg: 'bg-[#E1306C]/10 border-[#E1306C]/20 hover:border-[#E1306C]/40',
    },
    {
      label: 'Facebook',
      value: facebook,
      href: `https://facebook.com/${facebook}`,
      external: true,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.563 9.875v-6.987h-2.54v-2.888h2.54V9.797c0-2.508 1.493-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.987A10 10 0 0022 12z" /></svg>
      ),
      color: 'text-[#1877F2]',
      bg: 'bg-[#1877F2]/10 border-[#1877F2]/20 hover:border-[#1877F2]/40',
    },
  ]

  return (
    <MainLayout>
      <div className="bg-[#0D0F14] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-16 sm:py-24">

          <p className="text-xs font-semibold text-[#FFC107] uppercase tracking-widest mb-3">Contacto</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            ¿Cómo podemos ayudarte?
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            Escribinos por cualquiera de estos canales y te respondemos a la brevedad.
          </p>

          <div className="space-y-3">
            {ITEMS.map(item => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${item.bg}`}
              >
                <div className={`shrink-0 ${item.color}`}>{item.icon}</div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${item.color}`}>{item.value}</p>
                </div>
                <svg className="w-4 h-4 text-gray-600 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </a>
            ))}
          </div>

        </div>
      </div>
    </MainLayout>
  )
}
