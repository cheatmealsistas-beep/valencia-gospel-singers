import { z } from 'zod';

/**
 * Contact Request Schema
 */
export const contactRequestSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Email no válido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  event_type: z.enum(['boda', 'corporativo', 'concierto', 'privado', 'otro']).optional(),
  event_date: z.string().optional(),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  event_type: string | null;
  event_date: string | null;
  status: 'pending' | 'read' | 'replied' | 'archived';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ContactRequestStatus = ContactRequest['status'];
