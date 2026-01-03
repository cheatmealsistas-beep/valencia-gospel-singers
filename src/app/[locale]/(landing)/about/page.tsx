import { getTranslations } from 'next-intl/server';
import { AboutHero } from './about-hero';
import { AboutMission } from './about-mission';
import { AboutTeam } from './about-team';
import { AboutCTA } from './about-cta';
import { getActiveTeamMembers } from '@/features/admin/admin.query';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function AboutPage() {
  const teamMembers = await getActiveTeamMembers();

  return (
    <>
      <AboutHero />
      <AboutMission />
      <AboutTeam teamMembers={teamMembers} />
      <AboutCTA />
    </>
  );
}
