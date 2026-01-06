-- =====================================================
-- MIGRATION: Add role column to members table
-- =====================================================
-- This migration adds the 'role' column to match the TeamMember type
-- and makes voice_type optional

-- Add role column (for display purposes like "Soprano", "Director", etc.)
ALTER TABLE members ADD COLUMN IF NOT EXISTS role TEXT;

-- Update existing rows: copy voice_type to role if role is null
UPDATE members SET role = voice_type WHERE role IS NULL AND voice_type IS NOT NULL;

-- Make voice_type nullable (it was required before)
ALTER TABLE members ALTER COLUMN voice_type DROP NOT NULL;

-- Add company column (optional)
ALTER TABLE members ADD COLUMN IF NOT EXISTS company TEXT;

-- Add linkedin_url column (optional)
ALTER TABLE members ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Set default role for any remaining nulls
UPDATE members SET role = 'Miembro' WHERE role IS NULL;

-- Make role NOT NULL after setting defaults
ALTER TABLE members ALTER COLUMN role SET NOT NULL;
