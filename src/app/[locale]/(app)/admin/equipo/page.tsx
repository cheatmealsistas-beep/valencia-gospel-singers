import { getTranslations } from 'next-intl/server';
import { requireAdmin } from '@/shared/auth';
import { getAllTeamMembers } from '@/features/admin';
import { TeamList } from './team-list';

export default async function AdminEquipoPage() {
  await requireAdmin();
  const t = await getTranslations('admin-equipo');
  const members = await getAllTeamMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('description')}
        </p>
      </div>

      <TeamList members={members} />
    </div>
  );
}
