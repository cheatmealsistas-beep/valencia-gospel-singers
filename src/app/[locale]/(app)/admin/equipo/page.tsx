import { getTranslations } from 'next-intl/server';
import { requireAdmin } from '@/shared/auth';
import { getAllTeamMembers } from '@/features/admin';
import { TeamList } from './team-list';
import type { TeamMember } from '@/features/admin/types';

export const dynamic = 'force-dynamic';

export default async function AdminEquipoPage() {
  await requireAdmin();
  const t = await getTranslations('admin-equipo');

  let members: TeamMember[];
  try {
    members = await getAllTeamMembers();
  } catch (err) {
    console.error('Error loading team members:', err);
    members = [];
  }

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
