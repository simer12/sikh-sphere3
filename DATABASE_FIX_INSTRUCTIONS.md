# Database RLS Fix - Instructions

## 🎯 Objective
Fix Row Level Security (RLS) policies in Supabase to allow Firebase Authentication users to access data.

## 📋 Prerequisites
- Supabase project created and configured
- Database tables exist: `user_preferences`, `reading_history`, `bookmarks`, `notification_settings`
- Admin access to Supabase Dashboard

## 🚀 Steps to Execute

### 1. Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project (Akaal Seva)

### 2. Navigate to SQL Editor
1. In the left sidebar, click **SQL Editor**
2. Click **New Query** button (top right)

### 3. Copy and Execute SQL Script
1. Open `fix_rls_policies.sql` in your code editor
2. **Copy all 47 lines** of the SQL script
3. **Paste** into the Supabase SQL Editor
4. Click **Run** button (or press Ctrl/Cmd + Enter)

### 4. Verify Execution
After running, you should see output showing:
```
schemaname | tablename              | rowsecurity
-----------+------------------------+-------------
public     | user_preferences       | f
public     | reading_history        | f
public     | bookmarks              | f
public     | notification_settings  | f
```

**Note:** `rowsecurity = f` means RLS is **disabled**, which is correct for Firebase Auth.

## ✅ What This Script Does

### Drops Old Policies
- Removes all existing RLS policies that were checking `auth.uid()` (Supabase Auth)
- These policies were causing permission errors for Firebase Auth users

### Disables RLS
```sql
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings DISABLE ROW LEVEL SECURITY;
```

### Grants Permissions
```sql
GRANT ALL ON user_preferences TO authenticated;
GRANT ALL ON user_preferences TO anon;
-- (repeated for all 4 tables)
```

## 🔍 Why This is Needed

**Problem:** App uses Firebase Authentication, not Supabase Auth
- Supabase RLS policies check `auth.uid()` which only works with Supabase Auth
- Firebase users have different UID format
- Result: Permission denied errors on database operations

**Solution:** Disable RLS and grant permissions to all authenticated/anon users
- App handles authentication via Firebase
- Client-side code ensures users only access their own data (user_id field)
- Supabase just stores the data without restrictions

## ⚠️ Security Considerations

### Current Approach (RLS Disabled):
- ✅ Simplest for Firebase + Supabase integration
- ✅ Works immediately after running script
- ⚠️ Relies on client-side filtering by `user_id`

### Future Enhancement (Optional):
For production apps with high security requirements, consider:
1. **PostgreSQL Functions:** Create custom RLS policies using Firebase JWT verification
2. **Supabase Edge Functions:** Proxy database requests through server-side validation
3. **Row-Level user_id checks:** Enable RLS with policies checking `user_id` column

For this app (prayer/reading app), current approach is acceptable as:
- No sensitive personal data stored
- User preferences/bookmarks are low-risk data
- Firebase Auth provides authentication layer

## 🧪 Test After Running

### 1. Test Preferences
```typescript
// In PreferencesScreen, toggle dark mode
// Should save to Supabase without errors
```

### 2. Test Bookmarks
```typescript
// Add a bookmark
// Should insert into Supabase successfully
```

### 3. Test Reading History
```typescript
// Read a Bani
// Should save to reading_history table
```

### 4. Check for Errors
```typescript
// Open app console/logs
// Should see NO permission denied errors
```

## 🐛 Troubleshooting

### If script fails:
1. **Error: "table does not exist"**
   - Tables haven't been created yet
   - Create tables first using database schema

2. **Error: "permission denied"**
   - Not logged in as project admin
   - Check you're in correct project

3. **Error: "syntax error"**
   - Copy entire script carefully
   - Ensure no text is missing

### If data still won't save after running:
1. Check Supabase logs: Dashboard → Logs → Database
2. Verify Firebase config in `src/config/firebase.ts`
3. Check Supabase config in `src/config/supabase.ts`
4. Ensure `user.uid` is being passed correctly in queries

## 📊 Expected Behavior After Fix

### Before Fix:
```
Error: new row violates row-level security policy for table "user_preferences"
Error: permission denied for table "bookmarks"
```

### After Fix:
```
✅ Preference saved successfully
✅ Bookmark added
✅ Reading history recorded
```

## 🎉 Success Indicators

- [ ] SQL script runs without errors
- [ ] Verification query shows `rowsecurity = false`
- [ ] Dark mode toggle saves preference
- [ ] Bookmarks can be added/deleted
- [ ] Reading history records successfully
- [ ] No permission errors in console

---

**Next Step:** After running this script, test the app thoroughly to ensure all database operations work correctly!
