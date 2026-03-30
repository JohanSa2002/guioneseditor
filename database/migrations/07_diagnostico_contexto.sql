-- ============================================================
-- MIGRACIÓN 07 — Contexto, Diagnóstico y Hashtags
-- Ejecutar en Supabase SQL Editor después de la migración 06
-- ============================================================

alter table guiones
  add column if not exists contexto_video     text,
  add column if not exists fortalezas         text[],
  add column if not exists debilidades        text[],
  add column if not exists sugerencias_mejora text[],
  add column if not exists hashtags_sugeridos text[];

comment on column guiones.contexto_video     is 'Contexto o idea del video ingresado por el usuario antes del análisis';
comment on column guiones.fortalezas         is 'Lo que el video hace especialmente bien (generado por GPT-4o)';
comment on column guiones.debilidades        is 'Áreas de mejora detectadas por GPT-4o';
comment on column guiones.sugerencias_mejora is 'Sugerencias accionables para mejorar el video';
comment on column guiones.hashtags_sugeridos is 'Hashtags sugeridos por GPT-4o para maximizar alcance';
