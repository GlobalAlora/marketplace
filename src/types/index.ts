export type Role = 'particular' | 'agencia_basica' | 'agencia_premium' | 'admin'

export type TipoVehiculo = 'auto' | 'pickup' | 'suv' | 'utilitario' | 'moto' | 'monovolumen'

export type TipoMoto = 'calle' | 'enduro' | 'cross' | 'naked' | 'scooter' | 'touring'

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
  bio?: string
  slug?: string
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
  // ADMIN ONLY: solo un usuario con role === 'admin' puede cambiar este campo.
  // No exponer en formularios de particulares ni agencias.
  destacado: boolean
  vendido: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
  // Campos técnicos opcionales
  condicion?: 'nuevo' | 'usado'
  transmision?: 'manual' | 'automatica'
  combustible?: 'nafta' | 'diesel' | 'gnc' | 'hibrido' | 'electrico'
  puertas?: number
  color?: string
  tipo_vehiculo?: TipoVehiculo
  cilindrada?: number
  tipo_moto?: TipoMoto
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
