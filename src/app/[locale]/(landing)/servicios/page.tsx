import { getTranslations } from 'next-intl/server';
import { getPublishedServices } from '@/features/services';
import { ServicesHero } from './services-hero';
import { ServicesList } from './services-list';
import { ServicesCTA } from './services-cta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'servicios' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function ServiciosPage() {
  const { data: services } = await getPublishedServices();

  return (
    <>
      <ServicesHero />
      <ServicesList services={services || []} />
      <ServicesCTA />
    </>
  );
}
