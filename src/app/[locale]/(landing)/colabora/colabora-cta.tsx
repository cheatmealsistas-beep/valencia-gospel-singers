'use client';

import { useTranslations } from 'next-intl';
import { FadeIn } from '@/shared/components/magic-ui';
import { CollaborationForm } from '@/features/collaboration/components/collaboration-form';

export function ColaboraCTA() {
  const t = useTranslations('colabora');

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[#0a0a0a]">
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-white/40">
              {t('cta.description')}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative max-w-lg mx-auto p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-purple-500/30 transition-all duration-500">
            <CollaborationForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
