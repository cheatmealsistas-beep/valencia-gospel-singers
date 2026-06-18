'use client';

import { useTranslations } from 'next-intl';
import { Building2, MapPin, Sparkles, Users, Megaphone, Heart } from 'lucide-react';
import { FadeIn } from '@/shared/components/magic-ui';
import { CollaborationForm } from './collaboration-form';

export function CollaborationSection() {
  const t = useTranslations('collaboration');

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-surface">
      {/* Decoración de fondo */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-neon/5 rounded-full blur-3xl translate-x-1/2" />

      <div className="container relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon/10 border border-neon/30 text-neon-foreground text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              {t('section.label')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-on-surface">
              {t('section.title')}
            </h2>
            <p className="text-lg text-on-surface-muted">
              {t('section.description')}
            </p>
          </div>
        </FadeIn>

        {/* Cards de tipos de colaboración */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {/* Sponsor Card */}
          <FadeIn delay={0.1}>
            <div className="relative group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-hairline hover:border-neon/30 transition-all duration-500 overflow-hidden h-full">
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-3xl bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-neon/15 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-7 h-7 text-neon-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-on-surface">{t('types.sponsor.title')}</h3>
                <p className="text-on-surface-muted mb-6">{t('types.sponsor.description')}</p>

                {/* Mini benefits */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Megaphone className="w-4 h-4 text-neon-foreground flex-shrink-0" />
                    <span className="text-on-surface-muted">{t('sponsor.benefit1')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-neon-foreground flex-shrink-0" />
                    <span className="text-on-surface-muted">{t('sponsor.benefit2')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Sparkles className="w-4 h-4 text-neon-foreground flex-shrink-0" />
                    <span className="text-on-surface-muted">{t('sponsor.benefit3')}</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Hoster Card */}
          <FadeIn delay={0.2}>
            <div className="relative group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-hairline hover:border-neon/30 transition-all duration-500 overflow-hidden h-full">
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-3xl bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-neon/15 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-7 h-7 text-neon-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-on-surface">{t('types.hoster.title')}</h3>
                <p className="text-on-surface-muted mb-6">{t('types.hoster.description')}</p>

                {/* Mini benefits */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-neon-foreground flex-shrink-0" />
                    <span className="text-on-surface-muted">{t('hoster.benefit1')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Heart className="w-4 h-4 text-neon-foreground flex-shrink-0" />
                    <span className="text-on-surface-muted">{t('hoster.benefit2')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Megaphone className="w-4 h-4 text-neon-foreground flex-shrink-0" />
                    <span className="text-on-surface-muted">{t('hoster.benefit3')}</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Formulario */}
        <FadeIn delay={0.3}>
          <div className="max-w-lg mx-auto">
            <CollaborationForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
