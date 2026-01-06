'use client';

import { useTranslations } from 'next-intl';
import { Building2, Megaphone, Users, Sparkles, Presentation } from 'lucide-react';
import { FadeIn } from '@/shared/components/magic-ui';

export function ColaboraSponsor() {
  const t = useTranslations('colabora');

  const benefits = [
    {
      icon: Megaphone,
      title: t('sponsor.benefits.visibility.title'),
      description: t('sponsor.benefits.visibility.description'),
    },
    {
      icon: Users,
      title: t('sponsor.benefits.community.title'),
      description: t('sponsor.benefits.community.description'),
    },
    {
      icon: Sparkles,
      title: t('sponsor.benefits.networking.title'),
      description: t('sponsor.benefits.networking.description'),
    },
    {
      icon: Presentation,
      title: t('sponsor.benefits.content.title'),
      description: t('sponsor.benefits.content.description'),
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-[#0a0a0a]">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-transparent" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <FadeIn>
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                {t('sponsor.title')}
              </h2>
              <p className="text-lg text-white/40 mb-8">
                {t('sponsor.description')}
              </p>
            </div>
          </FadeIn>

          {/* Right: Benefits grid */}
          <FadeIn delay={0.1}>
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <h3 className="text-xl font-semibold text-white mb-6">
                  {t('sponsor.benefits.title')}
                </h3>

                <div className="grid sm:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <benefit.icon className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">{benefit.title}</h4>
                        <p className="text-sm text-white/40">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
