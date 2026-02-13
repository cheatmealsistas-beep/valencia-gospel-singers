import { createClient } from './client';

const MEDIA_BUCKET = 'media';

/**
 * Upload a file to Supabase Storage directly from the browser.
 * This bypasses Vercel's 4.5MB serverless function limit.
 */
export async function uploadFileClient(
  file: File,
  folder: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  const supabase = createClient();

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(fileName, file, {
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(fileName);

  return { url: urlData.publicUrl, error: null };
}
