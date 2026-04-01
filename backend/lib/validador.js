// ============================================================
// VALIDADOR — Zod Schema
// Valida el JSON de GPT-4o antes de guardar en Supabase
// Incluye normalización de enums para tolerar variaciones
// comunes de GPT-4o (acentos, mayúsculas, aliases)
// ============================================================
import { z } from 'zod'

// ── Helpers de normalización ─────────────────────────────────

function stripAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Intenta hacer coincidir `valor` con uno de los valores válidos del enum,
 * tolerando diferencias de acentos, mayúsculas y espacios vs guiones bajos.
 * Si no encuentra coincidencia, devuelve el valor original para que Zod reporte el error.
 */
function normalizarEnum(valor, validos, aliases = {}) {
  if (typeof valor !== 'string') return valor

  // 1. Alias explícitos (e.g. "ninguno" → "ninguna")
  if (aliases[valor]) return aliases[valor]

  // 2. Strip de acentos
  const sinAcentos = stripAccents(valor).trim()
  if (aliases[sinAcentos]) return aliases[sinAcentos]

  // 3. Coincidencia exacta tras strip
  if (validos.includes(sinAcentos)) return sinAcentos

  // 4. Coincidencia case-insensitive
  const lower = sinAcentos.toLowerCase()
  const matchCI = validos.find(v => v.toLowerCase() === lower)
  if (matchCI) return matchCI

  // 5. Espacios → guiones bajos + case-insensitive
  const underscored = lower.replace(/\s+/g, '_')
  const matchU = validos.find(v => v.toLowerCase() === underscored)
  if (matchU) return matchU

  return sinAcentos // sin match → Zod reportará el error
}

/** Enum flexible: tolera acentos, mayúsculas, espacios y aliases explícitos */
function flexEnum(values, aliases = {}) {
  return z.preprocess(
    v => normalizarEnum(String(v ?? ''), values, aliases),
    z.enum(values)
  )
}

/** Entero flexible: acepta strings numéricos que GPT-4o a veces devuelve */
function flexInt(min, max) {
  return z.preprocess(
    v => (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v)))
      ? Math.round(Number(v))
      : v,
    z.number().int().min(min).max(max)
  )
}

// ── Definición de enums ──────────────────────────────────────

const EstructuraEnum     = flexEnum(['AIDA','PAS','hero_journey','storybrand','antes_despues','otra'])
const GanchoTipoEnum     = flexEnum(
  ['pregunta','declaracion_shock','dato_estadistica','historia','controversia','promesa_directa'],
  { 'shock': 'declaracion_shock', 'declaracion': 'declaracion_shock',
    'dato': 'dato_estadistica', 'estadistica': 'dato_estadistica',
    'promesa': 'promesa_directa' }
)
const DesarrolloEnum     = flexEnum(['problema_solucion','lista','demostracion','testimonio','tutorial','storytelling_puro'])
const CtaTipoEnum        = flexEnum(['seguir','comentar','compartir','comprar','visitar_link','guardar','ninguno'])
const PacingEnum         = flexEnum(['lento','medio','rapido','variable'])
const TriggerEnum        = flexEnum(['miedo','esperanza','curiosidad','ira','orgullo','tristeza','sorpresa','humor'])
const AtencionVisualEnum = flexEnum(['zoom_agresivo','corte_rapido','texto_pantalla','cara_camara','broll_dinamico','ninguno'])
const DolorPlacerEnum    = flexEnum(['apela_dolor','apela_placer','ambos'])
const CargaEnum          = flexEnum(['baja','media','alta'])
const VelocidadEnum      = flexEnum(['lenta','normal','rapida','muy_rapida'], { 'muy rapida': 'muy_rapida' })
const TonoEnum           = flexEnum(
  ['educativo','entretenimiento','inspiracional','controversial','informativo','humoristico'],
  { 'humor': 'humoristico', 'comico': 'humoristico', 'humoristico': 'humoristico' }
)
const PersonaEnum        = flexEnum(['primera_persona','segunda_persona','tercera_persona','mixta'])
const EspecificidadEnum  = flexEnum(['generico','especifico','ultra_especifico'])
const TecnicaRetencionEnum = flexEnum(
  ['open_loop','cliffhanger','curiosity_gap','countdown','pregunta_abierta','ninguna'],
  { 'ninguno': 'ninguna' } // GPT-4o a veces usa el masculino
)
const RatioEmocionEnum   = flexEnum(['emocional','logico','equilibrado'])
const NivelConcienciaEnum = flexEnum(['inconsciente','problema_consciente','solucion_consciente','producto_consciente','mas_consciente'])
const ReplicabilidadEnum = flexEnum(['alta','media','baja'])

