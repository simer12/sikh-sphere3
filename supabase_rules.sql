-- ==========================================
-- Supabase Row Level Security (RLS) Policies
-- Run this script in your Supabase SQL Editor.
-- ==========================================

-- ------------------------------------------
-- 1. Table: user_data
-- ------------------------------------------
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_own_profile ON user_data;
CREATE POLICY select_own_profile ON user_data 
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS insert_own_profile ON user_data;
CREATE POLICY insert_own_profile ON user_data 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS update_own_profile ON user_data;
CREATE POLICY update_own_profile ON user_data 
  FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);


-- ------------------------------------------
-- 2. Table: bookmarks
-- ------------------------------------------
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_own_bookmarks ON bookmarks;
CREATE POLICY select_own_bookmarks ON bookmarks 
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS insert_own_bookmarks ON bookmarks;
CREATE POLICY insert_own_bookmarks ON bookmarks 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS delete_own_bookmarks ON bookmarks;
CREATE POLICY delete_own_bookmarks ON bookmarks 
  FOR DELETE TO authenticated 
  USING (auth.uid() = user_id);


-- ------------------------------------------
-- 3. Table: reading_history
-- ------------------------------------------
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_own_history ON reading_history;
CREATE POLICY select_own_history ON reading_history 
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS insert_own_history ON reading_history;
CREATE POLICY insert_own_history ON reading_history 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);


-- ------------------------------------------
-- 4. Table: akaal_episode_progress
-- ------------------------------------------
ALTER TABLE akaal_episode_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_own_progress ON akaal_episode_progress;
CREATE POLICY select_own_progress ON akaal_episode_progress 
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS insert_own_progress ON akaal_episode_progress;
CREATE POLICY insert_own_progress ON akaal_episode_progress 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS update_own_progress ON akaal_episode_progress;
CREATE POLICY update_own_progress ON akaal_episode_progress 
  FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);
