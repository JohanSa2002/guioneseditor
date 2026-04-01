import 'dotenv/config'
import express      from 'express'
import cors         from 'cors'
import { extraerAudio }       from './lib/extractor.js'
import { transcribir }        from './lib/transcriptor.js'
import { analizarTranscript } from './lib/analizador.js'
import { validarAnalisis }    from './lib/validador.js'
import { generarEmbedding }   from './lib/embeddings.js'
import { generarGuion }       from './lib/generador.js'
import { supabase }           from './lib/supabase.js'

// ── Validar variables de entorno requeridas ──────────────────
const REQUIRED_ENV = ['OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RAPIDAPI_KEY']
const missingVars  = REQUIRED_ENV.filter(k => !process.env[k])
if (missingVars.length > 0) {
  console.error(`\n❌  Variables de entorno faltantes: ${missingVars.join(', ')}\n    Configura el archivo backend/.env antes de iniciar.\n`)
  process.exit(1)
}

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

// ── GET /api/guiones ────────────────────────────────────────
// Lista todos los guiones con paginación y filtros
app.get('/api/guiones', async (req, res) => {
  const { niche, cliente_id, plataforma, page = 1, limit = 20, todos } = req.query
  const offset = (page - 1) * limit

  let query = supabase
    .from('guiones')
    .select(`
      id, niche, sub_niche, plataforma, url_origen,
      gancho_texto, estructura_narrativa, trigger_emocional,
      tono, score_engagement, score_virabilidad, score_cialdini,
      fecha_analisis, procesado_ok, error_detalle, vistas, likes, compartidos,
      tema_principal, resumen_patron
    `, { count: 'exact' })
    .order('fecha_analisis', { ascending: false })
    .range(offset, offset + limit - 1)

  if (!todos) query = query.eq('procesado_ok', true)
  if (niche)      query = query.eq('niche', niche)
  if (cliente_id) query = query.eq('cliente_id', cliente_id)
  if (plataforma) query = query.eq('plataforma', plataforma)

  const { data, error, count } = await query

  if (error) return res.status(500).json({ error: error.message })
  res.json({ guiones: data, total: count, page: Number(page), limit: Number(limit) })
})

// ── GET /api/guiones/:id ────────────────────────────────────
// Detalle completo de un guion
app.get('/api/guiones/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('guiones')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(404).json({ error: 'Guion no encontrado' })
  res.json(data)
})

// ── GET /api/nichos ─────────────────────────────────────────
// Lista de nichos distintos para el selector del formulario
app.get('/api/nichos', async (req, res) => {
  const { data, error } = await supabase
    .from('guiones')
    .select('niche')
    .eq('procesado_ok', true)

  if (error) return res.status(500).json({ error: error.message })

  const nichos = [...new Set(data.map(r => r.niche))].sort()
  res.json(nichos)
})

