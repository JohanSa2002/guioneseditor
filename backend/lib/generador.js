// ============================================================
// GENERADOR — GPT-4o
// Crea guiones originales a partir de patrones analizados
// ============================================================
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const PROMPT_SISTEMA = `Eres un copywriter experto en video corto viral (TikTok, Reels, YouTube Shorts).
Tu especialidad es crear guiones que combinan storytelling, psicología de la persuasión y neuromarketing.
Generas guiones originales, concretos y listos para grabar — nunca genéricos ni corporativos.
SOLO devuelve el JSON pedido, sin texto adicional, sin markdown, sin explicaciones.`

/**
 * Genera un guion nuevo a partir de patrones de referencia
 * @param {object} params  Parámetros de generación
 * @param {Array}  patrones  Guiones de referencia del mismo niche
 * @returns {object}  Guion generado con estructura completa
 */
export async function generarGuion(params, patrones = []) {
  const {
    niche,
    tema,
    audiencia,
    plataforma,
    duracion_objetivo,
    tono,
    objetivo,
    estructura,
    instrucciones_extra = '',
  } = params

  // Construir contexto de patrones ganadores
  const contextPatrones = patrones.length > 0
    ? patrones.map((p, i) => `
REFERENCIA ${i + 1} (Score viralidad: ${p.score_virabilidad}/100):
- Estructura: ${p.estructura_narrativa} | Gancho tipo: ${p.gancho_tipo}
- Técnica de retención: ${p.tecnica_retencion || 'no especificada'}
- Trigger emocional: ${p.trigger_emocional} | Intensidad: ${p.intensidad_emocional}/10
- Cialdini activos: ${[
    p.cialdini_reciprocidad && 'Reciprocidad',
    p.cialdini_escasez && 'Escasez',
    p.cialdini_autoridad && 'Autoridad',
    p.cialdini_consistencia && 'Consistencia',
    p.cialdini_prueba_social && 'Prueba Social',
    p.cialdini_simpatia && 'Simpatía',
    p.cialdini_unidad && 'Unidad',
  ].filter(Boolean).join(', ') || 'ninguno'}
- Ingredientes clave: ${(p.ingredientes_clave || []).join(' / ')}
- Patrón ganador: ${p.resumen_patron}
- Apertura que usó: "${p.apertura_exacta || p.gancho_texto}"
`).join('\n')
    : 'No se proporcionaron referencias — crea según las mejores prácticas del nicho.'

  const promptUsuario = `Crea un guion de video para ${plataforma} sobre "${tema}" en el nicho "${niche}".

PARÁMETROS:
- Audiencia objetivo: ${audiencia}
- Duración objetivo: ${duracion_objetivo} segundos
- Tono: ${tono}
- Objetivo principal: ${objetivo}
- Estructura narrativa a usar: ${estructura}
${instrucciones_extra ? `- Instrucciones adicionales: ${instrucciones_extra}` : ''}

PATRONES DE ALTO RENDIMIENTO DEL MISMO NICHE (úsalos como inspiración, NO los copies):
${contextPatrones}

Genera el guion con EXACTAMENTE este JSON:

{
  "gancho": "<texto del gancho, las primeras 1-3 oraciones que deben capturar la atención en los primeros 3 segundos>",
  "desarrollo": "<el cuerpo del guion completo, párrafo a párrafo, en el tono y estructura indicados>",
  "cta": "<el call to action final, específico y claro>",
  "guion_completo": "<el guion completo de corrido: gancho + desarrollo + cta, listo para leer al grabar>",
  "duracion_estimada_seg": <número entero estimado de segundos si se narra a ritmo normal>,
  "titulo_sugerido": "<un título para este guion, máximo 8 palabras>",
  "tecnicas_aplicadas": ["<técnica 1>", "<técnica 2>", "<técnica 3>"],
  "notas_produccion": "<2-3 recomendaciones específicas para grabar este video: cámara, edición, música, etc.>",
  "variantes_gancho": ["<versión alternativa del gancho 1>", "<versión alternativa del gancho 2>"],
  "score_estimado": <número entero del 1 al 100 estimando el potencial de viralidad de este guion>
}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.7,
    messages: [
      { role: 'system', content: PROMPT_SISTEMA },
      { role: 'user',   content: promptUsuario },
    ],
  })

  const contenido = completion.choices[0]?.message?.content?.trim()
  if (!contenido) throw new Error('GPT-4o devolvió una respuesta vacía')

  const jsonLimpio = contenido
    .replace(/^```json\n?/, '')
    .replace(/^```\n?/, '')
    .replace(/\n?```$/, '')
    .trim()

  try {
    return JSON.parse(jsonLimpio)
  } catch (err) {
    throw new Error(`Error parseando JSON de GPT: ${err.message}. Contenido crudo: ${contenido}`)
  }
}
