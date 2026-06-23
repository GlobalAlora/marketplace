export const MARCAS = [
  'BMW', 'Chevrolet', 'Citroën', 'Fiat', 'Ford', 'Honda', 'Hyundai',
  'Isuzu', 'Jeep', 'Kia', 'Mercedes-Benz', 'Mitsubishi', 'Nissan',
  'Peugeot', 'Renault', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen',
]

export const TIPOS_VEHICULO = [
  { value: 'auto',        label: 'Auto' },
  { value: 'pickup',      label: 'Pickup' },
  { value: 'suv',         label: 'SUV' },
  { value: 'utilitario',  label: 'Utilitario' },
  { value: 'moto',        label: 'Moto' },
  { value: 'monovolumen', label: 'Monovolumen' },
] as const

export const TIPOS_MOTO = [
  { value: 'calle',   label: 'Calle' },
  { value: 'enduro',  label: 'Enduro' },
  { value: 'cross',   label: 'Cross' },
  { value: 'naked',   label: 'Naked' },
  { value: 'scooter', label: 'Scooter' },
  { value: 'touring', label: 'Touring' },
] as const
