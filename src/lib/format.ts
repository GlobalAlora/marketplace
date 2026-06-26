export function formatPrecio(precio: number, moneda?: string): string {
  if (moneda === 'USD') {
    return `US$ ${new Intl.NumberFormat('es-AR').format(precio)}`
  }
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(precio)
}
