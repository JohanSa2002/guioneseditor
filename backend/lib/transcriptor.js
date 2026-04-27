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
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
  }
  for (let i = 1; i <= intentos; i++) {
    try {
      const res = await fetch(url, { headers })
      if (res.ok) return res
      ultimoError = new Error(`HTTP ${res.status} al descargar audio (intento ${i}/${intentos})`)
    } catch (err) {
      ultimoError = err
    }
    if (i < intentos) await new Promise(r => setTimeout(r, 1500 * i))
  }
  throw ultimoError
}

/**
 * @param {string} audioUrl  URL directa del MP3 o MP4
 * @param {string} idioma    Código de idioma: 'es', 'en', 'pt', etc.
 * @returns {string} Transcripción completa del audio
 */
export async function transcribir(audioUrl, idioma = 'es') {
  console.log(`[Whisper] Descargando audio desde: ${audioUrl.split('?')[0]}...`)
  const audioResponse = await fetchConReintentos(audioUrl)
  
  // Verificar tamaño para depuración
  const contentLength = audioResponse.headers.get('content-length')
  if (contentLength) {
    console.log(`[Whisper] Tamaño del archivo: ${(contentLength / 1024 / 1024).toFixed(2)} MB`)
  }

  const formatosSoportados = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm']
  const mimeMap = { mp3: 'audio/mpeg', m4a: 'audio/mp4', mp4: 'audio/mp4', webm: 'audio/webm', ogg: 'audio/ogg', wav: 'audio/wav', flac: 'audio/flac', mpeg: 'audio/mpeg', mpga: 'audio/mpeg', oga: 'audio/ogg' }

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

  if (!ext) {
    const urlExt = audioUrl.split('?')[0].split('.').pop()?.toLowerCase()
    ext = formatosSoportados.includes(urlExt) ? urlExt : null
  }

  if (!ext) ext = 'mp4'

  const mimeType = mimeMap[ext] || 'audio/mp4'
  const audioFile = await toFile(audioResponse, `audio.${ext}`, { type: mimeType })

  console.log(`[Whisper] Enviando a OpenAI (idioma: ${idioma})...`)
  
  let transcripcion
  try {
    const response = await openai.audio.transcriptions.create({
      file:     audioFile,
      model:    'whisper-1',
      language: idioma === 'otro' ? undefined : idioma,
      response_format: 'text',
    })
    transcripcion = response
  } catch (err) {
    console.error('[Whisper] Error en la API de OpenAI:', err.message)
    throw new Error(`OpenAI Whisper error: ${err.message}`)
  }

  // Fallback: si el idioma forzado no devolvió nada, intentar con auto-detección
  if ((!transcripcion || transcripcion.trim().length < 10) && idioma !== 'otro') {
    console.log('[Whisper] Sin resultados con idioma forzado. Reintentando con auto-detección...')
    // Re-crear el archivo porque el stream se consumió? 
    // No, toFile lo cargó en memoria si es un blob/archivo.
    try {
      const fallbackResponse = await openai.audio.transcriptions.create({
        file:     audioFile,
        model:    'whisper-1',
        response_format: 'text',
      })
      if (fallbackResponse && fallbackResponse.trim().length >= 10) {
        transcripcion = fallbackResponse
      }
    } catch (_) { /* ignorar error del fallback */ }
  }

  if (!transcripcion || transcripcion.trim().length < 10) {
    console.warn('[Whisper] No se detectó voz suficiente o el audio es mudo. Continuando sin transcripción...')
    return (transcripcion || '').trim()
  }

  console.log(`[Whisper] Transcripción exitosa (${transcripcion.length} caracteres)`)
  return transcripcion.trim()
}
