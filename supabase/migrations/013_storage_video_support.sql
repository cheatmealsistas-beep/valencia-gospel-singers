-- =============================================
-- STORAGE: Add video support and increase size limit
-- =============================================

-- Update media bucket to support video files and increase size limit to 50MB
UPDATE storage.buckets
SET
  file_size_limit = 52428800,  -- 50MB
  allowed_mime_types = ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
WHERE id = 'media';
