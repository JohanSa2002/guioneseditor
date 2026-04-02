-- ============================================================
-- MIGRACIÓN 08 — Conclusión Estratégica
-- Ejecutar en Supabase SQL Editor después de la migración 07
-- ============================================================

alter table guiones
  add column if not exists conclusion_estrategica text;

comment on column guiones.conclusion_estrategica is 'Síntesis estratégica generada por GPT-4o que integra todos los datos del análisis (narrativa, Cialdini, neuromarketing, copywriting, métricas) en un veredicto accionable sobre por qué funciona el video y cómo replicarlo';