// ── Schema principal ─────────────────────────────────────────

export const AnalisisSchema = z.object({
  // Storytelling
  estructura_narrativa:   EstructuraEnum,
  gancho_tipo:            GanchoTipoEnum,
  gancho_texto:           z.string().min(1).max(200),
  apertura_exacta:        z.string().min(1).max(300),
  cierre_exacto:          z.string().min(1).max(200),
  gancho_duracion_seg:    flexInt(0, 30),
  desarrollo_tipo:        DesarrolloEnum,
  cta_tipo:               CtaTipoEnum,
  cta_texto:              z.string().max(300).nullable(),
  arco_emocional:         z.string().min(1).max(200),
  conflicto_central:      z.string().min(1).max(500),
  resolucion:             z.string().min(1).max(500),
  pacing_ritmo:           PacingEnum,
  numero_actos:           flexInt(1, 4),
  tecnica_retencion:      TecnicaRetencionEnum,
  momento_pico_seg:       flexInt(0, 600),

  // Cialdini
  cialdini_reciprocidad:  z.boolean(),
  cialdini_escasez:       z.boolean(),
  cialdini_autoridad:     z.boolean(),
  cialdini_consistencia:  z.boolean(),
  cialdini_prueba_social: z.boolean(),
  cialdini_simpatia:      z.boolean(),
  cialdini_unidad:        z.boolean(),
  sesgo_cognitivo:        z.string().max(100).nullable(),
  trigger_emocional:      TriggerEnum,
  intensidad_emocional:   flexInt(1, 10),

  // Neuropublicidad
  atencion_visual:        AtencionVisualEnum,
  lenguaje_sensorial:     z.boolean(),
  contraste_narrativo:    z.boolean(),
  efecto_novedad:         z.boolean(),
  dolor_placer:           DolorPlacerEnum,
  personalizacion:        z.boolean(),
  carga_cognitiva:        CargaEnum,
  velocidad_locucion:     VelocidadEnum,
  uso_musica:             z.boolean(),
  micro_compromisos:      z.boolean(),
  ratio_emocion_logica:   RatioEmocionEnum,

  // Contenido + Copywriting
  tema_principal:         z.string().min(1).max(100),
  angulo_unico:           z.string().min(1).max(500),
  palabras_clave:         z.array(z.string()).min(1).max(10),
  tono:                   TonoEnum,
  persona_narradora:      PersonaEnum,
  promesa_explicita:      z.string().min(1).max(500),
  nivel_especificidad:    EspecificidadEnum,
  nivel_consciencia:      NivelConcienciaEnum,
  objecion_principal:     z.string().max(500).nullable(),
  avatar_descripcion:     z.string().min(1).max(500),
  ingredientes_clave:     z.array(z.string()).min(1).max(7),
  replicabilidad:         ReplicabilidadEnum,

  // Diagnóstico y mejora
  fortalezas:             z.array(z.string()).min(1).max(5),
  debilidades:            z.array(z.string()).min(1).max(5),
  sugerencias_mejora:     z.array(z.string()).min(1).max(5),
  hashtags_sugeridos:     z.array(z.string()).min(1).max(10),

  // Métricas
  score_virabilidad:      flexInt(1, 100),
  resumen_patron:         z.string().min(10).max(1500),
})

/**
 * Valida el JSON de GPT-4o y lanza error descriptivo si falla
 * @param {object} data  JSON crudo de GPT-4o
 * @returns {object}     Datos validados y tipados
 */
export function validarAnalisis(data) {
  const resultado = AnalisisSchema.safeParse(data)

  if (!resultado.success) {
    const errores = resultado.error.errors
      .map(e => `  • ${e.path.join('.')}: ${e.message} (recibido: ${JSON.stringify(e.received ?? 'undefined')})`)
      .join('\n')
    throw new Error(`Validación GPT-4o falló:\n${errores}`)
  }

  return resultado.data
}
