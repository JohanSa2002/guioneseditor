-- ============================================================
-- FASE 1 — DATOS DE PRUEBA
-- Sistema de Ingeniería de Guiones V4.0
-- Ejecutar ÚLTIMO para validar que el schema funciona
-- ============================================================

-- 1. Insertar clientes de ejemplo
insert into clientes (nombre, industria, sub_industrias, mercados) values
  ('Agencia Demo',  'Marketing Digital', array['redes sociales', 'contenido'], array['MX', 'CO', 'AR']),
  ('Cliente Fitness', 'Salud y Bienestar', array['fitness', 'nutricion'], array['MX', 'US']),
  ('Cliente Finanzas', 'Finanzas Personales', array['inversion', 'ahorro', 'cripto'], array['MX', 'CO']);

-- 2. Insertar guion de ejemplo para validar el schema completo
-- (el embedding_vector se llenará cuando el backend procese videos reales)
insert into guiones (
  niche, sub_niche, mercado_objetivo, idioma, proyecto_nombre,
  plataforma, duracion_segundos,
  vistas, likes, compartidos, fecha_publicacion,
  estructura_narrativa, gancho_tipo, gancho_texto, gancho_duracion_seg,
  desarrollo_tipo, cta_tipo, cta_texto,
  arco_emocional, conflicto_central, resolucion,
  pacing_ritmo, numero_actos,
  cialdini_reciprocidad, cialdini_escasez, cialdini_autoridad,
  cialdini_consistencia, cialdini_prueba_social, cialdini_simpatia,
  cialdini_unidad,
  sesgo_cognitivo, trigger_emocional, intensidad_emocional,
  atencion_visual, lenguaje_sensorial, contraste_narrativo,
  efecto_novedad, dolor_placer, personalizacion, carga_cognitiva,
  velocidad_locucion, uso_musica, micro_compromisos,
  tema_principal, angulo_unico, palabras_clave,
  transcript, tono, persona_narradora, promesa_explicita,
  nivel_especificidad, score_virabilidad, resumen_patron,
  procesado_ok, version_prompt
) values (
  'fitness', 'pérdida de peso', 'MX', 'es', 'Campaña Verano 2025',
  'reels', 45,
  850000, 62000, 18000, '2025-01-15',
  'PAS', 'pregunta', '¿Por qué no bajas de peso aunque...', 4,
  'problema_solucion', 'seguir', 'Sígueme para más tips',
  'frustración → esperanza → motivación',
  'La persona hace todo bien pero no ve resultados',
  'El problema es el cortisol, no las calorías',
  'rapido', 3,
  true, false, true,
  false, true, true,
  false,
  'Sesgo de confirmación', 'curiosidad', 8,
  'cara_camara', true, true,
  true, 'apela_dolor', true, 'baja',
  'rapida', true, false,
  'pérdida de peso', 'ataca el cortisol como causa real, no las calorías',
  array['cortisol', 'bajar de peso', 'metabolismo', 'fitness'],
  '¿Por qué no bajas de peso aunque comes bien y haces ejercicio? El problema no son las calorías. Es el cortisol...',
  'educativo', 'segunda_persona', 'Aprenderás por qué tu cuerpo retiene grasa a pesar del ejercicio',
  'ultra_especifico', 87,
  'Video educativo que ataca creencia falsa común. Usa pregunta retórica como gancho, autoridad con dato científico y prueba social implícita.',
  true, 'v1.0'
);

-- 3. Verificar que el trigger calculó el score de engagement
select
  id,
  niche,
  vistas,
  likes,
  compartidos,
  score_engagement,
  score_cialdini
from guiones
where niche = 'fitness';

-- Resultado esperado:
-- score_engagement = (62000 + 18000*3) / 850000 * 100 = 13.647...
-- score_cialdini   = 4 (reciprocidad + autoridad + prueba_social + simpatia)
