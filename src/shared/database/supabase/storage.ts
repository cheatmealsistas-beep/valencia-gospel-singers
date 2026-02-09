import { createClient } from './server';

const MEDIA_BUCKET = 'media';

/**
 * Upload a file to Supabase Storage
 * Returns the public URL or error
 */
export async function uploadFile(
  file: File,
  folder: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  const supabase = await createClient();

  // Generate unique filename
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(fileName, file, {
      cacheControl: '31536000', // 1 year cache
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

/**
 * Delete a file from Supabase Storage by its public URL
 */
export async function deleteFile(
  publicUrl: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // Extract path from public URL
  // URL format: https://xxx.supabase.co/storage/v1/object/public/media/folder/file.jpg
  const urlParts = publicUrl.split(`/storage/v1/object/public/${MEDIA_BUCKET}/`);
  if (urlParts.length !== 2) {
    return { success: false, error: 'Invalid storage URL' };
  }

  const filePath = urlParts[1];
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .remove([filePath]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
