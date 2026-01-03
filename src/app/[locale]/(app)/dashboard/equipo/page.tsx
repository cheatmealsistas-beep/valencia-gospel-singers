import { requireUser } from '@/shared/auth';
import { getAllTeamMembers } from '@/features/admin/admin.query';
import { TeamAdmin } from './team-admin';

interface EquipoPageProps {
  params: Promise<{ locale: string }>;
}

export default async function EquipoPage({ params }: EquipoPageProps) {
  const { locale } = await params;
  await requireUser(locale);

  const teamMembers = await getAllTeamMembers();

  return <TeamAdmin initialTeamMembers={teamMembers} />;
}
