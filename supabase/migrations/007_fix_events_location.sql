-- =====================================================
-- FIX: Handle old columns and constraints in events table
-- =====================================================
-- The original table has columns/constraints incompatible with new code

-- 1. Make 'location' nullable (new code uses location_name)
ALTER TABLE events ALTER COLUMN location DROP NOT NULL;

-- 2. Make 'event_type' nullable (new code doesn't use it)
ALTER TABLE events ALTER COLUMN event_type DROP NOT NULL;

-- 3. Fix status constraint - old values: upcoming/ongoing/completed/cancelled
--    New values: draft/published/cancelled
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE events ADD CONSTRAINT events_status_check
  CHECK (status IN ('draft', 'published', 'cancelled', 'upcoming', 'ongoing', 'completed'));

-- 4. Migrate old status values to new ones
UPDATE events SET status = 'published' WHERE status IN ('upcoming', 'ongoing');
UPDATE events SET status = 'draft' WHERE status = 'completed';

-- 5. Now restrict to new values only
ALTER TABLE events DROP CONSTRAINT events_status_check;
ALTER TABLE events ADD CONSTRAINT events_status_check
  CHECK (status IN ('draft', 'published', 'cancelled'));

-- 6. Set default status to 'draft'
ALTER TABLE events ALTER COLUMN status SET DEFAULT 'draft';

-- 7. Copy any existing location data to location_name if needed
UPDATE events
SET location_name = location
WHERE location_name IS NULL AND location IS NOT NULL;
