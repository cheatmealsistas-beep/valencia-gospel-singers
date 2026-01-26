import { z } from 'zod';

// ============================================
// SCHEMAS
// ============================================

// Schema para crear/editar servicio
export const serviceSchema = z.object({
  // Spanish (default)
  title: z.string().min(1, 'El título es requerido').max(200),
  subtitle: z.string().max(300).optional(),
  description: z.string().max(5000).optional(),
  // English translations
  titleEn: z.string().max(200).optional(),
  subtitleEn: z.string().max(300).optional(),
  descriptionEn: z.string().max(5000).optional(),
  // Common fields
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones')
    .optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  priceFrom: z.coerce.number().positive().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

// ============================================
// TYPES (para respuestas de BD)
// ============================================

export interface Service {
  id: string;
  // Spanish (default)
  title: string;
  subtitle: string | null;
  description: string | null;
  // English translations
  titleEn: string | null;
  subtitleEn: string | null;
  descriptionEn: string | null;
  // Common fields
  slug: string;
  imageUrl: string | null;
  priceFrom: number | null;
  displayOrder: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// HELPERS
// ============================================

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
