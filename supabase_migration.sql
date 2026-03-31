-- Run this in your Supabase SQL editor
-- Tracks total free questions used across ALL certs per user

CREATE TABLE IF NOT EXISTS free_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  questions_answered INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE free_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own usage" ON free_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON free_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON free_usage
  FOR UPDATE USING (auth.uid() = user_id);
