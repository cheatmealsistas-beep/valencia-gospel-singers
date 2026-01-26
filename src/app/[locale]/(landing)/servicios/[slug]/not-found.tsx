'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export default function ServiceNotFound() {
  const t = useTranslations('servicios-[slug].notFound');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center">
        <Briefcase className="w-16 h-16 mx-auto mb-6 text-white/20" />
        <h1 className="text-2xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-white/50 mb-8 max-w-md">{t('description')}</p>
        <Button
          className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500"
          asChild
        >
          <Link href={`/${locale}/servicios`}>{t('cta')}</Link>
        </Button>
      </div>
    </div>
  );
}
