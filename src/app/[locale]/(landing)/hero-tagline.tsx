'use client';

import { useTranslations } from 'next-intl';

export function HeroTagline() {
  const t = useTranslations('landing');

  return (
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-10 leading-[1.05] tracking-tighter">
      <span className="block text-white/90">{t('hero.tagline')}</span>
      <span className="block mt-2 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]" style={{ WebkitBackgroundClip: 'text' }}>
        {t('hero.taglineEnd')}
      </span>
    </h1>
  );
}
