// ============================================================
// VALIDADOR — Zod Schema
// Valida el JSON de GPT-4o antes de guardar en Supabase
// Si GPT-4o alucina un valor fuera del enum, lo atrapa aquí
// ============================================================
import { z } from 'zod'

const EstructuraEnum      = z.enum(['AIDA','PAS','hero_journey','storybrand','antes_despues','otra'])
const GanchoTipoEnum      = z.enum(['pregunta','declaracion_shock','dato_estadistica','historia','controversia','promesa_directa'])
const DesarrolloEnum      = z.enum(['problema_solucion','lista','demostracion','testimonio','tutorial','storytelling_puro'])
const CtaTipoEnum         = z.enum(['seguir','comentar','compartir','comprar','visitar_link','guardar','ninguno'])
const PacingEnum          = z.enum(['lento','medio','rapido','variable'])
const TriggerEnum         = z.enum(['miedo','esperanza','curiosidad','ira','orgullo','tristeza','sorpresa','humor'])
const AtencionVisualEnum  = z.enum(['zoom_agresivo','corte_rapido','texto_pantalla','cara_camara','broll_dinamico','ninguno'])
const DolorPlacerEnum     = z.enum(['apela_dolor','apela_placer','ambos'])
const CargaEnum           = z.enum(['baja','media','alta'])
const VelocidadEnum       = z.enum(['lenta','normal','rapida','muy_rapida'])
const TonoEnum            = z.enum(['educativo','entretenimiento','inspiracional','controversial','informativo','humoristico'])
const PersonaEnum         = z.enum(['primera_persona','segunda_persona','tercera_persona','mixta'])
const EspecificidadEnum   = z.enum(['generico','especifico','ultra_especifico'])
const TecnicaRetencionEnum= z.enum(['open_loop','cliffhanger','curiosity_gap','countdown','pregunta_abierta','ninguna'])
const RatioEmocionEnum    = z.enum(['emocional','logico','equilibrado'])
const NivelConcienciaEnum = z.enum(['inconsciente','problema_consciente','solucion_consciente','producto_consciente','mas_consciente'])
const ReplicabilidadEnum  = z.enum(['alta','media','baja'])

export const AnalisisSchema = z.object({
  // Storytelling
  estructura_narrativa:   EstructuraEnum,
  gancho_tipo:            GanchoTipoEnum,
  gancho_texto:           z.string().min(1).max(200),
  apertura_exacta:        z.string().min(1).max(300),
  cierre_exacto:          z.string().min(1).max(200),
  gancho_duracion_seg:    z.number().int().min(0).max(30),
  desarrollo_tipo:        DesarrolloEnum,
  cta_tipo:               CtaTipoEnum,
  cta_texto:              z.string().max(300).nullable(),
  arco_emocional:         z.string().min(1).max(200),
  conflicto_central:      z.string().min(1).max(500),
  resolucion:             z.string().min(1).max(500),
  pacing_ritmo:           PacingEnum,
  numero_actos:           z.number().int().min(1).max(4),
  tecnica_retencion:      TecnicaRetencionEnum,
  momento_pico_seg:       z.number().int().min(0).max(600),

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
  intensidad_emocional:   z.number().int().min(1).max(10),

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

  // Métricas
  score_virabilidad:      z.number().int().min(1).max(100),
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
