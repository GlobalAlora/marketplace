import type { Metadata } from 'next'
import { Exo_2 } from 'next/font/google'
import './globals.css'

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo2',
  weight: ['400', '500', '600', '700', '800'],
})

const BASE_URL = 'https://marketplace-sigma-teal.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'AUTODUX — Compra y venta de autos en Comodoro Rivadavia',
    template: '%s — AUTODUX',
  },
  description:
    'La plataforma de autos usados y 0km de Comodoro Rivadavia y la región patagónica. Encontrá tu próximo vehículo.',
  keywords: [
    'autos usados Comodoro Rivadavia',
    'venta de autos Patagonia',
    'compra autos Comodoro',
    'marketplace automotor',
    'autos 0km Comodoro Rivadavia',
    'camionetas Patagonia',
    'AUTODUX',
  ],
  authors: [{ name: 'AUTODUX' }],
  creator: 'AUTODUX',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: BASE_URL,
    siteName: 'AUTODUX',
    title: 'AUTODUX — Compra y venta de autos en Comodoro Rivadavia',
    description:
      'La plataforma de autos usados y 0km de Comodoro Rivadavia y la región patagónica.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'AUTODUX — Marketplace automotor Patagonia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AUTODUX — Compra y venta de autos en Comodoro Rivadavia',
    description:
      'La plataforma de autos usados y 0km de Comodoro Rivadavia y la región patagónica.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${exo2.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
