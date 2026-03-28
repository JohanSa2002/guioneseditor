-- ============================================================
-- FASE 1 — ROW LEVEL SECURITY (RLS)
-- Sistema de Ingeniería de Guiones V4.0
-- Ejecutar DESPUÉS de 01_schema.sql y 02_funciones.sql
-- ============================================================
-- IMPORTANTE: En Supabase, las políticas RLS controlan qué
-- filas puede ver/editar cada usuario autenticado.
-- El usuario autenticado se obtiene con auth.uid().
-- ============================================================


-- ── Habilitar RLS en ambas tablas ─────────────────────────
alter table clientes enable row level security;
alter table guiones  enable row level security;


-- ============================================================
-- TABLA: clientes
-- ============================================================

-- Los usuarios autenticados pueden ver todos los clientes.
-- Si en el futuro cada usuario es de una agencia específica,
-- se puede agregar un campo agencia_id y filtrar aquí.
create policy "clientes_select"
  on clientes for select
  to authenticated
  using (true);

create policy "clientes_insert"
  on clientes for insert
  to authenticated
  with check (true);

create policy "clientes_update"
  on clientes for update
  to authenticated
  using (true);

-- Solo usuarios con rol 'admin' pueden eliminar clientes
create policy "clientes_delete"
  on clientes for delete
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');


-- ============================================================
-- TABLA: guiones
-- ============================================================

-- Cualquier usuario autenticado puede leer guiones
create policy "guiones_select"
  on guiones for select
  to authenticated
  using (true);

-- Cualquier usuario autenticado puede insertar guiones
create policy "guiones_insert"
  on guiones for insert
  to authenticated
  with check (true);

-- Actualización permitida para todos los autenticados
create policy "guiones_update"
  on guiones for update
  to authenticated
  using (true);

-- Solo admin puede eliminar guiones
create policy "guiones_delete"
  on guiones for delete
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');


-- ============================================================
-- ACCESO DE SERVICIO (Service Role)
-- El backend de Vercel usa la SERVICE_ROLE key de Supabase
-- que bypasea RLS automáticamente — no necesita políticas.
-- NUNCA exponer la SERVICE_ROLE key en el frontend.
-- ============================================================
