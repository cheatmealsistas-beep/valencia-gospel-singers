import { getTranslations } from 'next-intl/server';
import { requireAdmin } from '@/shared/auth';
import { getAllContactRequests } from '@/features/contact';
import { MessageList } from './message-list';

export default async function AdminMensajesPage() {
  await requireAdmin();
  const t = await getTranslations('admin-mensajes');
  const messages = await getAllContactRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('description')}
        </p>
      </div>

      <MessageList messages={messages} />
    </div>
  );
}
