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

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Storage: bucket de avatares (CDN público)
-- Ejecutar en Supabase SQL Editor o crear el bucket desde el dashboard
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "update own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "delete own avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