// ── GET /api/clientes ───────────────────────────────────────
app.get('/api/clientes', async (req, res) => {
  const { data, error } = await supabase
    .from('clientes')
    .select('id, nombre, industria')
    .eq('activo', true)
    .order('nombre')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// ── GET /api/stats ──────────────────────────────────────────
// Estadísticas para el dashboard
app.get('/api/stats', async (req, res) => {
  const { data, error } = await supabase
    .from('vista_resumen_nichos')
    .select('*')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// ── POST /api/analizar ──────────────────────────────────────
// Pipeline completo: URL → Audio → Whisper → GPT-4o → Supabase
app.post('/api/analizar', async (req, res) => {
  const {
    url, niche, sub_niche, mercado_objetivo,
    idioma = 'es', cliente_id = null, proyecto_nombre = null,
    competidor_referente = false,
    vistas = null, likes = null, compartidos = null,
    fecha_publicacion = null,
    contexto_video = '',
  } = req.body

  if (!url)              return res.status(400).json({ error: 'El campo "url" es requerido' })
  if (!niche)            return res.status(400).json({ error: 'El campo "niche" es requerido' })
  if (!vistas || Number(vistas) <= 0) return res.status(400).json({ error: 'El campo "vistas" es requerido y debe ser mayor a 0' })
  if (!likes  || Number(likes)  <= 0) return res.status(400).json({ error: 'El campo "likes" es requerido y debe ser mayor a 0' })

  const URL_SOPORTADAS = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com|instagram\.com|youtube\.com|youtu\.be)/
  if (!URL_SOPORTADAS.test(url)) {
    return res.status(400).json({ error: 'URL no soportada. Solo se aceptan TikTok, Instagram Reels y YouTube Shorts.' })
  }

  const inicio = Date.now()
  let paso = 'inicio'

  try {
    paso = 'extraccion'
    console.log(`[1/5] Extrayendo audio de: ${url}`)
    const { audioUrl, duracion, plataforma } = await extraerAudio(url)

    paso = 'transcripcion'
    console.log(`[2/5] Transcribiendo audio (${duracion}s)...`)
    const transcript = await transcribir(audioUrl, idioma)

    paso = 'analisis'
    console.log(`[3/5] Analizando con GPT-4o...`)
    const analisisRaw = await analizarTranscript(transcript, niche, plataforma, duracion, contexto_video)

    paso = 'validacion'
    console.log(`[4/5] Validando schema...`)
    const analisis = validarAnalisis(analisisRaw)

    paso = 'embedding'
    console.log(`[5/5] Generando embedding y guardando...`)
    const vector = await generarEmbedding(transcript, analisis)

    paso = 'guardado'
    console.log(`[5/5] Guardando en la base de datos...`)

    const payload = {
      cliente_id, niche, sub_niche, mercado_objetivo, idioma,
      proyecto_nombre, competidor_referente,
      url_origen: url, plataforma, duracion_segundos: duracion,
      vistas: vistas ? Number(vistas) : null,
      likes: likes ? Number(likes) : null,
      compartidos: compartidos ? Number(compartidos) : null,
      fecha_publicacion,
      contexto_video: contexto_video || null,
      ...analisis,
      transcript,
      embedding_vector: vector, // Use native array
      procesado_ok: true,
      version_prompt: 'v1.0',
    }

    const { data: guion, error: errorSupabase } = await supabase
      .from('guiones')
      .insert(payload)
      .select('id, niche, score_virabilidad, resumen_patron')
      .single()

    if (errorSupabase) {
      console.error('[Supabase] Error al insertar guion:')
      console.error('  Código:', errorSupabase.code)
      console.error('  Mensaje:', errorSupabase.message)
      console.error('  Detalle:', errorSupabase.details)
      console.error('  Pista:', errorSupabase.hint)
      
      // Log simple del objeto para detectar campos inválidos en la consola del backend
      console.error('Payload enviado (resumido):', Object.keys(payload).join(', '))
      
      throw new Error(`Supabase [${errorSupabase.code}]: ${errorSupabase.message}`)
    }

    const segundos = ((Date.now() - inicio) / 1000).toFixed(1)
    console.log(`✓ Completado en ${segundos}s — ID: ${guion.id}`)

    res.json({
      ok: true,
      guion_id:         guion.id,
      niche:            guion.niche,
      score_virabilidad: guion.score_virabilidad,
      resumen_patron:   guion.resumen_patron,
      tiempo_total_seg: parseFloat(segundos),
    })

  } catch (err) {
    console.error(`✗ Error en paso "${paso}":`, err.message)
    await supabase.from('guiones').insert({
      url_origen: url, niche, idioma, cliente_id,
      procesado_ok: false,
      error_detalle: `[${paso}] ${err.message}`,
      version_prompt: 'v1.0',
    }).catch(() => {})

    res.status(500).json({ ok: false, paso, error: err.message })
  }
})

// ── POST /api/generar ───────────────────────────────────────
// Genera un guion nuevo a partir de patrones analizados
app.post('/api/generar', async (req, res) => {
  const {
    niche, tema, audiencia, plataforma,
    duracion_objetivo = 60,
    tono = 'educativo',
    objetivo = 'engagement',
    estructura = 'AIDA',
    instrucciones_extra = '',
    cliente_id = null,
    referencias_ids = [],   // IDs de guiones analizados a usar como referencia
    num_referencias = 3,    // cuántos guiones top tomar si no se dan IDs explícitos
  } = req.body

  if (!niche)    return res.status(400).json({ error: 'El campo "niche" es requerido' })
  if (!tema)     return res.status(400).json({ error: 'El campo "tema" es requerido' })
  if (!audiencia) return res.status(400).json({ error: 'El campo "audiencia" es requerido' })

  try {
    // Obtener patrones de referencia
    let patrones = []

    if (referencias_ids.length > 0) {
      // Usar las referencias explícitas del usuario
      const { data } = await supabase
        .from('guiones')
        .select(`
          estructura_narrativa, gancho_tipo, gancho_texto, apertura_exacta,
          tecnica_retencion, trigger_emocional, intensidad_emocional,
          cialdini_reciprocidad, cialdini_escasez, cialdini_autoridad,
          cialdini_consistencia, cialdini_prueba_social, cialdini_simpatia, cialdini_unidad,
          ingredientes_clave, resumen_patron, score_virabilidad
        `)
        .in('id', referencias_ids)
        .eq('procesado_ok', true)

      patrones = data || []
    } else {
      // Auto-seleccionar los mejores del mismo niche y plataforma
      let query = supabase
        .from('guiones')
        .select(`
          estructura_narrativa, gancho_tipo, gancho_texto, apertura_exacta,
          tecnica_retencion, trigger_emocional, intensidad_emocional,
          cialdini_reciprocidad, cialdini_escasez, cialdini_autoridad,
          cialdini_consistencia, cialdini_prueba_social, cialdini_simpatia, cialdini_unidad,
          ingredientes_clave, resumen_patron, score_virabilidad
        `)
        .eq('procesado_ok', true)
        .eq('niche', niche)
        .order('likes', { ascending: false })
        .order('vistas', { ascending: false })
        .limit(num_referencias)

      if (plataforma) query = query.eq('plataforma', plataforma)

      const { data } = await query
      patrones = data || []
    }

    const guion = await generarGuion({
      niche, tema, audiencia, plataforma, duracion_objetivo,
      tono, objetivo, estructura, instrucciones_extra,
    }, patrones)

    // Guardar en Supabase
    const { data: guardado, error: errGuardado } = await supabase
      .from('guiones_generados')
      .insert({
        cliente_id,
        niche, tema, audiencia, plataforma,
        duracion_objetivo, tono, objetivo,
        estructura_usada: estructura,
        instrucciones_extra: instrucciones_extra || null,
        referencias_ids: referencias_ids.length > 0 ? referencias_ids : (patrones.map ? null : null),
        titulo_sugerido:       guion.titulo_sugerido,
        gancho:                guion.gancho,
        desarrollo:            guion.desarrollo,
        cta:                   guion.cta,
        guion_completo:        guion.guion_completo,
        variantes_gancho:      guion.variantes_gancho,
        tecnicas_aplicadas:    guion.tecnicas_aplicadas,
        notas_produccion:      guion.notas_produccion,
        duracion_estimada_seg: guion.duracion_estimada_seg,
        score_estimado:        guion.score_estimado,
        version_prompt:        'v1.0',
      })
      .select('id')
      .single()

    if (errGuardado) throw new Error(`Supabase: ${errGuardado.message}`)

    res.json({ ok: true, guion_id: guardado.id, guion })
  } catch (err) {
    console.error('[generar] Error:', err.message)
    res.status(500).json({ ok: false, error: err.message })
  }
})

// ── GET /api/generados ──────────────────────────────────────
// Lista guiones generados con paginación
app.get('/api/generados', async (req, res) => {
  const { niche, cliente_id, page = 1, limit = 20 } = req.query
  const offset = (Number(page) - 1) * Number(limit)

  let query = supabase
    .from('guiones_generados')
    .select('id, niche, tema, audiencia, plataforma, tono, objetivo, titulo_sugerido, score_estimado, aprobado, fecha_generacion, num_referencias', { count: 'exact' })
    .order('fecha_generacion', { ascending: false })
    .range(offset, offset + Number(limit) - 1)

  if (niche)      query = query.eq('niche', niche)
  if (cliente_id) query = query.eq('cliente_id', cliente_id)

  const { data, error, count } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json({ generados: data, total: count, page: Number(page), limit: Number(limit) })
})

// ── GET /api/generados/:id ──────────────────────────────────
app.get('/api/generados/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('guiones_generados')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(404).json({ error: 'Guion generado no encontrado' })
  res.json(data)
})

app.listen(PORT, () => console.log(`Backend local corriendo en http://localhost:${PORT}`))

// ── Middleware global de manejo de errores ───────────────────
// Captura cualquier error no manejado en los routes de Express
app.use((err, req, res, _next) => {
  console.error('[Express] Error no manejado:', err.stack || err.message)
  if (!res.headersSent) {
    res.status(500).json({ ok: false, error: err.message || 'Error interno del servidor' })
  }
})

// ── Prevenir Crash por Promesas Rechazadas ───────────────────
process.on('unhandledRejection', (reason) => {
  console.error('[Node] unhandledRejection:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('[Node] uncaughtException:', err.stack || err.message)
})

