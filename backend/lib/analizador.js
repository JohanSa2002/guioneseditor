// ============================================================
// ANALIZADOR — GPT-4o
// Prompt maestro multidisciplinario: Storytelling + Cialdini
// + Neuropublicidad + Copywriting → JSON de 49 campos
// ============================================================
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const PROMPT_SISTEMA = `Eres un experto en ingeniería de guiones para video corto (TikTok, Reels, YouTube Shorts) con especialización en:
- Storytelling y estructura narrativa
- Psicología de la persuasión (Cialdini, sesgos cognitivos)
- Neuropublicidad y neuromarketing
- Copywriting directo (Eugene Schwartz, Gary Halbert, David Ogilvy)
- Marketing de contenidos para múltiples nichos

Tu tarea es analizar la transcripción de un video y devolver un JSON con el análisis completo.
SOLO devuelve el JSON, sin texto adicional, sin markdown, sin explicaciones.`

/**
 * @param {string} transcript     Texto transcrito por Whisper
 * @param {string} niche          Nicho del video (ej: "fitness", "finanzas")
 * @param {string} plataforma     tiktok | reels | shorts
 * @param {number} duracion       Duración en segundos
 * @param {string} contextoVideo  Contexto adicional opcional sobre el video
 * @returns {object} JSON con todos los campos de análisis
 */
