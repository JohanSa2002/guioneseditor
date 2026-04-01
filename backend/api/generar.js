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

    const { data: guardado, error: errGuardado } = await supabase
      .from('guiones_generados')
      .insert({
        cliente_id, niche, tema, audiencia, plataforma,
        duracion_objetivo, tono, objetivo,
        estructura_usada:      estructura,
        instrucciones_extra:   instrucciones_extra || null,
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
    console.error('[generar]', err.message)
    res.status(500).json({ ok: false, error: err.message })
  }
}
