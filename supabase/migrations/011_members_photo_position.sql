-- Add photo_position field to members for controlling image crop focus
ALTER TABLE members
  ADD COLUMN IF NOT EXISTS photo_position TEXT NOT NULL DEFAULT 'center'
  CHECK (photo_position IN ('top', 'center', 'bottom'));
