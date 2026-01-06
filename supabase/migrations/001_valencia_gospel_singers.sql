-- =====================================================
-- VALENCIA GOSPEL SINGERS - MIGRACIÓN INICIAL
-- =====================================================
-- Ejecutar en Supabase SQL Editor en orden

-- =====================================================
-- 1. FUNCIÓN AUXILIAR PARA updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. TABLA: profiles (usuarios/admins)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  user_flags TEXT[] DEFAULT '{}',
  locale TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role has full access to profiles"
  ON profiles FOR ALL
  TO service_role
  USING (true);

-- Trigger para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil en registro
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 3. TABLA: members (integrantes del coro)
-- =====================================================
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  voice_type TEXT NOT NULL CHECK (voice_type IN ('soprano', 'alto', 'tenor', 'bass', 'director')),
  bio JSONB DEFAULT '{"es": "", "en": ""}',
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para members
CREATE POLICY "Anyone can view active members"
  ON members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all members"
  ON members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to members"
  ON members FOR ALL
  TO service_role
  USING (true);

CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. TABLA: events (eventos del coro)
-- =====================================================
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title JSONB NOT NULL DEFAULT '{"es": "", "en": ""}',
  description JSONB DEFAULT '{"es": "", "en": ""}',
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT NOT NULL,
  location_url TEXT,
  image_url TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('concert', 'wedding', 'corporate', 'religious', 'festival', 'other')),
  is_public BOOLEAN DEFAULT true,
  is_free BOOLEAN DEFAULT true,
  ticket_url TEXT,
  whatsapp_message TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para events
CREATE POLICY "Anyone can view public events"
  ON events FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins can manage all events"
  ON events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to events"
  ON events FOR ALL
  TO service_role
  USING (true);

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. TABLA: contact_requests (formularios de contacto)
-- =====================================================
CREATE TABLE contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  event_type TEXT,
  event_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para contact_requests
CREATE POLICY "Anyone can create contact requests"
  ON contact_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all contact requests"
  ON contact_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Admins can update contact requests"
  ON contact_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to contact_requests"
  ON contact_requests FOR ALL
  TO service_role
  USING (true);

CREATE TRIGGER update_contact_requests_updated_at
  BEFORE UPDATE ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. TABLA: gallery_items (galería de fotos/videos)
-- =====================================================
CREATE TABLE gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title JSONB DEFAULT '{"es": "", "en": ""}',
  description JSONB DEFAULT '{"es": "", "en": ""}',
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'youtube')),
  thumbnail_url TEXT,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para gallery_items
CREATE POLICY "Anyone can view visible gallery items"
  ON gallery_items FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can manage all gallery items"
  ON gallery_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to gallery_items"
  ON gallery_items FOR ALL
  TO service_role
  USING (true);

CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON gallery_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. TABLA: blog_posts (blog/noticias)
-- =====================================================
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title JSONB NOT NULL DEFAULT '{"es": "", "en": ""}',
  excerpt JSONB DEFAULT '{"es": "", "en": ""}',
  content JSONB NOT NULL DEFAULT '{"es": "", "en": ""}',
  cover_image TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para blog_posts
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage all posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to blog_posts"
  ON blog_posts FOR ALL
  TO service_role
  USING (true);

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. TABLA: cms_content (contenido editable)
-- =====================================================
CREATE TABLE cms_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{"es": {}, "en": {}}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page, section)
);

ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para cms_content
CREATE POLICY "Anyone can view cms content"
  ON cms_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage cms content"
  ON cms_content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to cms_content"
  ON cms_content FOR ALL
  TO service_role
  USING (true);

CREATE TRIGGER update_cms_content_updated_at
  BEFORE UPDATE ON cms_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. TABLA: subscribers (suscriptores newsletter)
-- =====================================================
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  locale TEXT DEFAULT 'es',
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para subscribers
CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Subscribers can update own subscription"
  ON subscribers FOR UPDATE
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Admins can view all subscribers"
  ON subscribers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Admins can manage subscribers"
  ON subscribers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to subscribers"
  ON subscribers FOR ALL
  TO service_role
  USING (true);

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. TABLA: email_logs (registro de emails enviados)
-- =====================================================
CREATE TABLE email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_type TEXT NOT NULL CHECK (email_type IN ('contact_confirmation', 'contact_admin_notification', 'event_announcement', 'newsletter', 'welcome')),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  resend_id TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para email_logs
CREATE POLICY "Admins can view email logs"
  ON email_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to email_logs"
  ON email_logs FOR ALL
  TO service_role
  USING (true);

