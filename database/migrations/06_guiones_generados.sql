-- ============================================================
-- MIGRACIÓN 06 — Tabla de Guiones Generados
-- Almacena los guiones creados por el generador IA
-- Ejecutar en Supabase SQL Editor después de la migración 05
-- ============================================================

create type objetivo_guion_enum as enum (
  'awareness', 'engagement', 'conversion', 'educacion', 'entretenimiento'
);

create table guiones_generados (

  -- Identificadores
  id                    uuid primary key default gen_random_uuid(),
  cliente_id            uuid references clientes(id) on delete set null,

  -- Parámetros de entrada
  niche                 text not null,
  tema                  text not null,
  audiencia             text not null,
  plataforma            plataforma_enum not null,
  duracion_objetivo     integer,                    -- segundos objetivo
  tono                  tono_enum,
  objetivo              objetivo_guion_enum,
  estructura_usada      estructura_narrativa_enum,
  instrucciones_extra   text,

  -- Referencias usadas para generar
  referencias_ids       uuid[],                     -- IDs de guiones analizados usados como base
  num_referencias       integer generated always as (
    coalesce(array_length(referencias_ids, 1), 0)
  ) stored,

  -- Contenido generado
  titulo_sugerido       text,
  gancho                text not null,
  desarrollo            text not null,
  cta                   text,
  guion_completo        text not null,
  variantes_gancho      text[],
  tecnicas_aplicadas    text[],
  notas_produccion      text,
  duracion_estimada_seg integer,
  score_estimado        integer check (score_estimado between 1 and 100),

  -- Auditoría
  fecha_generacion      timestamp with time zone default now(),
  version_prompt        text default 'v1.0',
  aprobado             boolean default false,       -- marcado manualmente cuando el guion se usa
  notas_usuario        text                         -- feedback del usuario sobre el guion

);

-- Índices
create index idx_gg_niche        on guiones_generados(niche);
create index idx_gg_cliente      on guiones_generados(cliente_id);
create index idx_gg_fecha        on guiones_generados(fecha_generacion desc);
create index idx_gg_aprobado     on guiones_generados(aprobado) where aprobado = true;

comment on table guiones_generados is 'Guiones creados por el generador IA a partir de patrones analizados';
comment on column guiones_generados.referencias_ids is 'IDs de guiones analizados que se usaron como patrones de referencia';
comment on column guiones_generados.aprobado is 'True cuando el usuario marca el guion como usado/aprobado';
