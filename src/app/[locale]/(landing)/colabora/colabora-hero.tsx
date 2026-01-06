'use client';

import { useTranslations } from 'next-intl';
import { FadeIn } from '@/shared/components/magic-ui';

export function ColaboraHero() {
  const t = useTranslations('colabora');

  return (
    <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-4 py-20 md:py-28 text-center overflow-hidden bg-[#0a0a0a]">
      {/* Fondo con glow púrpura */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-purple-600/20 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-fuchsia-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              {t('hero.titleStart')}{' '}
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]" style={{ WebkitBackgroundClip: 'text' }}>
                {t('hero.titleHighlight')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto">
              {t('hero.description')}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
