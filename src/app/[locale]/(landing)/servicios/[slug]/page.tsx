import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getServiceBySlug } from '@/features/services';
import { ServiceDetail } from './service-detail';

interface ServicePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'servicios-[slug]' });
  const { data: service } = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: t('notFound.title'),
    };
  }

  // Use locale-appropriate fields
  const title = locale === 'en' && service.titleEn ? service.titleEn : service.title;
  const subtitle = locale === 'en' && service.subtitleEn ? service.subtitleEn : service.subtitle;
  const description = locale === 'en' && service.descriptionEn ? service.descriptionEn : service.description;

  return {
    title: title + t('meta.titleSuffix'),
    description: subtitle || description?.slice(0, 160),
    openGraph: {
      title: title,
      description: subtitle || description?.slice(0, 160),
      images: service.imageUrl ? [service.imageUrl] : undefined,
    },
  };
}

// Dynamic rendering - services are fetched at request time
export const dynamic = 'force-dynamic';

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const { data: service, error } = await getServiceBySlug(slug);

  if (error || !service) {
    notFound();
  }

  return <ServiceDetail service={service} />;
}
