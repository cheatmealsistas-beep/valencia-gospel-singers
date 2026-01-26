'use client';

import { useTranslations } from 'next-intl';
import { FadeIn } from '@/shared/components/magic-ui';

export function ServicesHero() {
  const t = useTranslations('servicios.hero');

  return (
    <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-4 py-20 md:py-28 text-center overflow-hidden bg-[#0a0a0a]">
      {/* Fondo con glow púrpura */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-purple-600/20 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-fuchsia-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <FadeIn>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
            {t('titleStart')}{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]" style={{ WebkitBackgroundClip: 'text' }}>
              {t('titleHighlight')}
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mt-6 text-lg md:text-xl leading-8 text-white/50 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
