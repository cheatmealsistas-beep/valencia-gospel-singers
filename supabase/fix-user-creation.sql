-- ============================================
-- EJECUTA ESTE SQL EN SUPABASE DASHBOARD
-- SQL Editor → New Query → Pega esto → Run
-- ============================================

-- 1. Crear función update_updated_at_column si no existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Eliminar trigger anterior si existe (por si está corrupto)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Recrear la función handle_new_user con mejor manejo de errores
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING; -- Evita error si ya existe
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log el error pero no bloquea la creación del usuario
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recrear el trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 5. Verificar que la tabla profiles existe y tiene la estructura correcta
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    CREATE TABLE profiles (
      id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
      full_name TEXT,
      avatar_url TEXT,
      language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es')),
      timezone TEXT DEFAULT 'UTC',
      user_flags TEXT[] DEFAULT '{}',
      current_organization_id UUID,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view own profile" ON profiles
      FOR SELECT USING (auth.uid() = id);

    CREATE POLICY "Users can update own profile" ON profiles
      FOR UPDATE USING (auth.uid() = id);

    CREATE POLICY "Users can insert own profile" ON profiles
      FOR INSERT WITH CHECK (auth.uid() = id);

    CREATE POLICY "Service role full access profiles" ON profiles
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- 6. Mostrar mensaje de éxito
SELECT 'Fix aplicado correctamente. Ahora puedes crear usuarios.' as resultado;
