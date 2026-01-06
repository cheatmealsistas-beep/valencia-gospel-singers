-- =====================================================
-- MIGRATION FIX: Complete events schema cleanup
-- =====================================================
-- Run this after 003_adapt_events_schema.sql if it failed
-- on dropping is_public column due to RLS policy dependency

-- =====================================================
-- 1. DROP RLS POLICIES THAT DEPEND ON OLD COLUMNS
-- =====================================================

-- Drop the policy that depends on is_public
DROP POLICY IF EXISTS "Anyone can view public events" ON events;

-- =====================================================
-- 2. CREATE NEW RLS POLICY BASED ON STATUS
-- =====================================================

-- Create new policy based on status='published' instead of is_public
CREATE POLICY "Anyone can view published events"
  ON events FOR SELECT
  USING (status = 'published');

-- =====================================================
-- 3. NOW DROP THE OLD COLUMNS
-- =====================================================

-- Remove columns no longer needed
ALTER TABLE events DROP COLUMN IF EXISTS location;
ALTER TABLE events DROP COLUMN IF EXISTS is_free;
ALTER TABLE events DROP COLUMN IF EXISTS ticket_url;
ALTER TABLE events DROP COLUMN IF EXISTS whatsapp_message;
ALTER TABLE events DROP COLUMN IF EXISTS event_type;
ALTER TABLE events DROP COLUMN IF EXISTS is_public;

-- =====================================================
-- 4. DROP OLD EVENT TYPE CHECK IF EXISTS
-- =====================================================

ALTER TABLE events DROP CONSTRAINT IF EXISTS events_event_type_check;

-- =====================================================
-- FIN DE LA CORRECCIÓN
-- =====================================================
