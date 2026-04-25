import { supabase } from '../backend/lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  const { niche, cliente_id, plataforma, page = 1, limit = 20, todos, status, busqueda, sortField, sortDir } = req.query
  const offset = (Number(page) - 1) * Number(limit)

  const SORT_MAP = { score_virabilidad: 'score_virabilidad', fecha_analisis: 'fecha_analisis', created_at: 'fecha_analisis' }
  const orderBy  = SORT_MAP[sortField] || 'fecha_analisis'
  const ascending = sortDir === 'asc'

  let query = supabase
    .from('guiones')
    .select(`
      id, niche, sub_niche, plataforma, url_origen,
      gancho_texto, gancho_tipo, estructura_narrativa, trigger_emocional,
      tono, score_engagement, score_virabilidad, score_cialdini,
      fecha_analisis, procesado_ok, error_detalle, vistas, likes, compartidos,
      tema_principal, resumen_patron
    `, { count: 'exact' })
    .order(orderBy, { ascending })
    .range(offset, offset + Number(limit) - 1)

  if (status === 'ok')         query = query.eq('procesado_ok', true)
  else if (status === 'error') query = query.eq('procesado_ok', false)
  else if (todos !== '1' && todos !== 'true') query = query.eq('procesado_ok', true)

  if (niche && niche !== 'todos') query = query.eq('niche', niche)
  if (cliente_id)                 query = query.eq('cliente_id', cliente_id)
  if (plataforma)                 query = query.eq('plataforma', plataforma)
  if (busqueda)                   query = query.or(`tema_principal.ilike.%${busqueda}%,url_origen.ilike.%${busqueda}%`)

  const { data, error, count } = await query
  if (error) return res.status(500).json({ error: error.message })

  res.json({ guiones: data, total: count, page: Number(page), limit: Number(limit) })
}
