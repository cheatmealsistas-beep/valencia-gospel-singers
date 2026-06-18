'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export default function ServiceNotFound() {
  const t = useTranslations('servicios-[slug].notFound');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center">
        <Briefcase className="w-16 h-16 mx-auto mb-6 text-on-surface-muted" />
        <h1 className="text-2xl font-bold text-on-surface mb-2">{t('title')}</h1>
        <p className="text-on-surface-muted mb-8 max-w-md">{t('description')}</p>
        <Button
          className="bg-gradient-to-r from-neon to-neon-secondary hover:from-neon hover:to-neon-secondary"
          asChild
        >
          <Link href={`/${locale}/servicios`}>{t('cta')}</Link>
        </Button>
      </div>
    </div>
  );
}
