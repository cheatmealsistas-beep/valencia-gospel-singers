'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { FadeIn } from '@/shared/components/magic-ui';
import { brand } from '@/shared/config';

export function AboutCTA() {
  const t = useTranslations('nosotros.cta');
  const locale = useLocale();

  return (
    <section className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      {/* Fondo con glow púrpura */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="relative rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-purple-500/30 transition-all duration-500 p-12 md:p-16 text-center overflow-hidden max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">
              {t('title')}
            </h2>
            <p className="text-lg text-white/40 max-w-xl mx-auto mb-8">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="px-10 py-7 rounded-full text-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-[length:200%_auto] text-white font-semibold hover:bg-right shadow-2xl shadow-purple-600/30 transition-all duration-500"
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
                className="px-8 rounded-full border border-white/10 text-white hover:bg-white/5 hover:border-purple-500/50"
                asChild
              >
                <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer">
                  {t('secondaryButton')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
