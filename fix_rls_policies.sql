-- Fix RLS Policies for Firebase Authentication
-- Run this in Supabase SQL Editor to fix the permission errors

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;

DROP POLICY IF EXISTS "Users can view own history" ON reading_history;
DROP POLICY IF EXISTS "Users can insert own history" ON reading_history;
DROP POLICY IF EXISTS "Users can delete own history" ON reading_history;

DROP POLICY IF EXISTS "Users can view own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can insert own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can update own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON bookmarks;

DROP POLICY IF EXISTS "Users can view own notification settings" ON notification_settings;
DROP POLICY IF EXISTS "Users can insert own notification settings" ON notification_settings;
DROP POLICY IF EXISTS "Users can update own notification settings" ON notification_settings;

-- Disable RLS on all tables (we use Firebase Auth, not Supabase Auth)
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings DISABLE ROW LEVEL SECURITY;

-- Ensure permissions are granted
GRANT ALL ON user_preferences TO authenticated;
GRANT ALL ON user_preferences TO anon;
GRANT ALL ON reading_history TO authenticated;
GRANT ALL ON reading_history TO anon;
GRANT ALL ON bookmarks TO authenticated;
GRANT ALL ON bookmarks TO anon;
GRANT ALL ON notification_settings TO authenticated;
GRANT ALL ON notification_settings TO anon;

-- Verification: Check if RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE tablename IN ('user_preferences', 'reading_history', 'bookmarks', 'notification_settings');

-- Should show rowsecurity = false for all tables
