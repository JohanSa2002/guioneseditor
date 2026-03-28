import { supabase } from '../../backend/lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  const { id } = req.query

  const { data, error } = await supabase
    .from('guiones')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: 'Guion no encontrado' })
  res.json(data)
}
