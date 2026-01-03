-- ============================================================================
-- TEAM MEMBERS - Miembros del equipo organizador
-- ============================================================================

-- Crear tabla team_members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  linkedin_url TEXT,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(display_order);

-- Habilitar RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Política pública de lectura (para mostrar en landing)
CREATE POLICY "Public can view active team members"
  ON team_members FOR SELECT
  USING (is_active = true);

-- Política de admin para gestión completa
CREATE POLICY "Admins can manage team members"
  ON team_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DATOS INICIALES - Equipo actual
-- ============================================================================

INSERT INTO team_members (name, role, company, linkedin_url, photo_url, display_order) VALUES
  ('Carlos Miguel Corada', 'Founder', 'Fourvenues', 'https://www.linkedin.com/in/cmiguelcorada/', 'https://media.licdn.com/dms/image/v2/D4D03AQHyyaeT-6Yl9w/profile-displayphoto-scale_200_200/B4DZhCbA0tGkAY-/0/1753461034971?e=1768435200&v=beta&t=kbh2qr4dz8x--OFWKO-NHI5_oQ5gZ7ecvi6KVUyJ9NM', 1),
  ('Carlos Moya Ortiz', 'Organizador', 'Citibox', 'https://www.linkedin.com/in/csmoya/', 'https://media.licdn.com/dms/image/v2/D4D03AQFlA0E9MMqpMg/profile-displayphoto-scale_200_200/B4DZh6lhgiGsAY-/0/1754403314146?e=1768435200&v=beta&t=wzdmPHPfdN77N48oaOKhRaw9O-1fe_pJ70MfomkVRsY', 2),
  ('Marta Cano', 'Organizadora', NULL, 'https://www.linkedin.com/in/marta-cano-product/', 'https://media.licdn.com/dms/image/v2/D4D03AQGtQnOD7QAGyA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1729705858366?e=1768435200&v=beta&t=pWhk2zoMJxRkxSy4lJIYilcovOaM_VEM-8G6447C6ss', 3),
  ('Guille Songel', 'Organizador', NULL, 'https://www.linkedin.com/in/guillesongel/', 'https://media.licdn.com/dms/image/v2/C4D03AQHFMFuUDbgkVA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1594752621754?e=1768435200&v=beta&t=Qlq52X3Pjpf-ERFD0dfhYgho3cNc5AVuistKt509o2o', 4),
  ('Maribel Fernández', 'Organizadora', NULL, 'https://www.linkedin.com/in/maribel-fernandez/', 'https://media.licdn.com/dms/image/v2/D4D03AQG2Oe8vekO7kg/profile-displayphoto-scale_200_200/B4DZkFuTgiIEAY-/0/1756737650372?e=1768435200&v=beta&t=q8WOlex1ycccrIZTjCon2Cmp9gXYGqa8ploAPnYv8Ck', 5);
