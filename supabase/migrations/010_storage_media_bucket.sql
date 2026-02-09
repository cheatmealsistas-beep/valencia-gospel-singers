-- Create storage bucket for media (team photos, gallery images, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to media bucket
CREATE POLICY "Public read access for media" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

-- Allow authenticated users (admin) to upload to media bucket
CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update media
CREATE POLICY "Authenticated users can update media" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete media
CREATE POLICY "Authenticated users can delete media" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');
