'use client';

import { useTranslations } from 'next-intl';
import { MapPin, UserPlus, Award, Share2, HeartHandshake } from 'lucide-react';
import { FadeIn } from '@/shared/components/magic-ui';

export function ColaboraHoster() {
  const t = useTranslations('colabora');

  const benefits = [
    {
      icon: UserPlus,
      title: t('hoster.benefits.talent.title'),
      description: t('hoster.benefits.talent.description'),
    },
    {
      icon: Award,
      title: t('hoster.benefits.brand.title'),
      description: t('hoster.benefits.brand.description'),
    },
    {
      icon: Share2,
      title: t('hoster.benefits.social.title'),
      description: t('hoster.benefits.social.description'),
    },
    {
      icon: HeartHandshake,
      title: t('hoster.benefits.community.title'),
      description: t('hoster.benefits.community.description'),
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-surface">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-l from-neon-secondary/5 via-transparent to-transparent" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Benefits grid */}
          <FadeIn delay={0.1} className="order-2 lg:order-1">
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-surface-elevated/[0.03] to-transparent border border-hairline hover:border-neon/30 transition-all duration-500 overflow-hidden">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <h3 className="text-xl font-semibold text-on-surface mb-6">
                  {t('hoster.benefits.title')}
                </h3>

                <div className="grid sm:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-neon/10 to-neon-secondary/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <benefit.icon className="w-5 h-5 text-neon-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-on-surface mb-1">{benefit.title}</h4>
                        <p className="text-sm text-on-surface-muted">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right: Info */}
          <FadeIn className="order-1 lg:order-2">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon/20 to-neon-secondary/20 flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-neon-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-on-surface">
                {t('hoster.title')}
              </h2>
              <p className="text-lg text-on-surface-muted mb-8">
                {t('hoster.description')}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
