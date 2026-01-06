-- =====================================================
-- MIGRATION: Adapt collaborators schema to match admin code expectations
-- =====================================================
-- The admin code expects:
-- - type column with values 'sponsor' or 'hoster'
-- - contact_name, contact_email, contact_phone, notes fields
-- - created_by, updated_by for audit

-- =====================================================
-- 1. ADD MISSING COLUMNS
-- =====================================================

-- Add type column (the admin code uses 'type' not 'collaborator_type')
ALTER TABLE collaborators ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'sponsor' CHECK (type IN ('sponsor', 'hoster'));

-- Migrate existing collaborator_type values to type
UPDATE collaborators
SET type = CASE
  WHEN collaborator_type = 'sponsor' THEN 'sponsor'
  WHEN collaborator_type = 'partner' THEN 'hoster'
  WHEN collaborator_type = 'media' THEN 'sponsor'
  WHEN collaborator_type = 'venue' THEN 'hoster'
  ELSE 'sponsor'
END
WHERE type IS NULL OR type = 'sponsor';

-- Add contact fields for internal management
ALTER TABLE collaborators ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE collaborators ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE collaborators ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE collaborators ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add audit fields
ALTER TABLE collaborators ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE collaborators ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- =====================================================
-- 2. DROP OLD COLUMN
-- =====================================================

-- Drop the old collaborator_type column
ALTER TABLE collaborators DROP COLUMN IF EXISTS collaborator_type;

-- Drop description JSONB if exists (we'll use notes instead)
ALTER TABLE collaborators DROP COLUMN IF EXISTS description;

-- =====================================================
-- 3. MAKE TYPE NOT NULL AFTER MIGRATION
-- =====================================================

ALTER TABLE collaborators ALTER COLUMN type SET NOT NULL;

-- =====================================================
-- 4. CREATE INDEX FOR TYPE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_collaborators_type ON collaborators(type);

-- =====================================================
-- FIN DE LA MIGRACIÓN
-- =====================================================
