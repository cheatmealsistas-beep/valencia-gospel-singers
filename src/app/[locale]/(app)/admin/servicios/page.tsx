import { getTranslations } from 'next-intl/server';
import { requireAdmin } from '@/shared/auth';
import { getAllServices } from '@/features/services';
import { ServiceList } from './service-list';

export default async function AdminServiciosPage() {
  await requireAdmin();
  const t = await getTranslations('admin-servicios');
  const { data: services } = await getAllServices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('description')}</p>
      </div>

      <ServiceList services={services || []} />
    </div>
  );
}
