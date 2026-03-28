// ============================================================
// ANALIZADOR — GPT-4o
// Prompt maestro multidisciplinario: Storytelling + Cialdini
// + Neuropublicidad → JSON de 55 campos analizables
// ============================================================
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const PROMPT_SISTEMA = `Eres un experto en ingeniería de guiones para video corto (TikTok, Reels, YouTube Shorts) con especialización en:
- Storytelling y estructura narrativa
- Psicología de la persuasión (Cialdini, sesgos cognitivos)
- Neuropublicidad y neuromarketing
- Marketing de contenidos para múltiples nichos

Tu tarea es analizar la transcripción de un video y devolver un JSON con el análisis completo.
SOLO devuelve el JSON, sin texto adicional, sin markdown, sin explicaciones.`

/**
 * @param {string} transcript     Texto transcrito por Whisper
 * @param {string} niche          Nicho del video (ej: "fitness", "finanzas")
 * @param {string} plataforma     tiktok | reels | shorts
 * @param {number} duracion       Duración en segundos
 * @returns {object} JSON con todos los campos de análisis
 */
export async function analizarTranscript(transcript, niche, plataforma, duracion) {
  const promptUsuario = `Analiza este video de ${plataforma} de ${duracion} segundos del nicho "${niche}".

TRANSCRIPCIÓN:
"""
${transcript}
"""

Devuelve EXACTAMENTE este JSON con los valores que correspondan:

{
  "estructura_narrativa": "<AIDA|PAS|hero_journey|storybrand|antes_despues|otra>",
  "gancho_tipo": "<pregunta|declaracion_shock|dato_estadistica|historia|controversia|promesa_directa>",
  "gancho_texto": "<primeras 5-8 palabras del video>",
  "gancho_duracion_seg": <número entero estimado>,
  "desarrollo_tipo": "<problema_solucion|lista|demostracion|testimonio|tutorial|storytelling_puro>",
  "cta_tipo": "<seguir|comentar|compartir|comprar|visitar_link|guardar|ninguno>",
  "cta_texto": "<texto exacto del call to action, o null si no hay>",
  "arco_emocional": "<emoción inicial> → <emoción media> → <emoción final>",
  "conflicto_central": "<el problema o tensión principal que articula el video>",
  "resolucion": "<cómo se resuelve o qué promete resolver>",
  "pacing_ritmo": "<lento|medio|rapido|variable>",
  "numero_actos": <1, 2 o 3>,

  "cialdini_reciprocidad": <true|false>,
  "cialdini_escasez": <true|false>,
  "cialdini_autoridad": <true|false>,
  "cialdini_consistencia": <true|false>,
  "cialdini_prueba_social": <true|false>,
  "cialdini_simpatia": <true|false>,
  "cialdini_unidad": <true|false>,
  "sesgo_cognitivo": "<nombre del sesgo cognitivo principal, o null>",
  "trigger_emocional": "<miedo|esperanza|curiosidad|ira|orgullo|tristeza|sorpresa|humor>",
  "intensidad_emocional": <número entero del 1 al 10>,

  "atencion_visual": "<zoom_agresivo|corte_rapido|texto_pantalla|cara_camara|broll_dinamico|ninguno>",
  "lenguaje_sensorial": <true|false>,
  "contraste_narrativo": <true|false>,
  "efecto_novedad": <true|false>,
  "dolor_placer": "<apela_dolor|apela_placer|ambos>",
  "personalizacion": <true|false>,
  "carga_cognitiva": "<baja|media|alta>",
  "velocidad_locucion": "<lenta|normal|rapida|muy_rapida>",
  "uso_musica": <true|false>,
  "micro_compromisos": <true|false>,

  "tema_principal": "<tema en 1-3 palabras>",
  "angulo_unico": "<qué diferencia a este video de otros del mismo tema, en 1 oración>",
  "palabras_clave": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"],
  "tono": "<educativo|entretenimiento|inspiracional|controversial|informativo|humoristico>",
  "persona_narradora": "<primera_persona|segunda_persona|tercera_persona|mixta>",
  "promesa_explicita": "<la promesa que hace el video al espectador, en 1 oración>",
  "nivel_especificidad": "<generico|especifico|ultra_especifico>",

  "score_virabilidad": <número entero del 1 al 100>,
  "resumen_patron": "<párrafo de 2-3 oraciones describiendo el patrón ganador de este video>"
}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.2, // baja temperatura para análisis consistente
    messages: [
      { role: 'system', content: PROMPT_SISTEMA },
      { role: 'user',   content: promptUsuario },
    ],
  })

  const contenido = completion.choices[0]?.message?.content?.trim()
  if (!contenido) {
    throw new Error('GPT-4o devolvió una respuesta vacía')
  }

  // Limpiar posible markdown que GPT-4o a veces añade
  const jsonLimpio = contenido
    .replace(/^```json\n?/, '')
    .replace(/^```\n?/, '')
    .replace(/\n?```$/, '')
    .trim()

  return JSON.parse(jsonLimpio)
}
