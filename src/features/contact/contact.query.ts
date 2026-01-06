import { createClientServer } from '@/shared/database/supabase';
import type { ContactRequest } from './types';

/**
 * Get all contact requests (admin view)
 */
export async function getAllContactRequests(): Promise<ContactRequest[]> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact requests:', error);
    return [];
  }

  return data as ContactRequest[];
}

/**
 * Get contact requests by status
 */
export async function getContactRequestsByStatus(
  status: ContactRequest['status']
): Promise<ContactRequest[]> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('contact_requests')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching ${status} contact requests:`, error);
    return [];
  }

  return data as ContactRequest[];
}

/**
 * Get unread contact requests count
 */
export async function getUnreadContactRequestsCount(): Promise<number> {
  const supabase = await createClientServer();

  const { count, error } = await supabase
    .from('contact_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (error) {
    console.error('Error counting unread requests:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Get a specific contact request by ID
 */
export async function getContactRequestById(
  id: string
): Promise<ContactRequest | null> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('contact_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(`Error fetching contact request ${id}:`, error);
    return null;
  }

  return data as ContactRequest;
}
