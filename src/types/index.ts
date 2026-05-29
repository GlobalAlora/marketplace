export type Role = 'particular' | 'agencia_basica' | 'agencia_premium' | 'admin'

export type Profile = {
  id: string
  email: string
  nombre: string
  apellido: string
  telefono: string
  role: Role
  avatar_url?: string
  nombre_agencia?: string
  logo_agencia?: string
  verificado: boolean
  activo: boolean
  created_at: string
}

export type Vehiculo = {
  id: string
  user_id: string
  titulo: string
  marca: string
  modelo: string
  año: number
  kilometraje: number
  precio: number
  descripcion: string
  ubicacion: string
  imagenes: string[]
  activo: boolean
  destacado: boolean
  vendido: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
  // Campos técnicos opcionales
  transmision?: 'manual' | 'automatica'
  combustible?: 'nafta' | 'diesel' | 'gnc' | 'hibrido' | 'electrico'
  puertas?: number
  color?: string
  // Trust signal (mock: campo estático; prod: RPC increment en Supabase)
  vistas?: number
}

export type MetricaVehiculo = {
  id: string
  vehiculo_id: string
  tipo: 'view' | 'whatsapp_click'
  created_at: string
}

export type Banner = {
  id: string
  imagen_url: string
  link_url: string
  activo: boolean
  posicion: string
  created_at: string
}
