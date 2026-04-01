import { supabase } from '../../backend/lib/supabase.js'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('guiones')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return res.status(404).json({ error: 'Guion no encontrado' })
    return res.json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('guiones')
      .delete()
      .eq('id', id)

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true })
  }

  res.status(405).json({ error: 'Método no permitido' })
}
