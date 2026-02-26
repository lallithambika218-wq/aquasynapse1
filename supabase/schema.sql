-- AquaSynapse Supabase Schema
-- Run in Supabase SQL Editor to create all tables

-- SOS Events
CREATE TABLE IF NOT EXISTS sos_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  contact TEXT,
  message TEXT,
  severity TEXT DEFAULT 'critical',
  status TEXT DEFAULT 'dispatched',
  case_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk Analysis History
CREATE TABLE IF NOT EXISTS analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area TEXT NOT NULL,
  risk_score DOUBLE PRECISION,
  risk_level TEXT,
  confidence DOUBLE PRECISION,
  rainfall DOUBLE PRECISION,
  model_source TEXT,
  inputs JSONB,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shelters
CREATE TABLE IF NOT EXISTS shelters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  capacity INTEGER,
  current_occupancy INTEGER DEFAULT 0,
  safety TEXT DEFAULT 'Safe',
  distance_km DOUBLE PRECISION,
  facilities TEXT[],
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  state TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhooks / SMS log (stub)
CREATE TABLE IF NOT EXISTS notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT,
  recipient TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (optional for auth)
ALTER TABLE sos_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Seed sample shelters
INSERT INTO shelters (name, capacity, current_occupancy, safety, distance_km, facilities, state) VALUES
  ('Green Valley School', 1200, 340, 'Safe', 2.3, ARRAY['Medical', 'Food', 'Water'], 'Bihar'),
  ('Hilltop Complex', 1500, 200, 'Safe', 7.8, ARRAY['Medical', 'Food', 'Water', 'Power'], 'Bihar'),
  ('District Stadium', 3000, 450, 'Safe', 12.4, ARRAY['Medical', 'Food', 'Water', 'Power', 'Comms'], 'Assam'),
  ('Community Center', 600, 600, 'Full', 3.2, ARRAY['Food', 'Water'], 'Odisha'),
  ('Railway Station Hall', 2000, 800, 'Safe', 6.5, ARRAY['Medical', 'Food'], 'West Bengal')
ON CONFLICT DO NOTHING;
