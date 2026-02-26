-- Database Schema for Profile Features
-- Run these SQL commands in your Supabase SQL Editor

-- 1. User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL,
  font_size INTEGER DEFAULT 16,
  dark_mode BOOLEAN DEFAULT FALSE,
  language TEXT DEFAULT 'en',
  notifications BOOLEAN DEFAULT TRUE,
  auto_play BOOLEAN DEFAULT FALSE,
  download_on_wifi BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable Row Level Security (using Firebase Auth, not Supabase Auth)
-- Data access is controlled by Firebase UID in user_id field
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;

-- 2. Reading History Table
CREATE TABLE IF NOT EXISTS reading_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  bani_name TEXT NOT NULL,
  bani_type TEXT NOT NULL,
  duration_seconds INTEGER,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reading_history_user_id ON reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_read_at ON reading_history(read_at DESC);

-- Disable Row Level Security (using Firebase Auth, not Supabase Auth)
-- Data access is controlled by Firebase UID in user_id field
ALTER TABLE reading_history DISABLE ROW LEVEL SECURITY;

-- 3. Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  bani_name TEXT NOT NULL,
  bani_type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

-- Disable Row Level Security (using Firebase Auth, not Supabase Auth)
-- Data access is controlled by Firebase UID in user_id field
ALTER TABLE bookmarks DISABLE ROW LEVEL SECURITY;

-- 4. Notification Settings Table
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  daily_hukamnama BOOLEAN DEFAULT TRUE,
  hukamnama_time TEXT DEFAULT '06:00',
  nitnem_reminder BOOLEAN DEFAULT TRUE,
  nitnem_times JSONB DEFAULT '{"morning": true, "evening": true, "night": true}'::jsonb,
  gurpurab_reminder BOOLEAN DEFAULT TRUE,
  weekly_progress BOOLEAN DEFAULT FALSE,
  new_content BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable Row Level Security (using Firebase Auth, not Supabase Auth)
-- Data access is controlled by Firebase UID in user_id field
ALTER TABLE notification_settings DISABLE ROW LEVEL SECURITY;

-- 5. Update existing user_data table to add stats columns (if needed)
ALTER TABLE user_data 
ADD COLUMN IF NOT EXISTS bani_reading_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS banis_read TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS bookmarked_banis TEXT[] DEFAULT '{}';

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookmarks_updated_at BEFORE UPDATE ON bookmarks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON user_preferences TO authenticated;
GRANT ALL ON reading_history TO authenticated;
GRANT ALL ON bookmarks TO authenticated;
GRANT ALL ON notification_settings TO authenticated;

-- Verification queries (run these to check tables were created)
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('user_preferences', 'reading_history', 'bookmarks', 'notification_settings');
