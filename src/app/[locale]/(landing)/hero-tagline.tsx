'use client';

import { useTranslations } from 'next-intl';

export function HeroTagline() {
  const t = useTranslations('landing');

  return (
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.15] tracking-tight">
      <span className="block text-white">{t('hero.tagline')}</span>
      <span className="block bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text' }}>
        {t('hero.taglineEnd')}
      </span>
    </h1>
  );
}
