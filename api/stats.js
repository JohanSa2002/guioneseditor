import { supabase } from '../backend/lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  const { data, error } = await supabase
    .from('vista_resumen_nichos')
    .select('*')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}
