// ============================================================
// TRANSCRIPTOR — OpenAI Whisper
// Descarga el audio desde la URL y lo transcribe
// ============================================================
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * @param {string} audioUrl  URL directa del MP3 (de Social Download API)
 * @param {string} idioma    Código de idioma: 'es', 'en', 'pt', etc.
 * @returns {string} Transcripción completa del audio
 */
export async function transcribir(audioUrl, idioma = 'es') {
  // Descargar el audio desde la URL del CDN
  const audioResponse = await fetch(audioUrl)
  if (!audioResponse.ok) {
    throw new Error(`Error al descargar audio: ${audioResponse.status}`)
  }

  const audioBuffer = await audioResponse.arrayBuffer()
  const audioFile   = new File([audioBuffer], 'audio.mp3', { type: 'audio/mpeg' })

  const transcripcion = await openai.audio.transcriptions.create({
    file:     audioFile,
    model:    'whisper-1',
    language: idioma === 'otro' ? undefined : idioma, // auto-detect si es 'otro'
    response_format: 'text',
  })

  if (!transcripcion || transcripcion.trim().length < 10) {
    throw new Error('Whisper no pudo transcribir el audio (resultado vacío o muy corto)')
  }

  return transcripcion.trim()
}
