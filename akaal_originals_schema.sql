-- Akaal Originals Video Library Schema
-- Run this query in your Supabase SQL Editor to set up Seasons and Episodes tables

-- 1. Create Seasons Table
CREATE TABLE IF NOT EXISTS public.akaal_seasons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  season_number INTEGER NOT NULL,
  thumbnail_url TEXT NOT NULL,
  trailer_youtube_url TEXT DEFAULT '',
  featured BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS on Seasons
ALTER TABLE public.akaal_seasons DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.akaal_seasons TO authenticated;
GRANT ALL ON public.akaal_seasons TO anon;

-- 2. Create Episodes Table
CREATE TABLE IF NOT EXISTS public.akaal_episodes (
  id TEXT PRIMARY KEY,
  season_id TEXT REFERENCES public.akaal_seasons(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  youtube_url TEXT NOT NULL,
  youtube_video_id TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  important_people TEXT[] DEFAULT '{}',
  locations TEXT[] DEFAULT '{}',
  timeline_label TEXT DEFAULT '',
  source_references TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'history',
  featured BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on season_id
CREATE INDEX IF NOT EXISTS idx_akaal_episodes_season_id ON public.akaal_episodes(season_id);

-- Disable RLS on Episodes
ALTER TABLE public.akaal_episodes DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.akaal_episodes TO authenticated;
GRANT ALL ON public.akaal_episodes TO anon;

-- 3. Triggers for updated_at
DROP TRIGGER IF EXISTS update_akaal_seasons_updated_at ON public.akaal_seasons;
CREATE TRIGGER update_akaal_seasons_updated_at BEFORE UPDATE ON public.akaal_seasons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_akaal_episodes_updated_at ON public.akaal_episodes;
CREATE TRIGGER update_akaal_episodes_updated_at BEFORE UPDATE ON public.akaal_episodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Seed Data (Default Library)
-- Insert Seasons
INSERT INTO public.akaal_seasons (id, title, subtitle, description, season_number, thumbnail_url, trailer_youtube_url, featured, trending, published)
VALUES
('season-1', 'Sikh History: Foundations', 'Guru Nanak Dev Ji to early Sikh institutions', 'A cinematic learning path through the roots of Sikh history, teachings, and early community formation.', 1, 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', TRUE, FALSE, TRUE),
('season-2', 'The Khalsa Era', 'Courage, sacrifice, and sovereignty', 'Episodes focused on Guru Gobind Singh Ji, the creation of the Khalsa, and defining moments of Sikh resilience.', 2, 'https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg', 'https://www.youtube.com/watch?v=ysz5S6PUM-U', FALSE, TRUE, TRUE),
('season-3', 'Battles And Turning Points', 'Chamkaur, Muktsar, Anandpur Sahib', 'A focused series on major Sikh battles, important people, locations, and historical impact.', 3, 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg', 'https://www.youtube.com/watch?v=jNQXAC9IVRw', FALSE, TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  season_number = EXCLUDED.season_number,
  thumbnail_url = EXCLUDED.thumbnail_url,
  trailer_youtube_url = EXCLUDED.trailer_youtube_url,
  featured = EXCLUDED.featured,
  trending = EXCLUDED.trending,
  published = EXCLUDED.published;

-- Insert Episodes
INSERT INTO public.akaal_episodes (id, season_id, episode_number, title, description, youtube_url, youtube_video_id, thumbnail_url, duration_minutes, important_people, locations, timeline_label, source_references, tags, category, featured, trending, published)
VALUES
(
  'episode-18', 'season-2', 18, 
  'The Road To Anandpur Sahib', 
  'The political and spiritual setting that shaped the years before the Khalsa was revealed.', 
  'https://www.youtube.com/watch?v=ysz5S6PUM-U', 'ysz5S6PUM-U', 
  'https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg', 46, 
  ARRAY['Guru Gobind Singh Ji', 'Bhai Nand Lal Ji'], 
  ARRAY['Anandpur Sahib', 'Punjab'], 
  'Late 1600s', 
  ARRAY['Sikh historical tradition', 'Panth Prakash references'], 
  ARRAY['Khalsa', 'Anandpur Sahib', 'Guru Gobind Singh Ji'], 
  'history', TRUE, FALSE, TRUE
),
(
  'episode-27', 'season-3', 27, 
  'The Battle of Chamkaur', 
  'A respectful retelling of the Battle of Chamkaur, its people, location, and enduring meaning.', 
  'https://www.youtube.com/watch?v=jNQXAC9IVRw', 'jNQXAC9IVRw', 
  'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg', 52, 
  ARRAY['Guru Gobind Singh Ji', 'Baba Ajit Singh Ji', 'Baba Jujhar Singh Ji'], 
  ARRAY['Chamkaur Sahib'], 
  '1704', 
  ARRAY['Historical accounts of Chamkaur', 'Sikh tradition'], 
  ARRAY['Battle', 'Chamkaur', 'Sahibzade'], 
  'battle', TRUE, TRUE, TRUE
),
(
  'episode-28', 'season-3', 28, 
  'After Chamkaur', 
  'What happened after Chamkaur and how the events shaped the next phase of Sikh history.', 
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 
  'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', 39, 
  ARRAY['Guru Gobind Singh Ji', 'Mai Bhago Ji'], 
  ARRAY['Machhiwara', 'Muktsar'], 
  '1704-1705', 
  ARRAY['Sikh historical tradition'], 
  ARRAY['Timeline', 'Chamkaur', 'Muktsar'], 
  'timeline', FALSE, TRUE, TRUE
),
(
  'episode-1', 'season-1', 1, 
  'Guru Nanak Dev Ji: The Beginning', 
  'An introduction to Guru Nanak Dev Ji and the spiritual foundation of Sikh history.', 
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 
  'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', 34, 
  ARRAY['Guru Nanak Dev Ji', 'Bhai Mardana Ji'], 
  ARRAY['Nankana Sahib', 'Sultanpur Lodhi'], 
  '1469 onward', 
  ARRAY['Janamsakhi tradition', 'Sikh historical sources'], 
  ARRAY['Guru Nanak Dev Ji', 'Foundations', 'Biography'], 
  'biography', FALSE, FALSE, TRUE
)
ON CONFLICT (id) DO UPDATE SET
  season_id = EXCLUDED.season_id,
  episode_number = EXCLUDED.episode_number,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_video_id = EXCLUDED.youtube_video_id,
  thumbnail_url = EXCLUDED.thumbnail_url,
  duration_minutes = EXCLUDED.duration_minutes,
  important_people = EXCLUDED.important_people,
  locations = EXCLUDED.locations,
  timeline_label = EXCLUDED.timeline_label,
  source_references = EXCLUDED.source_references,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  featured = EXCLUDED.featured,
  trending = EXCLUDED.trending,
  published = EXCLUDED.published;

-- 5. Create Watch Progress Table (To sync across devices)
CREATE TABLE IF NOT EXISTS public.akaal_episode_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  episode_id TEXT REFERENCES public.akaal_episodes(id) ON DELETE CASCADE,
  watched_seconds INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, episode_id)
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_akaal_episode_progress_user_id ON public.akaal_episode_progress(user_id);

-- Disable RLS on Watch Progress for authenticated/anonymous roles
ALTER TABLE public.akaal_episode_progress DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.akaal_episode_progress TO authenticated;
GRANT ALL ON public.akaal_episode_progress TO anon;

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_akaal_episode_progress_updated_at ON public.akaal_episode_progress;
CREATE TRIGGER update_akaal_episode_progress_updated_at BEFORE UPDATE ON public.akaal_episode_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
