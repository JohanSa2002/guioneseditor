// ============================================================
// ENDPOINT PRINCIPAL — POST /api/analizar
// Orquesta el pipeline completo:
// URL → Audio → Whisper → GPT-4o → Validar → Embedding → Supabase
// ============================================================
import { extraerAudio }      from '../lib/extractor.js'
import { transcribir }       from '../lib/transcriptor.js'
import { analizarTranscript } from '../lib/analizador.js'
import { validarAnalisis }   from '../lib/validador.js'
import { generarEmbedding }  from '../lib/embeddings.js'
import { supabase }          from '../lib/supabase.js'

export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const inicio = Date.now()

  // ── Validar body de entrada ───────────────────────────────
  const {
    url,
    niche,
    sub_niche,
    mercado_objetivo,
    idioma          = 'es',
    cliente_id      = null,
    proyecto_nombre = null,
    competidor_referente = false,
    // Métricas manuales (la API no las devuelve)
    vistas          = null,
    likes           = null,
    compartidos     = null,
    fecha_publicacion = null,
    contexto_video  = '',
  } = req.body

  if (!url)   return res.status(400).json({ error: 'El campo "url" es requerido' })
  if (!niche) return res.status(400).json({ error: 'El campo "niche" es requerido' })

  const URL_SOPORTADAS = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com|instagram\.com|youtube\.com|youtu\.be)/
  if (!URL_SOPORTADAS.test(url)) {
    return res.status(400).json({ error: 'URL no soportada. Solo se aceptan TikTok, Instagram Reels y YouTube Shorts.' })
  }

  let paso = 'inicio'

  try {
    // ── PASO 1: Extraer audio ─────────────────────────────
    paso = 'extraccion'
    const { audioUrl, duracion, titulo, thumbnail, plataforma } = await extraerAudio(url)

    // ── PASO 2: Transcribir con Whisper ───────────────────
    paso = 'transcripcion'
    const transcript = await transcribir(audioUrl, idioma)

    // ── PASO 3: Analizar con GPT-4o ───────────────────────
    paso = 'analisis'
    const analisisRaw = await analizarTranscript(transcript, niche, plataforma, duracion, contexto_video)

    // ── PASO 4: Validar con Zod ───────────────────────────
    paso = 'validacion'
    const analisis = validarAnalisis(analisisRaw)

    // ── PASO 5: Generar embedding vectorial ───────────────
    paso = 'embedding'
    const vector = await generarEmbedding(transcript, analisis)

    // ── PASO 6: Guardar en Supabase ───────────────────────
    paso = 'guardado'
    const { data: guion, error: errorSupabase } = await supabase
      .from('guiones')
      .insert({
        // Organización
        cliente_id,
        niche,
        sub_niche,
        mercado_objetivo,
        idioma,
        proyecto_nombre,
        competidor_referente,

        // Metadata del video
        url_origen:           url,
        plataforma,
        duracion_segundos:    duracion,
        vistas,
        likes,
        compartidos,
        fecha_publicacion,

        // Análisis de GPT-4o (campos de storytelling)
        estructura_narrativa:   analisis.estructura_narrativa,
        gancho_tipo:            analisis.gancho_tipo,
        gancho_texto:           analisis.gancho_texto,
        gancho_duracion_seg:    analisis.gancho_duracion_seg,
        desarrollo_tipo:        analisis.desarrollo_tipo,
        cta_tipo:               analisis.cta_tipo,
        cta_texto:              analisis.cta_texto,
        arco_emocional:         analisis.arco_emocional,
        conflicto_central:      analisis.conflicto_central,
        resolucion:             analisis.resolucion,
        pacing_ritmo:           analisis.pacing_ritmo,
        numero_actos:           analisis.numero_actos,

        // Cialdini
        cialdini_reciprocidad:  analisis.cialdini_reciprocidad,
        cialdini_escasez:       analisis.cialdini_escasez,
        cialdini_autoridad:     analisis.cialdini_autoridad,
        cialdini_consistencia:  analisis.cialdini_consistencia,
        cialdini_prueba_social: analisis.cialdini_prueba_social,
        cialdini_simpatia:      analisis.cialdini_simpatia,
        cialdini_unidad:        analisis.cialdini_unidad,
        sesgo_cognitivo:        analisis.sesgo_cognitivo,
        trigger_emocional:      analisis.trigger_emocional,
        intensidad_emocional:   analisis.intensidad_emocional,

        // Neuropublicidad
        atencion_visual:        analisis.atencion_visual,
        lenguaje_sensorial:     analisis.lenguaje_sensorial,
        contraste_narrativo:    analisis.contraste_narrativo,
        efecto_novedad:         analisis.efecto_novedad,
        dolor_placer:           analisis.dolor_placer,
        personalizacion:        analisis.personalizacion,
        carga_cognitiva:        analisis.carga_cognitiva,
        velocidad_locucion:     analisis.velocidad_locucion,
        uso_musica:             analisis.uso_musica,
        micro_compromisos:      analisis.micro_compromisos,

        // Contenido
        tema_principal:         analisis.tema_principal,
        angulo_unico:           analisis.angulo_unico,
        palabras_clave:         analisis.palabras_clave,
        transcript,
        tono:                   analisis.tono,
        persona_narradora:      analisis.persona_narradora,
        promesa_explicita:      analisis.promesa_explicita,
        nivel_especificidad:    analisis.nivel_especificidad,
        contexto_video:         contexto_video || null,

        // Diagnóstico
        fortalezas:             analisis.fortalezas,
        debilidades:            analisis.debilidades,
        sugerencias_mejora:     analisis.sugerencias_mejora,
        hashtags_sugeridos:     analisis.hashtags_sugeridos,

        // Métricas (score_engagement lo calcula el trigger de Supabase)
        score_virabilidad:      analisis.score_virabilidad,
        resumen_patron:         analisis.resumen_patron,
        embedding_vector:       `[${vector.join(',')}]`,

        // Auditoría
        procesado_ok:    true,
        version_prompt:  'v1.0',
      })
      .select('id, niche, score_virabilidad, resumen_patron')
      .single()

    if (errorSupabase) {
      throw new Error(`Supabase error: ${errorSupabase.message}`)
    }

    const duracionTotal = ((Date.now() - inicio) / 1000).toFixed(1)

    return res.status(200).json({
      ok: true,
      guion_id:       guion.id,
      niche:          guion.niche,
      score_virabilidad: guion.score_virabilidad,
      resumen_patron: guion.resumen_patron,
      tiempo_total_seg: parseFloat(duracionTotal),
    })

  } catch (err) {
    console.error(`[analizar] Error en paso "${paso}":`, err.message)

    // Guardar el error en Supabase para diagnóstico
    if (paso !== 'inicio') {
      await supabase.from('guiones').insert({
        url_origen:      url,
        niche,
        idioma,
        cliente_id,
        procesado_ok:    false,
        error_detalle:   `[${paso}] ${err.message}`,
        version_prompt:  'v1.0',
      }).catch(() => {}) // silencioso si falla el insert de error
    }

    return res.status(500).json({
      ok:    false,
      paso,
      error: err.message,
    })
  }
}
