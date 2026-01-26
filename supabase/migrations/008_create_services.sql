-- =====================================================
-- MIGRACIÓN: Crear tabla services
-- =====================================================

-- =====================================================
-- 1. TABLA: services
-- =====================================================
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Español (default)
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  -- Inglés
  title_en TEXT,
  subtitle_en TEXT,
  description_en TEXT,
  -- Common
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  price_from DECIMAL(10,2),
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 2. RLS POLICIES
-- =====================================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Público: solo servicios publicados
CREATE POLICY "Anyone can view published services"
  ON services FOR SELECT
  USING (is_published = true);

-- Admins: acceso total
CREATE POLICY "Admins can manage all services"
  ON services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

-- Service role: acceso total
CREATE POLICY "Service role has full access to services"
  ON services FOR ALL
  TO service_role
  USING (true);

-- =====================================================
-- 3. TRIGGER updated_at
-- =====================================================
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. ÍNDICES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_services_is_published ON services(is_published);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);

-- =====================================================
-- FIN DE LA MIGRACIÓN
-- =====================================================
