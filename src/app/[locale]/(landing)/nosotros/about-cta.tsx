'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { FadeIn } from '@/shared/components/magic-ui';

export function AboutCTA() {
  const t = useTranslations('nosotros.cta');
  const locale = useLocale();

  return (
    <section className="py-24 relative overflow-hidden bg-surface">
      {/* Fondo con glow púrpura */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/15 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="relative rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-hairline hover:border-neon/30 transition-all duration-500 p-12 md:p-16 text-center overflow-hidden max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-on-surface">
              {t('title')}
            </h2>
            <p className="text-lg text-on-surface-muted max-w-xl mx-auto mb-8">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="px-10 py-7 rounded-full text-lg bg-gradient-to-r from-neon via-neon-secondary to-neon bg-[length:200%_auto] text-on-neon font-semibold hover:bg-right shadow-2xl shadow-[0_10px_40px_-10px_hsl(var(--glow)/0.4)] transition-all duration-500"
                asChild
              >
                <Link href={`/${locale}/contacto`}>
                  <Mail className="mr-2 w-5 h-5" />
                  {t('primaryButton')}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="px-8 rounded-full border border-hairline text-on-surface hover:bg-on-surface/5 hover:border-neon/50"
                asChild
              >
                <Link href={`/${locale}/galeria`}>
                  {t('secondaryButton')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
