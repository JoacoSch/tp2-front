# Watchlog

Tracker personal de contenido. Guardá y organizá las películas, series, libros y podcasts que querés ver, estás consumiendo o ya terminaste.

## Stack tecnológico

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS
- **Autenticación y base de datos**: Supabase (Auth + PostgreSQL)
- **Deploy**: Vercel

## Funcionalidades

- Registro, inicio y cierre de sesión
- Agregar elementos a tu lista (película, serie, libro, podcast)
- Ver tu lista personal con estado y notas
- Eliminar elementos

## Estructura de ramas

| Rama | Responsabilidad |
|------|----------------|
| `main` | Producción — siempre funcional |
| `develop` | Integración |
| `joaco` | Layout, UI y autenticación |
| `camilo` | Supabase, base de datos y CRUD |

## Cómo correr localmente

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/JoacoSch/tp2-front.git
   cd tp2-front
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear el archivo `.env.local` con las variables de entorno:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   ```

4. Correr el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abrir [http://localhost:3000](http://localhost:3000)

## Schema de base de datos (Supabase)

```sql
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('movie','series','book','podcast','other')),
  status TEXT NOT NULL DEFAULT 'want' CHECK (status IN ('want','in_progress','done')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own items" ON items USING (auth.uid() = user_id);
CREATE POLICY "insert own items" ON items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own items" ON items FOR DELETE USING (auth.uid() = user_id);
```

## Deploy

La aplicación está desplegada en Vercel: [https://tp2-front-joaquins-projects-bae6c991.vercel.app](https://tp2-front-joaquins-projects-bae6c991.vercel.app)

## Integrantes

- [JoacoSch](https://github.com/JoacoSch)
- [camilorosem](https://github.com/camilorosem)