-- =====================================================
-- 11. TABLA: app_settings (configuración global)
-- =====================================================
CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN ('info_bar', 'email', 'features', 'general', 'social', 'seo')
  ),
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para app_settings
CREATE POLICY "Anyone can view public settings"
  ON app_settings FOR SELECT
  USING (category IN ('info_bar', 'social', 'seo', 'general'));

CREATE POLICY "Admins can manage all settings"
  ON app_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to app_settings"
  ON app_settings FOR ALL
  TO service_role
  USING (true);

-- =====================================================
-- 12. TABLA: collaborators (patrocinadores/colaboradores)
-- =====================================================
CREATE TABLE collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description JSONB DEFAULT '{"es": "", "en": ""}',
  collaborator_type TEXT NOT NULL CHECK (collaborator_type IN ('sponsor', 'partner', 'media', 'venue')),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para collaborators
CREATE POLICY "Anyone can view active collaborators"
  ON collaborators FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all collaborators"
  ON collaborators FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to collaborators"
  ON collaborators FOR ALL
  TO service_role
  USING (true);

CREATE TRIGGER update_collaborators_updated_at
  BEFORE UPDATE ON collaborators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 13. DATOS INICIALES
-- =====================================================

-- Settings iniciales
INSERT INTO app_settings (key, value, category, description) VALUES
('info_bar', '{"enabled": false, "mode": "info", "scope": "all", "messages": {"es": "", "en": ""}, "dismissible": true}', 'info_bar', 'Configuración del banner informativo'),
('email_settings', '{"contact_notifications": true, "event_announcements": true, "admin_email": ""}', 'email', 'Configuración de emails'),
('social_links', '{"instagram": "", "facebook": "", "youtube": "", "spotify": "", "tiktok": ""}', 'social', 'Enlaces a redes sociales'),
('whatsapp', '{"number": "", "default_message": "Hola! Me gustaría más información sobre Valencia Gospel Singers."}', 'general', 'Configuración de WhatsApp')
ON CONFLICT (key) DO NOTHING;

-- CMS content inicial para páginas
INSERT INTO cms_content (page, section, content) VALUES
('home', 'hero', '{"es": {"title": "Valencia Gospel Singers", "subtitle": "La emoción del gospel en tu evento", "cta": "Contáctanos"}, "en": {"title": "Valencia Gospel Singers", "subtitle": "The emotion of gospel at your event", "cta": "Contact us"}}'),
('home', 'services', '{"es": {"title": "Nuestros Servicios", "description": "Hacemos de tu evento una experiencia inolvidable"}, "en": {"title": "Our Services", "description": "We make your event an unforgettable experience"}}'),
('about', 'intro', '{"es": {"title": "Sobre Nosotros", "content": ""}, "en": {"title": "About Us", "content": ""}}'),
('services', 'intro', '{"es": {"title": "Servicios", "description": ""}, "en": {"title": "Services", "description": ""}}'),
('contact', 'intro', '{"es": {"title": "Contacto", "description": "¿Tienes un evento especial? Cuéntanos y te preparamos una propuesta."}, "en": {"title": "Contact", "description": "Do you have a special event? Tell us and we will prepare a proposal."}}')
ON CONFLICT (page, section) DO NOTHING;

-- =====================================================
-- 14. ÍNDICES PARA MEJOR RENDIMIENTO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_is_public ON events(is_public);
CREATE INDEX IF NOT EXISTS idx_members_is_active ON members(is_active);
CREATE INDEX IF NOT EXISTS idx_members_voice_type ON members(voice_type);
CREATE INDEX IF NOT EXISTS idx_gallery_items_event_id ON gallery_items(event_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_is_visible ON gallery_items(is_visible);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_is_active ON subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_collaborators_is_active ON collaborators(is_active);

-- =====================================================
-- FIN DE LA MIGRACIÓN
-- =====================================================
