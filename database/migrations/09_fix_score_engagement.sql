-- ============================================================
-- MIGRACIÓN 09 — Fix numeric overflow en score_engagement
-- Ejecutar en Supabase SQL Editor después de la migración 08
-- ============================================================
-- PROBLEMA: numeric(6,4) solo permite hasta 99.9999.
-- Si likes > vistas (videos virales), la fórmula
-- (likes + compartidos*3) / vistas * 100 puede superar 100
-- y Postgres lanza "numeric field overflow".
-- SOLUCIÓN: ampliar a numeric(10,4) → soporta hasta 999999.9999
--
-- Hay que dropear la vista y la función que dependen del tipo
-- antes de alterar la columna, y recrearlas después.
-- ============================================================

-- 1. Dropear dependencias
drop view if exists vista_resumen_nichos;
drop function if exists buscar_guiones_similares(vector(1536), text, integer, uuid, boolean);

-- 2. Alterar la columna
alter table guiones
  alter column score_engagement type numeric(10,4);

-- 3. Recrear función buscar_guiones_similares con el nuevo tipo
create or replace function buscar_guiones_similares(
  p_vector        vector(1536),
  p_niche         text,
  p_limite        integer default 5,
  p_cliente_id    uuid    default null,
  p_solo_exitosos boolean default true
)
returns table (
  id                   uuid,
  niche                text,
  sub_niche            text,
  plataforma           plataforma_enum,
  gancho_texto         text,
  estructura_narrativa estructura_narrativa_enum,
  trigger_emocional    trigger_emocional_enum,
  score_engagement     numeric(10,4),
  score_virabilidad    integer,
  score_cialdini       integer,
  resumen_patron       text,
  similitud            float
)
language sql stable
as $$
  select
    g.id,
    g.niche,
    g.sub_niche,
    g.plataforma,
    g.gancho_texto,
    g.estructura_narrativa,
    g.trigger_emocional,
    g.score_engagement,
    g.score_virabilidad,
    g.score_cialdini,
    g.resumen_patron,
    1 - (g.embedding_vector <=> p_vector) as similitud
  from guiones g
  where
    g.procesado_ok = true
    and g.embedding_vector is not null
    and g.niche = p_niche
    and (p_cliente_id is null or g.cliente_id = p_cliente_id)
    and (not p_solo_exitosos or (g.score_engagement is not null and g.score_engagement > 0))
  order by
    g.embedding_vector <=> p_vector
  limit p_limite;
$$;

-- 4. Recrear vista vista_resumen_nichos
create or replace view vista_resumen_nichos as
select
  g.niche,
  g.cliente_id,
  c.nombre                                      as cliente_nombre,
  count(*)                                      as total_guiones,
  round(avg(g.score_engagement)::numeric, 4)    as engagement_promedio,
  round(avg(g.score_virabilidad)::numeric, 1)   as virabilidad_promedio,
  round(avg(g.score_cialdini)::numeric, 1)      as cialdini_promedio,
  max(g.score_engagement)                       as mejor_engagement,
  max(g.fecha_analisis)                         as ultimo_analisis
from guiones g
left join clientes c on c.id = g.cliente_id
where g.procesado_ok = true
group by g.niche, g.cliente_id, c.nombre
order by engagement_promedio desc nulls last;
