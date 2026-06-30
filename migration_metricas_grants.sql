-- Otorgar permisos base sobre metricas_vehiculos a los roles de Supabase
grant select on metricas_vehiculos to anon;
grant select, insert on metricas_vehiculos to authenticated;
grant all on metricas_vehiculos to service_role;
