import { createClientServer } from '@/shared/database/supabase';
import type { ContactRequestInput, ContactRequest } from './types';

/**
 * Create a new contact request (public - no auth required)
 */
export async function createContactRequest(
  input: ContactRequestInput
): Promise<{ success: boolean; error: string | null; id?: string }> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('contact_requests')
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      message: input.message,
      event_type: input.event_type || null,
      event_date: input.event_date || null,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating contact request:', error);
    return {
      success: false,
      error: error.message || 'Error al enviar el mensaje',
    };
  }

  return { success: true, error: null, id: data.id };
}

/**
 * Update contact request status (admin only)
 */
export async function updateContactRequestStatus(
  id: string,
  status: ContactRequest['status']
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase
    .from('contact_requests')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error(`Error updating contact request ${id}:`, error);
    return {
      success: false,
      error: error.message || 'Error al actualizar el estado',
    };
  }

  return { success: true, error: null };
}

/**
 * Add notes to a contact request (admin only)
 */
export async function updateContactRequestNotes(
  id: string,
  notes: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase
    .from('contact_requests')
    .update({
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error(`Error updating notes for contact request ${id}:`, error);
    return {
      success: false,
      error: error.message || 'Error al guardar las notas',
    };
  }

  return { success: true, error: null };
}

/**
 * Delete a contact request (admin only)
 */
export async function deleteContactRequest(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase
    .from('contact_requests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting contact request ${id}:`, error);
    return {
      success: false,
      error: error.message || 'Error al eliminar el mensaje',
    };
  }

  return { success: true, error: null };
}
