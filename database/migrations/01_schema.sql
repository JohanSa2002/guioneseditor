-- ============================================================
-- FASE 1 — SCHEMA PRINCIPAL
-- Sistema de Ingeniería de Guiones V4.0
-- Ejecutar en Supabase SQL Editor en este orden exacto
-- ============================================================

-- 1. EXTENSIÓN VECTORIAL
create extension if not exists vector;

-- ============================================================
-- 2. ENUMS (tipos controlados)
-- ============================================================

create type plataforma_enum as enum ('tiktok', 'reels', 'shorts');

create type estructura_narrativa_enum as enum (
  'AIDA', 'PAS', 'hero_journey', 'storybrand', 'antes_despues', 'otra'
);

create type gancho_tipo_enum as enum (
  'pregunta', 'declaracion_shock', 'dato_estadistica', 'historia', 'controversia', 'promesa_directa'
);

create type desarrollo_tipo_enum as enum (
  'problema_solucion', 'lista', 'demostracion', 'testimonio', 'tutorial', 'storytelling_puro'
);

create type cta_tipo_enum as enum (
  'seguir', 'comentar', 'compartir', 'comprar', 'visitar_link', 'guardar', 'ninguno'
);

create type pacing_enum as enum ('lento', 'medio', 'rapido', 'variable');

create type trigger_emocional_enum as enum (
  'miedo', 'esperanza', 'curiosidad', 'ira', 'orgullo', 'tristeza', 'sorpresa', 'humor'
);

create type atencion_visual_enum as enum (
  'zoom_agresivo', 'corte_rapido', 'texto_pantalla', 'cara_camara', 'broll_dinamico', 'ninguno'
);

create type dolor_placer_enum as enum ('apela_dolor', 'apela_placer', 'ambos');

create type carga_cognitiva_enum as enum ('baja', 'media', 'alta');

create type velocidad_locucion_enum as enum ('lenta', 'normal', 'rapida', 'muy_rapida');

create type tono_enum as enum (
  'educativo', 'entretenimiento', 'inspiracional', 'controversial', 'informativo', 'humoristico'
);

create type persona_narradora_enum as enum (
  'primera_persona', 'segunda_persona', 'tercera_persona', 'mixta'
);

create type nivel_especificidad_enum as enum ('generico', 'especifico', 'ultra_especifico');

create type idioma_enum as enum ('es', 'en', 'pt', 'fr', 'otro');

-- ============================================================
-- 3. TABLA CLIENTES
-- ============================================================

create table clientes (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null,
  industria       text not null,
  sub_industrias  text[],                    -- nichos específicos del cliente
  mercados        text[],                    -- países/regiones que atiende
  activo          boolean default true,
  notas           text,
  fecha_alta      timestamp with time zone default now()
);

-- ============================================================
-- 4. TABLA PRINCIPAL: GUIONES
-- ============================================================

