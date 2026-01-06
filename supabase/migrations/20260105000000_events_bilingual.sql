-- =====================================================
-- Events Bilingual Support
-- =====================================================
-- Add English versions of text fields for i18n support

-- Add English title and descriptions
ALTER TABLE events ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS short_description_en TEXT;

-- Add English location fields
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_name_en TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_address_en TEXT;

-- Comment for documentation
COMMENT ON COLUMN events.title_en IS 'English version of event title';
COMMENT ON COLUMN events.description_en IS 'English version of full event description';
COMMENT ON COLUMN events.short_description_en IS 'English version of short description for cards';
COMMENT ON COLUMN events.location_name_en IS 'English version of venue name';
COMMENT ON COLUMN events.location_address_en IS 'English version of address';
