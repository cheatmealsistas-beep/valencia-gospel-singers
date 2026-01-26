import { serviceSchema, generateSlug, type ServiceInput } from './types';
import {
  createService,
  updateService,
  deleteService,
  publishService,
  unpublishService,
} from './services.command';
import { getServiceById, getServiceBySlugAdmin } from './services.query';

// ============================================
// SERVICE HANDLERS
// ============================================

/**
 * Handler para crear servicio
 */
export async function handleCreateService(
  input: ServiceInput
): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  // Validar input
  const validation = serviceSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  // Generar slug si no se proporciona
  const data = validation.data;
  if (!data.slug) {
    data.slug = generateSlug(data.title);
  }

  // Verificar que el slug no existe
  const existingService = await getServiceBySlugAdmin(data.slug);
  if (existingService.data) {
    // Añadir timestamp para hacer único
    data.slug = `${data.slug}-${Date.now()}`;
  }

  // Crear servicio
  const result = await createService(data);

  if (result.error) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data! };
}

/**
 * Handler para actualizar servicio
 */
export async function handleUpdateService(
  serviceId: string,
  input: Partial<ServiceInput>
): Promise<{ success: boolean; error?: string }> {
  // Validar input parcial
  const validation = serviceSchema.partial().safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  // Verificar que el servicio existe
  const existingService = await getServiceById(serviceId);
  if (!existingService.data) {
    return { success: false, error: 'Servicio no encontrado' };
  }

  // Si se cambia el slug, verificar que no existe
  if (input.slug && input.slug !== existingService.data.slug) {
    const serviceWithSlug = await getServiceBySlugAdmin(input.slug);
    if (serviceWithSlug.data) {
      return { success: false, error: 'Ya existe un servicio con ese slug' };
    }
  }

  const result = await updateService(serviceId, validation.data);
  return { success: result.success, error: result.error || undefined };
}

/**
 * Handler para eliminar servicio
 */
export async function handleDeleteService(
  serviceId: string
): Promise<{ success: boolean; error?: string }> {
  // Verificar que el servicio existe
  const existingService = await getServiceById(serviceId);
  if (!existingService.data) {
    return { success: false, error: 'Servicio no encontrado' };
  }

  const result = await deleteService(serviceId);
  return { success: result.success, error: result.error || undefined };
}

/**
 * Handler para publicar servicio
 */
export async function handlePublishService(
  serviceId: string
): Promise<{ success: boolean; error?: string }> {
  // Verificar que el servicio existe
  const existingService = await getServiceById(serviceId);
  if (!existingService.data) {
    return { success: false, error: 'Servicio no encontrado' };
  }

  // Verificar que tiene los campos mínimos para publicar
  if (!existingService.data.title) {
    return {
      success: false,
      error: 'El servicio necesita un título para ser publicado',
    };
  }

  const result = await publishService(serviceId);
  return { success: result.success, error: result.error || undefined };
}

/**
 * Handler para despublicar servicio
 */
export async function handleUnpublishService(
  serviceId: string
): Promise<{ success: boolean; error?: string }> {
  const existingService = await getServiceById(serviceId);
  if (!existingService.data) {
    return { success: false, error: 'Servicio no encontrado' };
  }

  const result = await unpublishService(serviceId);
  return { success: result.success, error: result.error || undefined };
}
