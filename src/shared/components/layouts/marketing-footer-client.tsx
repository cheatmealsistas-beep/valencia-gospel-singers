'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { brand } from '@/shared/config';

interface MarketingFooterClientProps {
  locale: string;
}

export function MarketingFooterClient({ locale }: MarketingFooterClientProps) {
  const t = useTranslations('layouts');

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          {brand.copyright}
        </p>
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/privacidad`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t('privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
