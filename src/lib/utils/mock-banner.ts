// TODO: conectar a tabla banners en Supabase
// Cuando el backend esté listo, reemplazar MOCK_BANNERS con fetch a tabla `banners`
// filtrado por posicion y activo === true. Cada posicion devuelve 1 banner activo.

export type BannerPosicion =
  | 'sidebar'          // izquierdo vertical — 260x400px
  | 'horizontal_top'   // debajo de destacados — 100% ancho x 90px
  | 'horizontal_mid'   // entre secciones de contenido — 100% ancho x 90px
  | 'mobile_top'       // mobile only, debajo del hero — 100% ancho x 60px
  | 'mobile_popup'     // mobile only, barra fija inferior — dismissable
  // TODO: 'sidebar_right' — banners verticales lado derecho (desktop), planificados

export interface Banner {
  imagen_url: string
  link_url: string
  activo: boolean
  posicion: BannerPosicion
}

export const MOCK_BANNERS: Record<BannerPosicion, Banner> = {
  sidebar: {
    imagen_url:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=260&h=400&fit=crop&q=80',
    link_url: '#',
    activo: true,
    posicion: 'sidebar',
  },
  horizontal_top: {
    imagen_url:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=90&fit=crop&q=80',
    link_url: '#',
    activo: true,
    posicion: 'horizontal_top',
  },
  horizontal_mid: {
    imagen_url:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&h=90&fit=crop&q=80',
    link_url: '#',
    activo: true,
    posicion: 'horizontal_mid',
  },
  mobile_top: {
    imagen_url:
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=60&fit=crop&q=80',
    link_url: '#',
    activo: true,
    posicion: 'mobile_top',
  },
  mobile_popup: {
    imagen_url:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&h=100&fit=crop&q=80',
    link_url: '#',
    activo: true,
    posicion: 'mobile_popup',
  },
}

// Retrocompatibilidad con importaciones existentes que usan MOCK_BANNER (singular)
export const MOCK_BANNER: Banner = MOCK_BANNERS.sidebar
