-- =====================================================
-- FIX: Add missing columns to events table
-- =====================================================
-- This migration ensures all required columns exist
-- in case the main events migration ran partially

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

-- Add source tracking
ALTER TABLE events ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

-- Create indexes if not exist
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_slug ON events(slug) WHERE slug IS NOT NULL;
