const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}

export const api = {
  guiones:  {
    listar:  (params = {}) => request('/guiones?' + new URLSearchParams(params)),
    obtener: (id)          => request(`/guiones/${id}`),
  },
  analizar: (body)         => request('/analizar', { method: 'POST', body: JSON.stringify(body) }),
  nichos:   ()             => request('/nichos'),
  clientes: ()             => request('/clientes'),
  stats:    ()             => request('/stats'),
}
