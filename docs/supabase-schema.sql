-- ============================================================
-- AUTODUX Marketplace — Supabase Schema
-- Versión: 1.0.0
-- Descripción: Schema completo para el marketplace automotor
--              de Comodoro Rivadavia y la región patagónica.
--
-- Instrucciones:
--   1. Ejecutar en el SQL Editor de Supabase (Dashboard > SQL Editor)
--   2. Ejecutar en orden: tipos → tablas → RLS → triggers → storage
--   3. Crear bucket de storage manualmente si no usa el bloque final
-- ============================================================

-- ============================================================
-- EXTENSIONES
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- TIPOS / ENUMS
-- ============================================================
create type public.role_type as enum (
  'particular',
  'agencia_basica',
  'agencia_premium',
  'admin'
);

create type public.combustible_type as enum (
  'nafta',
  'diesel',
  'gnc',
  'hibrido',
  'electrico'
);

create type public.transmision_type as enum (
  'manual',
  'automatica'
);

create type public.condicion_type as enum (
  'usado',
  '0km'
);

create type public.metrica_tipo as enum (
  'view',
  'whatsapp_click'
);

-- ============================================================
-- TABLA: profiles
-- Extiende auth.users de Supabase con datos del vendedor.
-- Se crea automáticamente via trigger al registrarse.
-- ============================================================
create table public.profiles (
  id             uuid references auth.users(id) on delete cascade primary key,
  email          text not null,
  nombre         text not null default '',
  apellido       text not null default '',
  telefono       text,
  role           public.role_type not null default 'particular',
  -- Campos de agencia (solo aplican cuando role IN ('agencia_basica', 'agencia_premium'))
  nombre_agencia      text,
  logo_agencia        text,           -- URL en storage
  descripcion_agencia text,
  -- Estado
  verificado     boolean not null default false,
  activo         boolean not null default true,
  created_at     timestamptz not null default now()
);

comment on table public.profiles is 'Perfil público de cada usuario/agencia del marketplace.';
comment on column public.profiles.verificado is 'True cuando un admin verificó la identidad del vendedor.';

