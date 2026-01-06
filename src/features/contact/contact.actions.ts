'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/shared/auth';
import { contactRequestSchema } from './types';
import type { ContactRequestInput, ContactRequest } from './types';
import {
  createContactRequest,
  updateContactRequestStatus,
  updateContactRequestNotes,
  deleteContactRequest,
} from './contact.command';

/**
 * Public action to submit a contact form
 */
export async function submitContactFormAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const input: ContactRequestInput = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || undefined,
    message: formData.get('message') as string,
    event_type: (formData.get('event_type') as ContactRequestInput['event_type']) || undefined,
    event_date: (formData.get('event_date') as string) || undefined,
  };

  const validation = contactRequestSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const result = await createContactRequest(validation.data);

  if (result.success) {
    revalidatePath('/admin/mensajes');
  }

  return result;
}

/**
 * Admin action to update contact request status
 */
export async function updateContactStatusAction(
  id: string,
  status: ContactRequest['status']
): Promise<{ success: boolean; error: string | null }> {
  await requireAdmin();

  const result = await updateContactRequestStatus(id, status);

  if (result.success) {
    revalidatePath('/admin/mensajes');
  }

  return result;
}

/**
 * Admin action to mark as read
 */
export async function markAsReadAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  return updateContactStatusAction(id, 'read');
}

/**
 * Admin action to mark as replied
 */
export async function markAsRepliedAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  return updateContactStatusAction(id, 'replied');
}

/**
 * Admin action to archive
 */
export async function archiveContactAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  return updateContactStatusAction(id, 'archived');
}

/**
 * Admin action to update notes
 */
export async function updateNotesAction(
  id: string,
  notes: string
): Promise<{ success: boolean; error: string | null }> {
  await requireAdmin();

  const result = await updateContactRequestNotes(id, notes);

  if (result.success) {
    revalidatePath('/admin/mensajes');
  }

  return result;
}

/**
 * Admin action to delete contact request
 */
export async function deleteContactAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  await requireAdmin();

  const result = await deleteContactRequest(id);

  if (result.success) {
    revalidatePath('/admin/mensajes');
  }

  return result;
}
