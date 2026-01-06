import { getTranslations } from 'next-intl/server';
import { requireAdmin } from '@/shared/auth';
import { getAllEvents } from '@/features/events';
import { EventList } from './event-list';

export default async function AdminEventosPage() {
  await requireAdmin();
  const t = await getTranslations('admin-eventos');
  const { data: events } = await getAllEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('description')}
        </p>
      </div>

      <EventList events={events || []} />
    </div>
  );
}
