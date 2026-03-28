// ============================================================
// EMBEDDINGS — text-embedding-3-small
// Genera el vector semántico para búsqueda con pgvector
// ============================================================
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Genera el vector de embedding para un guion.
 * Vectorizamos un texto compuesto para capturar tanto el
 * contenido como los patrones estructurales del video.
 *
 * @param {string} transcript      Transcripción completa
 * @param {object} analisis        JSON validado de GPT-4o
 * @returns {number[]}             Vector de 1536 dimensiones
 */
export async function generarEmbedding(transcript, analisis) {
  // Construir el texto a vectorizar combinando campos clave
  // Esto hace que la búsqueda semántica encuentre videos similares
  // en CONTENIDO y en ESTRUCTURA (no solo en palabras)
  const textoParaVectorizar = [
    `Tema: ${analisis.tema_principal}`,
    `Ángulo: ${analisis.angulo_unico}`,
    `Estructura: ${analisis.estructura_narrativa}`,
    `Gancho: ${analisis.gancho_texto}`,
    `Conflicto: ${analisis.conflicto_central}`,
    `Trigger emocional: ${analisis.trigger_emocional}`,
    `Promesa: ${analisis.promesa_explicita}`,
    `Patrón: ${analisis.resumen_patron}`,
    `Transcript: ${transcript.slice(0, 1000)}`, // primeros 1000 chars
  ].join('\n')

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: textoParaVectorizar,
  })

  return response.data[0].embedding
}
