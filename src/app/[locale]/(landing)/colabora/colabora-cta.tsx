'use client';

import { useTranslations } from 'next-intl';
import { FadeIn } from '@/shared/components/magic-ui';
import { CollaborationForm } from '@/features/collaboration/components/collaboration-form';

export function ColaboraCTA() {
  const t = useTranslations('colabora');

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-surface">
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-neon/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-neon-secondary/10 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-on-surface">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-on-surface-muted">
              {t('cta.description')}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative max-w-lg mx-auto p-8 rounded-3xl bg-gradient-to-br from-surface-elevated/[0.03] to-transparent border border-hairline hover:border-neon/30 transition-all duration-500">
            <CollaborationForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
