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
  const audioFile = toFile(audioResponse, 'audio.mp3', { type: 'audio/mpeg' })

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
