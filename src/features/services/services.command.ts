import { createClientServer } from '@/shared/database/supabase';
import type { ServiceInput } from './types';

// ============================================
// SERVICES COMMANDS
// ============================================

/**
 * Crear un nuevo servicio
 */
export async function createService(
  input: ServiceInput
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('services')
    .insert({
      title: input.title,
      subtitle: input.subtitle,
      description: input.description,
      title_en: input.titleEn,
      subtitle_en: input.subtitleEn,
      description_en: input.descriptionEn,
      slug: input.slug,
      image_url: input.imageUrl,
      price_from: input.priceFrom,
      display_order: input.displayOrder,
      is_published: input.isPublished,
      is_featured: input.isFeatured,
    })
    .select('id')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { id: data.id }, error: null };
}

/**
 * Actualizar un servicio existente
 */
export async function updateService(
  serviceId: string,
  input: Partial<ServiceInput>
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) updateData.title = input.title;
  if (input.subtitle !== undefined) updateData.subtitle = input.subtitle;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.titleEn !== undefined) updateData.title_en = input.titleEn;
  if (input.subtitleEn !== undefined) updateData.subtitle_en = input.subtitleEn;
  if (input.descriptionEn !== undefined) updateData.description_en = input.descriptionEn;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.imageUrl !== undefined) updateData.image_url = input.imageUrl;
  if (input.priceFrom !== undefined) updateData.price_from = input.priceFrom;
  if (input.displayOrder !== undefined) updateData.display_order = input.displayOrder;
  if (input.isPublished !== undefined) updateData.is_published = input.isPublished;
  if (input.isFeatured !== undefined) updateData.is_featured = input.isFeatured;

  const { error } = await supabase.from('services').update(updateData).eq('id', serviceId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Eliminar un servicio
 */
export async function deleteService(
  serviceId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase.from('services').delete().eq('id', serviceId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Publicar un servicio
 */
export async function publishService(
  serviceId: string
): Promise<{ success: boolean; error: string | null }> {
  return updateService(serviceId, { isPublished: true });
}

/**
 * Despublicar un servicio
 */
export async function unpublishService(
  serviceId: string
): Promise<{ success: boolean; error: string | null }> {
  return updateService(serviceId, { isPublished: false });
}
