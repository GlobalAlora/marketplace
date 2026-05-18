import MainLayout from '@/components/layout/MainLayout'

export default function Home() {
  return (
    <MainLayout>
      <div className="bg-surface flex items-center justify-center py-24 px-4 min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-900 text-center">
          Bienvenido a Marketplace Comodoro
        </h1>
      </div>
    </MainLayout>
  )
}