export async function analizarTranscript(transcript, niche, plataforma, duracion, contextoVideo = '') {
  const bloqueContexto = contextoVideo
    ? `CONTEXTO ADICIONAL DEL VIDEO (úsalo para enriquecer el análisis):\n"""\n${contextoVideo}\n"""\n\n`
    : ''

  const promptUsuario = `Analiza este video de ${plataforma} de ${duracion} segundos del nicho "${niche}".

${bloqueContexto}TRANSCRIPCIÓN:
"""
${transcript}
"""

Devuelve EXACTAMENTE este JSON con los valores que correspondan:

{
  "estructura_narrativa": "<AIDA|PAS|hero_journey|storybrand|antes_despues|otra>",
  "gancho_tipo": "<pregunta|declaracion_shock|dato_estadistica|historia|controversia|promesa_directa>",
  "gancho_texto": "<primeras 5-8 palabras del video>",
  "apertura_exacta": "<copia EXACTAMENTE las primeras 15 palabras del video tal como aparecen en la transcripción>",
  "cierre_exacto": "<copia EXACTAMENTE las últimas 10 palabras del video tal como aparecen en la transcripción>",
  "gancho_duracion_seg": <número entero estimado>,
  "desarrollo_tipo": "<problema_solucion|lista|demostracion|testimonio|tutorial|storytelling_puro>",
  "cta_tipo": "<seguir|comentar|compartir|comprar|visitar_link|guardar|ninguno>",
  "cta_texto": "<texto exacto del call to action, o null si no hay>",
  "arco_emocional": "<emoción inicial> → <emoción media> → <emoción final>",
  "conflicto_central": "<el problema o tensión principal que articula el video>",
  "resolucion": "<cómo se resuelve o qué promete resolver>",
  "pacing_ritmo": "<lento|medio|rapido|variable>",
  "numero_actos": <1, 2 o 3>,
  "tecnica_retencion": "<open_loop|cliffhanger|curiosity_gap|countdown|pregunta_abierta|ninguna>",
  "momento_pico_seg": <segundo estimado donde ocurre el pico emocional o de mayor tensión del video>,

  "cialdini_reciprocidad": <true|false>,
  "cialdini_escasez": <true|false>,
  "cialdini_autoridad": <true|false>,
  "cialdini_consistencia": <true|false>,
  "cialdini_prueba_social": <true|false>,
  "cialdini_simpatia": <true|false>,
  "cialdini_unidad": <true|false>,
  "sesgo_cognitivo": "<nombre del sesgo cognitivo principal, ej: FOMO, Efecto Halo, Anclaje, Prueba Social, Reciprocidad, o null>",
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
  "ratio_emocion_logica": "<emocional|logico|equilibrado>",

  "tema_principal": "<tema en 1-3 palabras>",
  "angulo_unico": "<qué diferencia a este video de otros del mismo tema, en 1 oración>",
  "palabras_clave": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"],
  "tono": "<educativo|entretenimiento|inspiracional|controversial|informativo|humoristico>",
  "persona_narradora": "<primera_persona|segunda_persona|tercera_persona|mixta>",
  "promesa_explicita": "<la promesa que hace el video al espectador, en 1 oración>",
  "nivel_especificidad": "<generico|especifico|ultra_especifico>",
  "nivel_consciencia": "<inconsciente|problema_consciente|solucion_consciente|producto_consciente|mas_consciente>",
  "objecion_principal": "<la objeción más probable del espectador que el video anticipa o desmonta, en 1 oración, o null si no hay>",
  "avatar_descripcion": "<describe en 1 oración al perfil de persona a quien está dirigido este video: edad, situación, deseo o dolor principal>",
  "ingredientes_clave": ["<elemento 1 que NO puede faltar si se replica este guion>", "<elemento 2>", "<elemento 3>"],
  "replicabilidad": "<alta|media|baja>",

  "fortalezas": ["<fortaleza 1 del video: qué hace especialmente bien>", "<fortaleza 2>", "<fortaleza 3>"],
  "debilidades": ["<debilidad o área de mejora 1>", "<debilidad 2>"],
  "sugerencias_mejora": ["<sugerencia accionable concreta 1 para mejorar el video>", "<sugerencia 2>", "<sugerencia 3>"],
  "hashtags_sugeridos": ["<hashtag1>", "<hashtag2>", "<hashtag3>", "<hashtag4>", "<hashtag5>", "<hashtag6>", "<hashtag7>"],

  "score_virabilidad": <número entero del 1 al 100>,
  "resumen_patron": "<párrafo de 3-4 oraciones describiendo el patrón ganador de este video: qué hace, por qué funciona psicológicamente y cómo se puede replicar>",
  "conclusion_estrategica": "<síntesis estratégica extensa de aproximadamente 15 líneas que integra TODOS los datos del análisis. Estructura la respuesta así: (1) Veredicto general sobre la efectividad del video y su score de viralidad. (2) Análisis de la estructura narrativa elegida y por qué encaja con el nicho y el avatar objetivo. (3) Qué principios de Cialdini se activaron y cómo interactúan entre sí para generar persuasión. (4) Cómo los elementos de neuromarketing (atención visual, pacing, carga cognitiva, lenguaje sensorial) amplifican el mensaje. (5) Análisis del trigger emocional dominante y el arco emocional: cómo conducen al espectador hacia el CTA. (6) Evaluación del nivel de consciencia del avatar y si la promesa explícita está bien calibrada para ese nivel. (7) Insight estratégico principal: qué hace este video mejor que el promedio de su nicho y por qué es difícil de replicar sin entender su mecánica interna. (8) Veredicto final de replicabilidad y qué elementos son absolutamente críticos conservar en una versión derivada.>"
}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.2,
    messages: [
      { role: 'system', content: PROMPT_SISTEMA },
      { role: 'user',   content: promptUsuario },
    ],
  })

  const contenido = completion.choices[0]?.message?.content?.trim()
  if (!contenido) {
    throw new Error('GPT-4o devolvió una respuesta vacía')
  }

  const jsonLimpio = contenido
    .replace(/^```json\n?/, '')
    .replace(/^```\n?/, '')
    .replace(/\n?```$/, '')
    .trim()

  try {
    return JSON.parse(jsonLimpio)
  } catch {
    throw new Error(`GPT-4o devolvió JSON inválido. Primeros 200 chars: ${jsonLimpio.slice(0, 200)}`)
  }
}
