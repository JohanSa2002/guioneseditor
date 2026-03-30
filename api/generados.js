import { supabase } from '../backend/lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

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
}
