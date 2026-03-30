-- ============================================================
-- MIGRACIÓN 05 — Análisis Extendido
-- Nuevos campos de retención, copywriting y replicabilidad
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ── Nuevos ENUMS ─────────────────────────────────────────────

create type tecnica_retencion_enum as enum (
  'open_loop', 'cliffhanger', 'curiosity_gap', 'countdown', 'pregunta_abierta', 'ninguna'
);

create type ratio_emocion_enum as enum ('emocional', 'logico', 'equilibrado');

create type nivel_consciencia_enum as enum (
  'inconsciente', 'problema_consciente', 'solucion_consciente',
  'producto_consciente', 'mas_consciente'
);

create type replicabilidad_enum as enum ('alta', 'media', 'baja');

-- ── Bloque Storytelling Extendido ────────────────────────────

alter table guiones
  add column if not exists apertura_exacta    text,
  add column if not exists cierre_exacto      text,
  add column if not exists tecnica_retencion  tecnica_retencion_enum,
  add column if not exists momento_pico_seg   integer check (momento_pico_seg >= 0);

-- ── Bloque Neuropublicidad Extendido ─────────────────────────

alter table guiones
  add column if not exists ratio_emocion_logica ratio_emocion_enum;

-- ── Bloque Copywriting / Avatar ──────────────────────────────

alter table guiones
  add column if not exists nivel_consciencia  nivel_consciencia_enum,
  add column if not exists objecion_principal text,
  add column if not exists avatar_descripcion text,
  add column if not exists ingredientes_clave text[],
  add column if not exists replicabilidad     replicabilidad_enum;

-- ── Índices útiles para la generación de guiones ─────────────

-- Filtrar rápido por replicabilidad alta (para el generador)
create index if not exists idx_guiones_replicabilidad
  on guiones(replicabilidad)
  where procesado_ok = true;

-- Filtrar por nivel de consciencia (segmentación de copywriting)
create index if not exists idx_guiones_nivel_consciencia
  on guiones(nivel_consciencia)
  where procesado_ok = true;

-- ── Comentarios de columna ────────────────────────────────────

comment on column guiones.apertura_exacta    is 'Primeras ~15 palabras exactas del video según la transcripción';
comment on column guiones.cierre_exacto      is 'Últimas ~10 palabras exactas del video según la transcripción';
comment on column guiones.tecnica_retencion  is 'Técnica principal que hace al espectador quedarse hasta el final';
comment on column guiones.momento_pico_seg   is 'Segundo estimado del mayor pico emocional o de tensión del video';
comment on column guiones.ratio_emocion_logica is 'Balance entre apelaciones emocionales y argumentos lógicos';
comment on column guiones.nivel_consciencia  is 'Nivel de consciencia del avatar según escala Eugene Schwartz';
comment on column guiones.objecion_principal is 'Objeción del espectador que el video anticipa o desmonta';
comment on column guiones.avatar_descripcion is 'Perfil de la persona a quien está dirigido el video';
comment on column guiones.ingredientes_clave is 'Elementos que no pueden faltar al replicar este guion';
comment on column guiones.replicabilidad     is 'Qué tan fácil es replicar este patrón en otro contexto';
