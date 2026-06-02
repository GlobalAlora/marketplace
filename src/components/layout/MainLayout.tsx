import Header from './Header'
import Footer from './Footer'
import { MockAuthProvider } from '@/lib/mock-auth'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <MockAuthProvider>
      <Header />
      <main className="min-h-screen bg-[#0D0F14]">{children}</main>
      <Footer />
    </MockAuthProvider>
  )
}
