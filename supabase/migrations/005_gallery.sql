-- =============================================
-- GALLERY TABLE
-- Tabla para gestionar la galería de fotos
-- =============================================

-- Crear tabla gallery_images
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  category TEXT NOT NULL DEFAULT 'otros' CHECK (category IN ('conciertos', 'bodas', 'eventos', 'ensayos', 'otros')),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_active ON gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_featured ON gallery_images(is_featured);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_event_id ON gallery_images(event_id);

-- Habilitar RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública para imágenes activas
CREATE POLICY "Public can view active gallery images"
  ON gallery_images FOR SELECT
  USING (is_active = true);

-- Política de acceso completo para admins
CREATE POLICY "Admins can manage gallery images"
  ON gallery_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

-- Política para service role (webhooks, cron jobs)
CREATE POLICY "Service role has full access to gallery"
  ON gallery_images FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Trigger para updated_at
CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE gallery_images IS 'Galería de fotos de Valencia Gospel Singers';
COMMENT ON COLUMN gallery_images.category IS 'Categoría: conciertos, bodas, eventos, ensayos, otros';
COMMENT ON COLUMN gallery_images.event_id IS 'Referencia opcional a un evento relacionado';
COMMENT ON COLUMN gallery_images.is_featured IS 'Destacado en la galería principal';
