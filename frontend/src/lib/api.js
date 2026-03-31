const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  // Protección: el servidor puede devolver texto/HTML en errores graves
  let data
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    data = await res.json()
  } else {
    const text = await res.text()
    data = { error: text || `Error del servidor (${res.status})` }
  }

  if (!res.ok) {
    const msg = data.error || data.message || `Error ${res.status}`
    throw new Error(data.paso ? `[${data.paso}] ${msg}` : msg)
  }
  return data
}

export const api = {
  guiones: {
    listar:      (params = {}) => request('/guiones?' + new URLSearchParams(params)),
    listarTodos: (params = {}) => request('/guiones?' + new URLSearchParams({ ...params, todos: '1' })),
    obtener:     (id)          => request(`/guiones/${id}`),
  },
  generados: {
    listar:  (params = {}) => request('/generados?' + new URLSearchParams(params)),
    obtener: (id)          => request(`/generados/${id}`),
  },
  analizar:  (body) => request('/analizar',  { method: 'POST', body: JSON.stringify(body) }),
  generar:   (body) => request('/generar',   { method: 'POST', body: JSON.stringify(body) }),
  nichos:    ()     => request('/nichos'),
  clientes:  ()     => request('/clientes'),
  stats:     ()     => request('/stats'),
}
