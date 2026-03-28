-- ============================================================
-- FASE 1 — FUNCIONES DE INTELIGENCIA
-- Sistema de Ingeniería de Guiones V4.0
-- Ejecutar DESPUÉS de 01_schema.sql
-- ============================================================


-- ============================================================
-- FUNCIÓN 1: buscar_guiones_similares()
-- Encuentra los N guiones más parecidos semánticamente
-- filtrando por niche para que los referentes sean relevantes
-- ============================================================

create or replace function buscar_guiones_similares(
  p_vector        vector(1536),   -- embedding del texto a comparar
  p_niche         text,           -- niche para filtrar (obligatorio)
  p_limite        integer default 5,
  p_cliente_id    uuid    default null,     -- opcional: filtrar por cliente
  p_solo_exitosos boolean default true      -- si true, solo score_engagement > 0
)
returns table (
  id                  uuid,
  niche               text,
  sub_niche           text,
  plataforma          plataforma_enum,
  gancho_texto        text,
  estructura_narrativa estructura_narrativa_enum,
  trigger_emocional   trigger_emocional_enum,
  score_engagement    numeric(6,4),
  score_virabilidad   integer,
  score_cialdini      integer,
  resumen_patron      text,
  similitud           float
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
    g.embedding_vector <=> p_vector   -- menor distancia coseno = más similar
  limit p_limite;
$$;


-- ============================================================
-- FUNCIÓN 2: resumen_patrones()
-- Agrega los patrones ganadores de un niche para el generador
-- Retorna un JSON estructurado que se enviará a GPT-4o
-- como contexto al generar guiones nuevos
-- ============================================================

create or replace function resumen_patrones(
  p_niche         text,
  p_cliente_id    uuid    default null,
  p_top_n         integer default 20,       -- cuántos guiones top analizar
  p_min_engagement numeric default 0.1      -- filtro mínimo de engagement
)
returns json
language plpgsql stable
as $$
declare
  v_resultado json;
begin
  with top_guiones as (
    -- Seleccionar los mejores guiones del niche
    select *
    from guiones
    where
      niche = p_niche
      and procesado_ok = true
      and score_engagement >= p_min_engagement
      and (p_cliente_id is null or cliente_id = p_cliente_id)
    order by score_engagement desc
    limit p_top_n
  ),
  conteos as (
    select
      -- Storytelling patterns
      mode() within group (order by estructura_narrativa)  as estructura_dominante,
      mode() within group (order by gancho_tipo)           as gancho_dominante,
      mode() within group (order by cta_tipo)              as cta_dominante,
      mode() within group (order by pacing_ritmo)          as pacing_dominante,

      -- Psicología patterns
      mode() within group (order by trigger_emocional)     as trigger_dominante,
      mode() within group (order by sesgo_cognitivo)       as sesgo_dominante,
      avg(intensidad_emocional)                            as intensidad_promedio,

      -- Cialdini frecuencias
      round(avg(cialdini_reciprocidad::int) * 100)         as pct_reciprocidad,
      round(avg(cialdini_escasez::int) * 100)              as pct_escasez,
      round(avg(cialdini_autoridad::int) * 100)            as pct_autoridad,
      round(avg(cialdini_consistencia::int) * 100)         as pct_consistencia,
      round(avg(cialdini_prueba_social::int) * 100)        as pct_prueba_social,
      round(avg(cialdini_simpatia::int) * 100)             as pct_simpatia,
      round(avg(cialdini_unidad::int) * 100)               as pct_unidad,

      -- Neuropublicidad patterns
      mode() within group (order by atencion_visual)       as atencion_dominante,
      mode() within group (order by dolor_placer)          as dolor_placer_dominante,
      round(avg(lenguaje_sensorial::int) * 100)            as pct_lenguaje_sensorial,
      round(avg(contraste_narrativo::int) * 100)           as pct_contraste,
      round(avg(efecto_novedad::int) * 100)                as pct_novedad,

      -- Contenido patterns
      mode() within group (order by tono)                  as tono_dominante,
      mode() within group (order by persona_narradora)     as persona_dominante,
      mode() within group (order by nivel_especificidad)   as especificidad_dominante,

      -- Métricas generales
      avg(score_engagement)                                as engagement_promedio,
      avg(score_virabilidad)                               as virabilidad_promedio,
      avg(score_cialdini)                                  as cialdini_promedio,
      avg(duracion_segundos)                               as duracion_promedio,
      count(*)                                             as total_analizados

    from top_guiones
  )
  select json_build_object(
    'niche',              p_niche,
    'total_analizados',   c.total_analizados,
    'fecha_generado',     now(),
    'metricas_promedio', json_build_object(
      'engagement',       round(c.engagement_promedio::numeric, 4),
      'virabilidad',      round(c.virabilidad_promedio::numeric, 1),
      'cialdini_score',   round(c.cialdini_promedio::numeric, 1),
      'duracion_seg',     round(c.duracion_promedio::numeric, 0)
    ),
    'storytelling', json_build_object(
      'estructura_dominante',  c.estructura_dominante,
      'gancho_dominante',      c.gancho_dominante,
      'cta_dominante',         c.cta_dominante,
      'pacing_dominante',      c.pacing_dominante
    ),
    'psicologia', json_build_object(
      'trigger_dominante',     c.trigger_dominante,
      'sesgo_dominante',       c.sesgo_dominante,
      'intensidad_promedio',   round(c.intensidad_promedio::numeric, 1),
      'cialdini_frecuencias', json_build_object(
        'reciprocidad',   c.pct_reciprocidad,
        'escasez',        c.pct_escasez,
        'autoridad',      c.pct_autoridad,
        'consistencia',   c.pct_consistencia,
        'prueba_social',  c.pct_prueba_social,
        'simpatia',       c.pct_simpatia,
        'unidad',         c.pct_unidad
      )
    ),
    'neuropublicidad', json_build_object(
      'atencion_dominante',        c.atencion_dominante,
      'dolor_placer_dominante',    c.dolor_placer_dominante,
      'pct_lenguaje_sensorial',    c.pct_lenguaje_sensorial,
      'pct_contraste_narrativo',   c.pct_contraste,
      'pct_efecto_novedad',        c.pct_novedad
    ),
    'contenido', json_build_object(
      'tono_dominante',            c.tono_dominante,
      'persona_dominante',         c.persona_dominante,
      'especificidad_dominante',   c.especificidad_dominante
    )
  ) into v_resultado
  from conteos c;

  return v_resultado;
end;
$$;


-- ============================================================
-- FUNCIÓN 3: calcular_score_engagement()
-- Trigger para calcular automáticamente score_engagement
-- cuando se inserta o actualiza vistas/likes/compartidos
-- ============================================================

create or replace function calcular_score_engagement()
returns trigger
language plpgsql
as $$
begin
  if new.vistas is not null and new.vistas > 0 then
    new.score_engagement := round(
      ((coalesce(new.likes, 0) + coalesce(new.compartidos, 0) * 3)::numeric
       / new.vistas::numeric * 100)::numeric,
      4
    );
  else
    new.score_engagement := null;
  end if;
  return new;
end;
$$;

create trigger trg_calcular_engagement
  before insert or update of vistas, likes, compartidos
  on guiones
  for each row
  execute function calcular_score_engagement();


-- ============================================================
-- FUNCIÓN 4: guiones_por_niche()
-- Vista de resumen rápido para el dashboard
-- ============================================================

create or replace view vista_resumen_nichos as
select
  g.niche,
  g.cliente_id,
  c.nombre                          as cliente_nombre,
  count(*)                          as total_guiones,
  round(avg(g.score_engagement)::numeric, 4) as engagement_promedio,
  round(avg(g.score_virabilidad)::numeric, 1) as virabilidad_promedio,
  round(avg(g.score_cialdini)::numeric, 1)    as cialdini_promedio,
  max(g.score_engagement)           as mejor_engagement,
  max(g.fecha_analisis)             as ultimo_analisis
from guiones g
left join clientes c on c.id = g.cliente_id
where g.procesado_ok = true
group by g.niche, g.cliente_id, c.nombre
order by engagement_promedio desc nulls last;
