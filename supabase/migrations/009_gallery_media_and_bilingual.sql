-- =============================================
-- GALLERY: Add video support and bilingual fields
-- =============================================

-- Add media type column to support images and videos
ALTER TABLE gallery_images
  ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'image'
    CHECK (media_type IN ('image', 'video'));

-- Add YouTube URL for video embeds
ALTER TABLE gallery_images
  ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Add English translations
ALTER TABLE gallery_images
  ADD COLUMN IF NOT EXISTS title_en TEXT;

ALTER TABLE gallery_images
  ADD COLUMN IF NOT EXISTS description_en TEXT;

ALTER TABLE gallery_images
  ADD COLUMN IF NOT EXISTS alt_text_en TEXT;

-- Add index for media type filtering
CREATE INDEX IF NOT EXISTS idx_gallery_images_media_type ON gallery_images(media_type);

-- Comments
COMMENT ON COLUMN gallery_images.media_type IS 'Type of media: image or video';
COMMENT ON COLUMN gallery_images.youtube_url IS 'YouTube video URL for video type';
COMMENT ON COLUMN gallery_images.title_en IS 'Title in English';
COMMENT ON COLUMN gallery_images.description_en IS 'Description in English';
COMMENT ON COLUMN gallery_images.alt_text_en IS 'Alt text in English';
