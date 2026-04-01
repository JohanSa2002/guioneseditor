import { supabase } from '../backend/lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  const { niche, cliente_id, plataforma, page = 1, limit = 20, todos } = req.query
  const offset = (Number(page) - 1) * Number(limit)

  let query = supabase
    .from('guiones')
    .select(`
      id, niche, sub_niche, plataforma, url_origen,
      gancho_texto, gancho_tipo, estructura_narrativa, trigger_emocional,
      tono, score_engagement, score_virabilidad, score_cialdini,
      fecha_analisis, procesado_ok, error_detalle, vistas, likes, compartidos,
      tema_principal, resumen_patron
    `, { count: 'exact' })
    .order('fecha_analisis', { ascending: false })
    .range(offset, offset + Number(limit) - 1)

  if (todos !== '1' && todos !== 'true') query = query.eq('procesado_ok', true)

  if (niche)      query = query.eq('niche', niche)
  if (cliente_id) query = query.eq('cliente_id', cliente_id)
  if (plataforma) query = query.eq('plataforma', plataforma)

  const { data, error, count } = await query
  if (error) return res.status(500).json({ error: error.message })

  res.json({ guiones: data, total: count, page: Number(page), limit: Number(limit) })
}
