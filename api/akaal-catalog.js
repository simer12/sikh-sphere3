// ========================================================
// Vercel Serverless Scraper API: Akaal Originals Catalog
// ========================================================

const SUPABASE_REST_URL = 'https://auwahlfkcyqcosakeqoi.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = 'sb_publishable_G6QH_Q1DizqMfZeynUqbIw_3BC4-ADp';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Set Vercel Edge caching headers
  // Cache for 1 hour (3600s), background revalidate up to 10 minutes (600s)
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');

  const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL;

  // LAYER 1: Fetch from Google Sheets if configured
  if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL.startsWith('http')) {
    try {
      console.log('Fetching catalog from Google Sheets:', GOOGLE_SHEETS_URL);
      const googleRes = await fetch(GOOGLE_SHEETS_URL, { signal: AbortSignal.timeout(5000) });
      if (googleRes.ok) {
        const payload = await googleRes.json();
        if (payload.seasons && payload.episodes) {
          return res.status(200).json(payload);
        }
      }
    } catch (e) {
      console.error('Google Sheets fetch failed, falling back to Supabase:', e.message);
    }
  }

  // LAYER 2: Fallback to Supabase REST endpoints
  try {
    console.log('Fetching catalog from Supabase REST endpoints...');
    const [seasonsRes, episodesRes] = await Promise.all([
      fetch(`${SUPABASE_REST_URL}/akaal_seasons?select=*&order=season_number.asc`, {
        headers: { apikey: SUPABASE_ANON_KEY },
        signal: AbortSignal.timeout(5000)
      }),
      fetch(`${SUPABASE_REST_URL}/akaal_episodes?select=*&order=episode_number.asc`, {
        headers: { apikey: SUPABASE_ANON_KEY },
        signal: AbortSignal.timeout(5000)
      })
    ]);

    if (seasonsRes.ok && episodesRes.ok) {
      const dbSeasons = await seasonsRes.json();
      const dbEpisodes = await episodesRes.json();

      // Return raw rows mapped to schema
      return res.status(200).json({
        seasons: dbSeasons,
        episodes: dbEpisodes
      });
    }
  } catch (e) {
    console.error('Supabase REST query failed, returning local static mock fallback:', e.message);
  }

  // LAYER 3: Return hardcoded static fallback
  const now = '2026-07-05T00:00:00.000Z';
  return res.status(200).json({
    seasons: [
      {
        id: 'season-1',
        title: 'Sikh History: Foundations',
        subtitle: 'Guru Nanak Dev Ji to early Sikh institutions',
        description: 'A cinematic learning path through the roots of Sikh history.',
        season_number: 1,
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        trailer_youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        featured: true,
        trending: false,
        published: true,
        created_at: now,
        updated_at: now
      }
    ],
    episodes: [
      {
        id: 'episode-1',
        season_id: 'season-1',
        episode_number: 1,
        title: 'The Divine Call at Sultanpur Lodhi',
        description: 'Guru Nanak Dev Jis three-day immersion in the Bein river.',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtube_video_id: 'dQw4w9WgXcQ',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        duration_minutes: 30,
        important_people: ['Guru Nanak Dev Ji'],
        locations: ['Sultanpur Lodhi'],
        timeline_label: '1499',
        source_references: ['Janamsakhis'],
        tags: ['foundations'],
        category: 'history',
        featured: true,
        trending: false,
        published: true,
        created_at: now,
        updated_at: now
      }
    ]
  });
}