-- ============================================================
-- TABLA: vehiculos
-- ============================================================
create table public.vehiculos (
  id             uuid default uuid_generate_v4() primary key,
  user_id        uuid references public.profiles(id) on delete cascade not null,
  -- Datos básicos
  titulo         text not null,
  marca          text not null,
  modelo         text not null,
  año            integer not null check (año >= 1950 and año <= extract(year from now()) + 1),
  kilometraje    integer not null check (kilometraje >= 0),
  precio         numeric(14, 2) not null check (precio > 0),
  descripcion    text,
  ubicacion      text not null default 'Comodoro Rivadavia',
  imagenes       text[] not null default '{}',
  -- Datos técnicos opcionales
  transmision    public.transmision_type,
  combustible    public.combustible_type,
  puertas        integer check (puertas in (2, 3, 4, 5)),
  color          text,
  condicion      public.condicion_type not null default 'usado',
  -- Estado del listado
  activo         boolean not null default true,
  destacado      boolean not null default false,
  vendido        boolean not null default false,
  -- Timestamps
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.vehiculos is 'Listados de vehículos publicados en el marketplace.';
comment on column public.vehiculos.imagenes is 'Array de URLs de imágenes en el storage bucket vehiculos-imagenes.';
comment on column public.vehiculos.destacado is 'True cuando el vendedor pagó por destacar el listado.';

-- Índices para consultas frecuentes
create index idx_vehiculos_user_id    on public.vehiculos(user_id);
create index idx_vehiculos_marca      on public.vehiculos(marca);
create index idx_vehiculos_precio     on public.vehiculos(precio);
create index idx_vehiculos_activo     on public.vehiculos(activo) where activo = true;
create index idx_vehiculos_created_at on public.vehiculos(created_at desc);

-- Trigger para updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger vehiculos_updated_at
  before update on public.vehiculos
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- TABLA: metricas_vehiculos
-- Registra eventos de vistas y clicks de WhatsApp por vehículo.
-- ============================================================
create table public.metricas_vehiculos (
  id           uuid default uuid_generate_v4() primary key,
  vehiculo_id  uuid references public.vehiculos(id) on delete cascade not null,
  tipo         public.metrica_tipo not null,
  created_at   timestamptz not null default now()
);

comment on table public.metricas_vehiculos is 'Eventos de analítica por vehículo (vistas y clicks de WhatsApp).';

create index idx_metricas_vehiculo_id on public.metricas_vehiculos(vehiculo_id);
create index idx_metricas_tipo        on public.metricas_vehiculos(tipo);

-- ============================================================
-- TABLA: banners
-- Banners publicitarios gestionados por admins.
-- ============================================================
create table public.banners (
  id          uuid default uuid_generate_v4() primary key,
  imagen_url  text not null,
  link_url    text not null,
  activo      boolean not null default true,
  posicion    text not null,   -- e.g. 'home_top', 'vehiculos_sidebar'
  created_at  timestamptz not null default now()
);

comment on table public.banners is 'Banners publicitarios configurados por administradores.';

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles         enable row level security;
alter table public.vehiculos         enable row level security;
alter table public.metricas_vehiculos enable row level security;
alter table public.banners           enable row level security;

-- ----- profiles -----

-- Cualquiera puede ver perfiles públicos (para fichas de vendedor)
create policy "profiles_select_public"
  on public.profiles for select
  using (activo = true);

-- El propio usuario puede ver su perfil aunque esté inactivo
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- El propio usuario puede actualizar su perfil
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Solo admins pueden insertar perfiles manualmente (el trigger lo hace automáticamente)
create policy "profiles_insert_admin"
  on public.profiles for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ----- vehiculos -----

-- Lectura pública de vehículos activos
create policy "vehiculos_select_public"
  on public.vehiculos for select
  using (activo = true);

-- El dueño puede ver todos sus vehículos (incluso inactivos)
create policy "vehiculos_select_own"
  on public.vehiculos for select
  using (auth.uid() = user_id);

-- El dueño puede publicar vehículos
create policy "vehiculos_insert_own"
  on public.vehiculos for insert
  with check (auth.uid() = user_id);

-- El dueño puede editar sus vehículos
create policy "vehiculos_update_own"
  on public.vehiculos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- El dueño puede eliminar sus vehículos
create policy "vehiculos_delete_own"
  on public.vehiculos for delete
  using (auth.uid() = user_id);

-- ----- metricas_vehiculos -----

-- Inserción anónima permitida (se llama desde el cliente sin auth para contar vistas)
create policy "metricas_insert_anon"
  on public.metricas_vehiculos for insert
  with check (true);

-- Solo el dueño del vehículo puede leer sus métricas
create policy "metricas_select_owner"
  on public.metricas_vehiculos for select
  using (
    exists (
      select 1 from public.vehiculos v
      where v.id = vehiculo_id and v.user_id = auth.uid()
    )
  );

-- ----- banners -----

-- Lectura pública de banners activos
create policy "banners_select_public"
  on public.banners for select
  using (activo = true);

-- Solo admins pueden gestionar banners
create policy "banners_manage_admin"
  on public.banners for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- TRIGGER: auto-crear profile al registrarse
-- Se ejecuta cuando Supabase Auth crea un nuevo usuario.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, nombre, apellido)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', ''),
    coalesce(new.raw_user_meta_data->>'apellido', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORAGE: bucket para imágenes de vehículos
-- Ejecutar después de crear el bucket "vehiculos-imagenes" en
-- Supabase Dashboard > Storage > New Bucket
--   - Name: vehiculos-imagenes
--   - Public: true
-- ============================================================

-- Política: cualquiera puede ver imágenes (bucket público)
-- (configurar en Dashboard > Storage > Policies)

-- Política: solo el dueño puede subir imágenes a su carpeta
-- La carpeta debe seguir el patrón: {user_id}/{vehiculo_id}/
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehiculos-imagenes',
  'vehiculos-imagenes',
  true,
  5242880,  -- 5 MB por archivo
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

create policy "storage_vehiculos_select_public"
  on storage.objects for select
  using (bucket_id = 'vehiculos-imagenes');

create policy "storage_vehiculos_insert_owner"
  on storage.objects for insert
  with check (
    bucket_id = 'vehiculos-imagenes'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_vehiculos_update_owner"
  on storage.objects for update
  using (
    bucket_id = 'vehiculos-imagenes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_vehiculos_delete_owner"
  on storage.objects for delete
  using (
    bucket_id = 'vehiculos-imagenes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- FIN DEL SCHEMA
-- Próximos pasos:
--   1. Ejecutar este SQL en Supabase Dashboard > SQL Editor
--   2. Configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local
--   3. Generar types con: npx supabase gen types typescript --project-id <id> > src/types/supabase.ts
--   4. Reemplazar MOCK_VEHICULOS por queries reales en los componentes
-- ============================================================
