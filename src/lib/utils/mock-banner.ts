// TODO: conectar a tabla banners en Supabase
// Cuando el backend esté listo, reemplazar con fetch a tabla `banners`
// filtrado por posicion === 'sidebar' y activo === true

export interface Banner {
  imagen_url: string
  link_url: string
  activo: boolean
  posicion: 'sidebar' | 'header' | 'footer'
}

export const MOCK_BANNER: Banner = {
  imagen_url:
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=260&h=400&fit=crop&q=80',
  link_url: '#',
  activo: true,
  posicion: 'sidebar',
}
