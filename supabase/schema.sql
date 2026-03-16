-- ============================================
-- Supabase SQL Schema: predictions table
-- Comprehensive Diabetes Screening (28 features)
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New Query)
--
-- WARNING: This will DROP the old predictions table!
-- Back up your data before running this.

DROP TABLE IF EXISTS predictions;

CREATE TABLE predictions (
  id BIGSERIAL PRIMARY KEY,

  -- Step 1: Demographics
  "Age" DOUBLE PRECISION NOT NULL,
  "Gender" INTEGER NOT NULL DEFAULT 0,
  "Ethnicity" INTEGER NOT NULL DEFAULT 0,
  "BMI" DOUBLE PRECISION NOT NULL,

  -- Step 2: Medical History
  "FamilyHistoryDiabetes" INTEGER NOT NULL DEFAULT 0,
  "PreviousPreDiabetes" INTEGER NOT NULL DEFAULT 0,
  "GestationalDiabetes" INTEGER NOT NULL DEFAULT 0,
  "Hypertension" INTEGER NOT NULL DEFAULT 0,
  "PolycysticOvarySyndrome" INTEGER NOT NULL DEFAULT 0,

  -- Step 3: Clinical Data
  "HbA1c" DOUBLE PRECISION NOT NULL,
  "FastingBloodSugar" DOUBLE PRECISION NOT NULL,
  "SystolicBP" INTEGER NOT NULL DEFAULT 120,
  "DiastolicBP" INTEGER NOT NULL DEFAULT 80,
  "CholesterolTotal" DOUBLE PRECISION NOT NULL DEFAULT 200,
  "CholesterolLDL" DOUBLE PRECISION NOT NULL DEFAULT 100,
  "CholesterolHDL" DOUBLE PRECISION NOT NULL DEFAULT 50,
  "CholesterolTriglycerides" DOUBLE PRECISION NOT NULL DEFAULT 150,

  -- Step 4: Lifestyle
  "Smoking" INTEGER NOT NULL DEFAULT 0,
  "AlcoholConsumption" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "PhysicalActivity" DOUBLE PRECISION NOT NULL DEFAULT 5,
  "DietQuality" DOUBLE PRECISION NOT NULL DEFAULT 5,
  "SleepQuality" DOUBLE PRECISION NOT NULL DEFAULT 7,

  -- Step 5: Symptoms
  "FrequentUrination" INTEGER NOT NULL DEFAULT 0,
  "ExcessiveThirst" INTEGER NOT NULL DEFAULT 0,
  "UnexplainedWeightLoss" INTEGER NOT NULL DEFAULT 0,
  "FatigueLevels" DOUBLE PRECISION NOT NULL DEFAULT 5,
  "BlurredVision" INTEGER NOT NULL DEFAULT 0,
  "TinglingHandsFeet" INTEGER NOT NULL DEFAULT 0,

  -- Result
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
