// ============================================================
// EXTRACTOR — Social Download All In One (RapidAPI)
// Devuelve la URL del audio MP3 y metadata del video
// ============================================================

const RAPIDAPI_HOST = 'social-download-all-in-one.p.rapidapi.com'
const RAPIDAPI_URL  = `https://${RAPIDAPI_HOST}/v1/social/autolink`

/**
 * @param {string} url  URL del video (TikTok, Reels, YouTube Shorts)
 * @returns {{ audioUrl: string, duracion: number, titulo: string, thumbnail: string, plataforma: string }}
 */
export async function extraerAudio(url) {
  const response = await fetch(RAPIDAPI_URL, {
    method: 'POST',
    headers: {
      'Content-Type':    'application/json',
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key':  process.env.RAPIDAPI_KEY,
    },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    throw new Error(`Social Download API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(`Social Download API devolvió error para la URL: ${url}`)
  }

  // Buscar el media de tipo audio
  const audioMedia = data.medias?.find(m => m.type === 'audio')
  // Buscar el media de tipo video (como fallback si el audio falla)
  const videoMedia = data.medias?.find(m => m.type === 'video' && m.quality === 'hd') || 
                     data.medias?.find(m => m.type === 'video')

  if (!audioMedia?.url && !videoMedia?.url) {
    throw new Error('La API no devolvió un archivo de audio o video para esta URL')
  }

  return {
    audioUrl:   audioMedia?.url || videoMedia?.url,
    videoUrl:   videoMedia?.url || null,
    duracion:   data.duration   ?? null,
    titulo:     data.title      ?? null,
    thumbnail:  data.thumbnail  ?? null,
    plataforma: detectarPlataforma(url),
  }
}

function detectarPlataforma(url) {
  if (url.includes('tiktok.com'))   return 'tiktok'
  if (url.includes('instagram.com')) return 'reels'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'shorts'
  return 'tiktok' // fallback
}
