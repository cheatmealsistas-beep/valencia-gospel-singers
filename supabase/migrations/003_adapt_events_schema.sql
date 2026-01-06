-- =====================================================
-- MIGRATION: Adapt events schema to match code expectations
-- =====================================================
-- This migration transforms the events table from JSONB fields
-- to simple text fields, adds missing columns, and creates
-- speaker/sponsor relationship tables

-- =====================================================
-- 1. ALTER EVENTS TABLE - Add missing columns
-- =====================================================

-- Add slug column (required for routing)
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add short_description
ALTER TABLE events ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Add location fields
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_name TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_address TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_city TEXT DEFAULT 'Valencia';
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_maps_url TEXT;

-- Add registration and capacity
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_attendees INT;

-- Add featured flag
ALTER TABLE events ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add source tracking (for potential API integrations)
ALTER TABLE events ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'fourvenues'));
ALTER TABLE events ADD COLUMN IF NOT EXISTS fourvenues_id TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS fourvenues_slug TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

-- Add created_by for audit
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- =====================================================
-- 2. MIGRATE DATA - Convert JSONB to text fields
-- =====================================================

-- Create temporary columns for the new text fields
ALTER TABLE events ADD COLUMN IF NOT EXISTS title_text TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS description_text TEXT;

-- Copy Spanish content from JSONB to text fields
UPDATE events
SET
  title_text = COALESCE(title->>'es', title->>'en', 'Sin título'),
  description_text = COALESCE(description->>'es', description->>'en', ''),
  location_name = location,
  slug = LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        COALESCE(title->>'es', title->>'en', 'event'),
        '[^a-zA-Z0-9]+', '-', 'g'
      ),
      '^-+|-+$', '', 'g'
    )
  ) || '-' || EXTRACT(EPOCH FROM date)::TEXT
WHERE title_text IS NULL;

-- =====================================================
-- 3. REPLACE JSONB COLUMNS WITH TEXT
-- =====================================================

-- Drop old JSONB columns and rename new ones
ALTER TABLE events DROP COLUMN IF EXISTS title;
ALTER TABLE events DROP COLUMN IF EXISTS description;
ALTER TABLE events RENAME COLUMN title_text TO title;
ALTER TABLE events RENAME COLUMN description_text TO description;

-- Make title NOT NULL
ALTER TABLE events ALTER COLUMN title SET NOT NULL;

-- Make slug unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- =====================================================
-- 4. UPDATE STATUS VALUES
-- =====================================================

-- Update status column to match code expectations
-- Old values: 'upcoming', 'ongoing', 'completed', 'cancelled'
-- New values: 'draft', 'published', 'cancelled'

-- First, allow new values
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE events ADD CONSTRAINT events_status_check
  CHECK (status IN ('draft', 'published', 'cancelled', 'upcoming', 'ongoing', 'completed'));

-- Migrate old statuses to new ones
UPDATE events SET status = 'published' WHERE status IN ('upcoming', 'ongoing');
UPDATE events SET status = 'draft' WHERE status = 'completed';
-- 'cancelled' stays as 'cancelled'

-- Now restrict to new values only
ALTER TABLE events DROP CONSTRAINT events_status_check;
ALTER TABLE events ADD CONSTRAINT events_status_check
  CHECK (status IN ('draft', 'published', 'cancelled'));

-- Set default
ALTER TABLE events ALTER COLUMN status SET DEFAULT 'draft';

-- =====================================================
-- 5. CREATE SPEAKERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS speakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  bio TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view speakers"
  ON speakers FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage speakers"
  ON speakers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to speakers"
  ON speakers FOR ALL
  TO service_role
  USING (true);

CREATE TRIGGER update_speakers_updated_at
  BEFORE UPDATE ON speakers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. CREATE SPONSORS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  tier TEXT DEFAULT 'standard' CHECK (tier IN ('platinum', 'gold', 'silver', 'standard', 'community')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active sponsors"
  ON sponsors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage sponsors"
  ON sponsors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to sponsors"
  ON sponsors FOR ALL
  TO service_role
  USING (true);

CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON sponsors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. CREATE EVENT_SPEAKERS JUNCTION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS event_speakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  speaker_id UUID REFERENCES speakers(id) ON DELETE CASCADE NOT NULL,
  role_in_event TEXT DEFAULT 'speaker' CHECK (role_in_event IN ('speaker', 'host', 'panelist', 'moderator')),
  talk_title TEXT,
  talk_description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, speaker_id)
);

ALTER TABLE event_speakers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view event speakers"
  ON event_speakers FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage event speakers"
  ON event_speakers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to event_speakers"
  ON event_speakers FOR ALL
  TO service_role
  USING (true);

-- =====================================================
-- 8. CREATE EVENT_SPONSORS JUNCTION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS event_sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE NOT NULL,
  tier_override TEXT CHECK (tier_override IS NULL OR tier_override IN ('platinum', 'gold', 'silver', 'standard', 'community')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, sponsor_id)
);

ALTER TABLE event_sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view event sponsors"
  ON event_sponsors FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage event sponsors"
  ON event_sponsors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

CREATE POLICY "Service role has full access to event_sponsors"
  ON event_sponsors FOR ALL
  TO service_role
  USING (true);

-- =====================================================
-- 9. CLEANUP OLD COLUMNS
-- =====================================================

-- Remove columns no longer needed
ALTER TABLE events DROP COLUMN IF EXISTS location;
ALTER TABLE events DROP COLUMN IF EXISTS is_free;
ALTER TABLE events DROP COLUMN IF EXISTS ticket_url;
ALTER TABLE events DROP COLUMN IF EXISTS whatsapp_message;
ALTER TABLE events DROP COLUMN IF EXISTS event_type;

-- Rename is_public to match status logic
-- Events with is_public=true become 'published', false become 'draft'
-- This is already handled above, so we can drop is_public
ALTER TABLE events DROP COLUMN IF EXISTS is_public;

-- =====================================================
-- 10. CREATE ADDITIONAL INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);
CREATE INDEX IF NOT EXISTS idx_speakers_name ON speakers(name);
CREATE INDEX IF NOT EXISTS idx_sponsors_is_active ON sponsors(is_active);
CREATE INDEX IF NOT EXISTS idx_event_speakers_event_id ON event_speakers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_speakers_speaker_id ON event_speakers(speaker_id);
CREATE INDEX IF NOT EXISTS idx_event_sponsors_event_id ON event_sponsors(event_id);
CREATE INDEX IF NOT EXISTS idx_event_sponsors_sponsor_id ON event_sponsors(sponsor_id);

-- =====================================================
-- FIN DE LA MIGRACIÓN
-- =====================================================
