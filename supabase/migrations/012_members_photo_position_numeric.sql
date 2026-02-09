-- Ensure photo_position is an INTEGER column with range 0-100
-- Handles both cases: column is text (needs conversion) or already integer (just add constraint)

DO $$
DECLARE
  col_type text;
BEGIN
  -- Check current column type
  SELECT data_type INTO col_type
  FROM information_schema.columns
  WHERE table_name = 'members' AND column_name = 'photo_position';

  IF col_type IS NULL THEN
    -- Column doesn't exist, add it
    ALTER TABLE members ADD COLUMN photo_position INTEGER DEFAULT 50;
  ELSIF col_type IN ('text', 'character varying') THEN
    -- Column is text, convert to integer
    ALTER TABLE members DROP CONSTRAINT IF EXISTS members_photo_position_check;
    ALTER TABLE members ALTER COLUMN photo_position DROP DEFAULT;
    ALTER TABLE members ALTER COLUMN photo_position TYPE INTEGER USING (
      CASE photo_position
        WHEN 'top' THEN 20
        WHEN 'center' THEN 50
        WHEN 'bottom' THEN 80
        ELSE 50
      END
    );
    ALTER TABLE members ALTER COLUMN photo_position SET DEFAULT 50;
  ELSE
    -- Column is already integer/numeric, just ensure default
    ALTER TABLE members ALTER COLUMN photo_position SET DEFAULT 50;
  END IF;

  -- Add range constraint (drop first to be idempotent)
  ALTER TABLE members DROP CONSTRAINT IF EXISTS members_photo_position_range;
  ALTER TABLE members ADD CONSTRAINT members_photo_position_range
    CHECK (photo_position >= 0 AND photo_position <= 100);
END $$;
