import { generarGuion } from '../lib/generador.js'
import { supabase }     from '../lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const {
    niche, tema, audiencia, plataforma,
    duracion_objetivo = 60,
    tono = 'educativo',
    objetivo = 'engagement',
    estructura = 'AIDA',
    instrucciones_extra = '',
    cliente_id = null,
    referencias_ids = [],
    num_referencias = 3,
  } = req.body

  if (!niche)     return res.status(400).json({ error: 'El campo "niche" es requerido' })
  if (!tema)      return res.status(400).json({ error: 'El campo "tema" es requerido' })
  if (!audiencia) return res.status(400).json({ error: 'El campo "audiencia" es requerido' })

  try {
    let patrones = []

    if (referencias_ids.length > 0) {
      const { data } = await supabase
        .from('guiones')
        .select(`
          id,
          estructura_narrativa, gancho_tipo, gancho_texto, apertura_exacta,
          cierre_exacta, cta_tipo, cta_texto, arco_emocional,
          conflicto_central, resolucion, pacing_ritmo, sesgo_cognitivo,
          trigger_emocional, intensidad_emocional, tono, nivel_especificidad,
          score_engagement, score_virabilidad, resumen_patron
        `)
        .in('id', referencias_ids)
        .eq('procesado_ok', true)
      patrones = data || []
    } else {
      const { data, error: errPatrones } = await supabase
        .from('guiones')
        .select(`
          id,
          estructura_narrativa, gancho_tipo, gancho_texto, apertura_exacta,
          cierre_exacta, cta_tipo, cta_texto, arco_emocional,
          conflicto_central, resolucion, pacing_ritmo, sesgo_cognitivo,
          trigger_emocional, intensidad_emocional, tono, nivel_especificidad,
          score_engagement, score_virabilidad, resumen_patron
        `)
        .eq('procesado_ok', true)
        .eq('niche', niche)
        .order('score_engagement', { ascending: false })
        .limit(3)

      if (errPatrones) console.warn('[generar] Error obteniendo patrones:', errPatrones.message)
      patrones = data || []
    }

    const guion = await generarGuion({
      niche, tema, audiencia, plataforma, duracion_objetivo,
      tono, objetivo, estructura, instrucciones_extra,
    }, patrones)

    const { data: guardado, error: errGuardado } = await supabase
      .from('guiones_generados')
      .insert({
        cliente_id, niche, tema, audiencia, plataforma,
        duracion_objetivo, tono, objetivo,
        estructura_usada:      estructura,
        instrucciones_extra:   instrucciones_extra || null,
        referencias_ids:       referencias_ids.length > 0 ? referencias_ids : (patrones.length > 0 ? patrones.map(p => p.id) : null),
        titulo_sugerido:       guion.titulo_sugerido || `Guion: ${tema}`,
        gancho:                guion.gancho || '...',
        desarrollo:            guion.desarrollo || '...',
        cta:                   guion.cta,
        guion_completo:        guion.guion_completo || '',
        variantes_gancho:      guion.variantes_gancho || [],
        tecnicas_aplicadas:    guion.tecnicas_aplicadas || [],
        notas_produccion:      guion.notas_produccion,
        duracion_estimada_seg: guion.duracion_estimada_seg || 0,
        score_estimado:        guion.score_estimado || 0,
        version_prompt:        'v1.0',
      })
      .select('id')
      .single()

    if (errGuardado) throw new Error(`Supabase: ${errGuardado.message}`)

    res.json({ ok: true, guion_id: guardado.id, guion })
  } catch (err) {
    console.error('[generar]', err.message)
    res.status(500).json({ ok: false, error: err.message })
  }
}
