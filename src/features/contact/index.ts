/**
 * Contact Feature
 *
 * Gestión de solicitudes de contacto del formulario público.
 */

// Types
export * from './types';

// Queries
export {
  getAllContactRequests,
  getContactRequestsByStatus,
  getUnreadContactRequestsCount,
  getContactRequestById,
} from './contact.query';

// Commands
export {
  createContactRequest,
  updateContactRequestStatus,
  updateContactRequestNotes,
  deleteContactRequest,
} from './contact.command';

// Actions
export {
  submitContactFormAction,
  updateContactStatusAction,
  markAsReadAction,
  markAsRepliedAction,
  archiveContactAction,
  updateNotesAction,
  deleteContactAction,
} from './contact.actions';
