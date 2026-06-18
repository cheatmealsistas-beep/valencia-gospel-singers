'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { FadeIn } from '@/shared/components/magic-ui';

export function ServicesCTA() {
  const t = useTranslations('servicios.cta');
  const locale = useLocale();

  return (
    <section className="relative px-4 py-16 md:py-24 bg-surface">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-neon/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-4">
            {t('title')}
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-lg text-on-surface-muted mb-8">
            {t('description')}
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-neon to-neon-secondary hover:from-neon hover:to-neon-secondary text-on-neon"
            asChild
          >
            <Link href={`/${locale}/contacto`}>{t('button')}</Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
