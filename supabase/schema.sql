-- Watchlog: schema de base de datos
-- Ejecutar en Supabase SQL Editor

CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('movie','series','book','podcast','other')),
  status TEXT NOT NULL DEFAULT 'want' CHECK (status IN ('want','in_progress','done')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security: cada usuario solo ve sus propios items
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select own items" ON items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert own items" ON items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete own items" ON items
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "update own items" ON items
  FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
