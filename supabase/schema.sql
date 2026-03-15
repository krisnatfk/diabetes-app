-- ============================================
-- Supabase SQL Schema: predictions table
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query)

CREATE TABLE IF NOT EXISTS predictions (
  id BIGSERIAL PRIMARY KEY,
  gender TEXT NOT NULL,
  age DOUBLE PRECISION NOT NULL,
  hypertension INTEGER NOT NULL DEFAULT 0,
  heart_disease INTEGER NOT NULL DEFAULT 0,
  smoking_history TEXT NOT NULL,
  bmi DOUBLE PRECISION NOT NULL,
  "HbA1c_level" DOUBLE PRECISION NOT NULL,
  blood_glucose_level DOUBLE PRECISION NOT NULL,
  prediction TEXT NOT NULL,
  probability DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts and selects (for the anon key)
CREATE POLICY "Allow anonymous insert" ON predictions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON predictions
  FOR SELECT USING (true);
