import Header from './Header'
import Footer from './Footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  )
}
