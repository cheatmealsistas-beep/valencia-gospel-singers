'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/shared/auth';
import type { ServiceInput } from './types';
import {
  handleCreateService,
  handleUpdateService,
  handleDeleteService,
  handlePublishService,
  handleUnpublishService,
} from './services.handler';

// ============================================
// SERVICE ACTIONS
// ============================================

export async function createServiceAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  await requireAdmin();

  const input: ServiceInput = {
    // Spanish (default)
    title: formData.get('title') as string,
    subtitle: (formData.get('subtitle') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    // English translations
    titleEn: (formData.get('titleEn') as string) || undefined,
    subtitleEn: (formData.get('subtitleEn') as string) || undefined,
    descriptionEn: (formData.get('descriptionEn') as string) || undefined,
    // Common fields
    slug: (formData.get('slug') as string) || undefined,
    imageUrl: (formData.get('imageUrl') as string) || undefined,
    priceFrom: formData.get('priceFrom')
      ? parseFloat(formData.get('priceFrom') as string)
      : undefined,
    displayOrder: formData.get('displayOrder')
      ? parseInt(formData.get('displayOrder') as string)
      : 0,
    isPublished: formData.get('isPublished') === 'true',
    isFeatured: formData.get('isFeatured') === 'true',
  };

  const result = await handleCreateService(input);

  if (result.success) {
    revalidatePath('/servicios');
    revalidatePath('/admin/servicios');
  }

  return result;
}

export async function updateServiceAction(
  serviceId: string,
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const input: Partial<ServiceInput> = {};

  const title = formData.get('title');
  if (title) input.title = title as string;

  const subtitle = formData.get('subtitle');
  if (subtitle !== null) input.subtitle = subtitle as string;

  const description = formData.get('description');
  if (description !== null) input.description = description as string;

  // English fields
  const titleEn = formData.get('titleEn');
  if (titleEn !== null) input.titleEn = titleEn as string;

  const subtitleEn = formData.get('subtitleEn');
  if (subtitleEn !== null) input.subtitleEn = subtitleEn as string;

  const descriptionEn = formData.get('descriptionEn');
  if (descriptionEn !== null) input.descriptionEn = descriptionEn as string;

  const slug = formData.get('slug');
  if (slug) input.slug = slug as string;

  const imageUrl = formData.get('imageUrl');
  if (imageUrl !== null) input.imageUrl = imageUrl as string;

  const priceFrom = formData.get('priceFrom');
  if (priceFrom !== null) {
    input.priceFrom = priceFrom ? parseFloat(priceFrom as string) : null;
  }

  const displayOrder = formData.get('displayOrder');
  if (displayOrder) input.displayOrder = parseInt(displayOrder as string);

  const isPublished = formData.get('isPublished');
  if (isPublished !== null) input.isPublished = isPublished === 'true';

  const isFeatured = formData.get('isFeatured');
  if (isFeatured !== null) input.isFeatured = isFeatured === 'true';

  const result = await handleUpdateService(serviceId, input);

  if (result.success) {
    revalidatePath('/servicios');
    revalidatePath('/admin/servicios');
  }

  return result;
}

export async function deleteServiceAction(
  serviceId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handleDeleteService(serviceId);

  if (result.success) {
    revalidatePath('/servicios');
    revalidatePath('/admin/servicios');
  }

  return result;
}

export async function publishServiceAction(
  serviceId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handlePublishService(serviceId);

  if (result.success) {
    revalidatePath('/servicios');
    revalidatePath('/admin/servicios');
  }

  return result;
}

export async function unpublishServiceAction(
  serviceId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handleUnpublishService(serviceId);

  if (result.success) {
    revalidatePath('/servicios');
    revalidatePath('/admin/servicios');
  }

  return result;
}
