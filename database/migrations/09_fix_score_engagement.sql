-- ============================================================
-- MIGRACIÓN 09 — Fix numeric overflow en score_engagement
-- Ejecutar en Supabase SQL Editor después de la migración 08
-- ============================================================
-- PROBLEMA: numeric(6,4) solo permite hasta 99.9999.
-- Si likes > vistas (videos virales), la fórmula
-- (likes + compartidos*3) / vistas * 100 puede superar 100
-- y Postgres lanza "numeric field overflow".
-- SOLUCIÓN: ampliar a numeric(10,4) → soporta hasta 999999.9999
-- ============================================================

alter table guiones
  alter column score_engagement type numeric(10,4);
