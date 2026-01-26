import { createClientServer } from '@/shared/database/supabase';
import type { Service } from './types';

// ============================================
// PUBLIC QUERIES
// ============================================

/**
 * Obtener todos los servicios publicados (público)
 */
export async function getPublishedServices(): Promise<{
  data: Service[] | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapServices(data), error: null };
}

/**
 * Obtener servicios destacados
 */
export async function getFeaturedServices(limit?: number): Promise<{
  data: Service[] | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  let query = supabase
    .from('services')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapServices(data), error: null };
}

/**
 * Obtener servicio por slug (público)
 */
export async function getServiceBySlug(slug: string): Promise<{
  data: Service | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapService(data), error: null };
}

// ============================================
// ADMIN QUERIES (requieren autenticación)
// ============================================

/**
 * Obtener todos los servicios (admin)
 */
export async function getAllServices(): Promise<{
  data: Service[] | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapServices(data), error: null };
}

/**
 * Obtener servicio por ID (admin)
 */
export async function getServiceById(id: string): Promise<{
  data: Service | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapService(data), error: null };
}

/**
 * Obtener servicio por slug (admin - incluye no publicados)
 */
export async function getServiceBySlugAdmin(slug: string): Promise<{
  data: Service | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapService(data), error: null };
}

// ============================================
// MAPPERS (snake_case -> camelCase)
// ============================================

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapService(data: any): Service {
  return {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    titleEn: data.title_en,
    subtitleEn: data.subtitle_en,
    descriptionEn: data.description_en,
    slug: data.slug,
    imageUrl: data.image_url,
    priceFrom: data.price_from ? parseFloat(data.price_from) : null,
    displayOrder: data.display_order,
    isPublished: data.is_published,
    isFeatured: data.is_featured,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

function mapServices(data: any[]): Service[] {
  return data.map(mapService);
}
