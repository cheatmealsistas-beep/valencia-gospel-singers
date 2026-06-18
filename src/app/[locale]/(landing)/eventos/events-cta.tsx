'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { FadeIn } from '@/shared/components/magic-ui';
import { Button } from '@/shared/components/ui/button';

export function EventsCTA() {
  const t = useTranslations('eventos.cta');
  const locale = useLocale();

  return (
    <section className="py-24 relative overflow-hidden bg-surface">
      {/* Fondo con glow púrpura */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/15 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-elevated/[0.03] to-transparent border border-hairline hover:border-neon/30 transition-all duration-500 p-10 md:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-on-surface">
              {t('title')}
            </h2>
            <p className="text-on-surface-muted mb-8 max-w-xl mx-auto text-lg">
              {t('description')}
            </p>
            <Button
              size="lg"
              className="rounded-full px-10 py-7 text-lg bg-gradient-to-r from-neon via-neon-secondary to-neon bg-[length:200%_auto] text-on-neon font-semibold hover:bg-right shadow-[0_0_40px_-10px_hsl(var(--glow)/0.4)] transition-all duration-500"
              asChild
            >
              <Link href={`/${locale}/contacto`}>
                <Mail className="mr-2 w-5 h-5" />
                {t('button')}
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
