-- Change photo_position from text enum to numeric percentage (0-100)
-- 1. Drop the check constraint
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_photo_position_check;
-- 2. Drop the old default (text 'center' can't auto-cast to integer)
ALTER TABLE members ALTER COLUMN photo_position DROP DEFAULT;
-- 3. Convert column to integer
ALTER TABLE members ALTER COLUMN photo_position TYPE INTEGER USING (
  CASE photo_position
    WHEN 'top' THEN 20
    WHEN 'center' THEN 50
    WHEN 'bottom' THEN 80
    ELSE 50
  END
);
-- 4. Set the new default
ALTER TABLE members ALTER COLUMN photo_position SET DEFAULT 50;
-- 5. Add range constraint
ALTER TABLE members ADD CONSTRAINT members_photo_position_range
  CHECK (photo_position >= 0 AND photo_position <= 100);