create table guiones (

  -- ── BLOQUE 0: Identificadores ──────────────────────────────
  id                      uuid primary key default gen_random_uuid(),
  cliente_id              uuid references clientes(id) on delete set null,

  -- ── BLOQUE 1: Organización de Agencia ─────────────────────
  niche                   text not null,
  sub_niche               text,
  mercado_objetivo        text,
  idioma                  idioma_enum default 'es',
  proyecto_nombre         text,
  competidor_referente    boolean default false,       -- video analizado de la competencia

  -- ── BLOQUE 2: Metadata del Video ──────────────────────────
  url_origen              text,
  plataforma              plataforma_enum,
  duracion_segundos       integer,
  vistas                  bigint,
  likes                   bigint,
  compartidos             bigint,
  fecha_publicacion       date,

  -- ── BLOQUE 3: Storytelling ─────────────────────────────────
  estructura_narrativa    estructura_narrativa_enum,
  gancho_tipo             gancho_tipo_enum,
  gancho_texto            text,                       -- primeras 3-7 palabras del video
  gancho_duracion_seg     integer,
  desarrollo_tipo         desarrollo_tipo_enum,
  cta_tipo                cta_tipo_enum,
  cta_texto               text,
  arco_emocional          text,                       -- ej: "curiosidad → sorpresa → alivio"
  conflicto_central       text,
  resolucion              text,
  pacing_ritmo            pacing_enum,
  numero_actos            integer check (numero_actos between 1 and 4),

  -- ── BLOQUE 4: Psicología / Cialdini ───────────────────────
  cialdini_reciprocidad   boolean default false,
  cialdini_escasez        boolean default false,
  cialdini_autoridad      boolean default false,
  cialdini_consistencia   boolean default false,
  cialdini_prueba_social  boolean default false,
  cialdini_simpatia       boolean default false,
  cialdini_unidad         boolean default false,
  sesgo_cognitivo         text,                       -- ej: "FOMO", "Efecto halo", "Anclaje"
  trigger_emocional       trigger_emocional_enum,
  intensidad_emocional    integer check (intensidad_emocional between 1 and 10),

  -- ── BLOQUE 5: Neuropublicidad ──────────────────────────────
  atencion_visual         atencion_visual_enum,
  lenguaje_sensorial      boolean default false,
  contraste_narrativo     boolean default false,      -- antes/después, ellos/nosotros
  efecto_novedad          boolean default false,      -- algo inesperado en primeros 3s
  dolor_placer            dolor_placer_enum,
  personalizacion         boolean default false,      -- habla directamente al "tú"
  carga_cognitiva         carga_cognitiva_enum,
  velocidad_locucion      velocidad_locucion_enum,
  uso_musica              boolean default false,
  micro_compromisos       boolean default false,      -- pequeño compromiso antes del CTA

  -- ── BLOQUE 6: Análisis de Contenido ───────────────────────
  tema_principal          text,
  angulo_unico            text,
  palabras_clave          text[],
  transcript              text,
  tono                    tono_enum,
  persona_narradora       persona_narradora_enum,
  promesa_explicita       text,
  nivel_especificidad     nivel_especificidad_enum,

  -- ── BLOQUE 7: Métricas Calculadas ─────────────────────────
  score_engagement        numeric(6,4),               -- (likes + compartidos*3) / vistas * 100
  score_virabilidad       integer check (score_virabilidad between 1 and 100),
  score_cialdini          integer generated always as (
                            (cialdini_reciprocidad::int + cialdini_escasez::int +
                             cialdini_autoridad::int + cialdini_consistencia::int +
                             cialdini_prueba_social::int + cialdini_simpatia::int +
                             cialdini_unidad::int)
                          ) stored,
  resumen_patron          text,                       -- párrafo generado por GPT-4o
  embedding_vector        vector(1536),               -- text-embedding-3-small

  -- ── BLOQUE 8: Auditoría del Sistema ───────────────────────
  fecha_analisis          timestamp with time zone default now(),
  version_prompt          text default 'v1.0',        -- versión del prompt que generó el análisis
  procesado_ok            boolean default false,      -- false si hubo error en el pipeline
  error_detalle           text                        -- log del error si procesado_ok = false

);

-- ============================================================
-- 5. ÍNDICES DE RENDIMIENTO
-- ============================================================

-- Búsqueda rápida por niche (el más frecuente en queries de agencia)
create index idx_guiones_niche on guiones(niche);

-- Búsqueda por cliente
create index idx_guiones_cliente on guiones(cliente_id);

-- Filtro por plataforma y engagement para rankings
create index idx_guiones_engagement on guiones(score_engagement desc nulls last);

-- Índice HNSW para búsqueda vectorial semántica (el más rápido para pgvector)
create index idx_guiones_vector on guiones
  using hnsw (embedding_vector vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- Índice compuesto niche + engagement para resumen_patrones()
create index idx_guiones_niche_engagement on guiones(niche, score_engagement desc nulls last);
