-- =======================================================
-- Database Scaling Indexes for 1 Million Active Users
-- Run this script in your Supabase SQL Editor.
-- =======================================================

-- 1. Table: user_data
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);

-- 2. Table: bookmarks
-- Optimize fetching of user's bookmarks sorted by date
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id_created ON bookmarks(user_id, created_at DESC);

-- 3. Table: reading_history
-- Optimize fetching of user's history logs sorted by read date
CREATE INDEX IF NOT EXISTS idx_reading_history_user_id_read ON reading_history(user_id, read_at DESC);

-- 4. Table: akaal_episode_progress
-- Optimize looking up progress of specific episodes for a user
CREATE INDEX IF NOT EXISTS idx_akaal_episode_progress_lookup ON akaal_episode_progress(user_id, episode_id);
