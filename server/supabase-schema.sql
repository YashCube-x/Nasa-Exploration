-- ============================================
-- CosmicMail — Supabase Schema
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  age INTEGER CHECK (age IS NULL OR age > 0),
  email TEXT UNIQUE NOT NULL,
  interests TEXT[] DEFAULT '{}',
  consent BOOLEAN NOT NULL DEFAULT true,
  double_optin_verified BOOLEAN DEFAULT false,
  verification_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'lovable',
  ip_address TEXT,
  unsubscribed_at TIMESTAMPTZ
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);

-- Enable Row Level Security (RLS)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from the anonymous key (for the subscription form)
CREATE POLICY "Allow anonymous inserts" ON subscribers
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow reads only via service role (for admin dashboard)
CREATE POLICY "Allow service role reads" ON subscribers
  FOR SELECT
  USING (auth.role() = 'service_role');
