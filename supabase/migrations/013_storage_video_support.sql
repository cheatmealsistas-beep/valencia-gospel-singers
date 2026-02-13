-- =============================================
-- STORAGE: Add video support and increase size limit
-- =============================================

-- Update media bucket to support video files and increase size limit to 100MB
UPDATE storage.buckets
SET
  file_size_limit = 104857600,  -- 100MB
  allowed_mime_types = ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
WHERE id = 'media';
