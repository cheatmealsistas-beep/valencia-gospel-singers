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
    <section className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      {/* Fondo con glow púrpura */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-purple-500/30 transition-all duration-500 p-10 md:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
              {t('title')}
            </h2>
            <p className="text-white/40 mb-8 max-w-xl mx-auto text-lg">
              {t('description')}
            </p>
            <Button
              size="lg"
              className="rounded-full px-10 py-7 text-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-[length:200%_auto] text-white font-semibold hover:bg-right shadow-2xl shadow-purple-600/30 transition-all duration-500"
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
