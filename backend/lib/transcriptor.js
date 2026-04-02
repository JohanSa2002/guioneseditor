// ============================================================
// TRANSCRIPTOR — OpenAI Whisper
// Descarga el audio desde la URL y lo transcribe
// Incluye reintentos automáticos para URLs de CDN inestables
// ============================================================
import OpenAI, { toFile } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Descarga una URL con reintentos (para CDNs que expiran o fallan transitoriamente)
 * @param {string} url
 * @param {number} intentos   Máximo de intentos (default: 3)
 * @returns {Response}
 */
async function fetchConReintentos(url, intentos = 3) {
  let ultimoError
  for (let i = 1; i <= intentos; i++) {
    try {
      const res = await fetch(url)
      if (res.ok) return res
      ultimoError = new Error(`HTTP ${res.status} al descargar audio (intento ${i}/${intentos})`)
    } catch (err) {
      ultimoError = err
    }
    if (i < intentos) await new Promise(r => setTimeout(r, 1200 * i)) // backoff: 1.2s, 2.4s
  }
  throw ultimoError
}

/**
 * @param {string} audioUrl  URL directa del MP3 (de Social Download API)
 * @param {string} idioma    Código de idioma: 'es', 'en', 'pt', etc.
 * @returns {string} Transcripción completa del audio
 */
export async function transcribir(audioUrl, idioma = 'es') {
  const audioResponse = await fetchConReintentos(audioUrl)

  // En Vercel Serverless (Node < 20), Web API `File` no está disponible por defecto,
  // y `arrayBuffer` consume mucha RAM. `toFile` soluciona ambos.
  const formatosSoportados = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm']
  const mimeMap = { mp3: 'audio/mpeg', m4a: 'audio/mp4', mp4: 'audio/mp4', webm: 'audio/webm', ogg: 'audio/ogg', wav: 'audio/wav', flac: 'audio/flac', mpeg: 'audio/mpeg', mpga: 'audio/mpeg', oga: 'audio/ogg' }

  // 1. Intentar detectar formato desde el Content-Type de la respuesta HTTP
  const contentType = audioResponse.headers.get('content-type') || ''
  const contentTypeToExt = {
    'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/mp4': 'm4a',
    'video/mp4': 'mp4', 'audio/webm': 'webm', 'video/webm': 'webm',
    'audio/ogg': 'ogg', 'audio/flac': 'flac', 'audio/wav': 'wav',
    'audio/x-wav': 'wav', 'audio/x-m4a': 'm4a',
  }
  let ext = null
  for (const [mime, e] of Object.entries(contentTypeToExt)) {
    if (contentType.includes(mime)) { ext = e; break }
  }

  // 2. Si el Content-Type no fue útil, intentar con la extensión de la URL
  if (!ext) {
    const urlExt = audioUrl.split('?')[0].split('.').pop()?.toLowerCase()
    ext = formatosSoportados.includes(urlExt) ? urlExt : null
  }

  // 3. Fallback a mp4 (más común en plataformas sociales y soportado por Whisper)
  if (!ext) ext = 'mp4'

  const mimeType = mimeMap[ext] || 'audio/mp4'
  // toFile es async en el SDK de OpenAI — await es necesario aunque el IDE lo marque como hint
  const audioFile = await toFile(audioResponse, `audio.${ext}`, { type: mimeType })

  const transcripcion = await openai.audio.transcriptions.create({
    file:     audioFile,
    model:    'whisper-1',
    language: idioma === 'otro' ? undefined : idioma, // auto-detect si es 'otro'
    response_format: 'text',
  })

  if (!transcripcion || transcripcion.trim().length < 10) {
    throw new Error(
      'Whisper no detectó voz suficiente en el audio. ' +
      'Verifica que el video tenga narración clara (no solo música o texto en pantalla).'
    )
  }

  return transcripcion.trim()
}
