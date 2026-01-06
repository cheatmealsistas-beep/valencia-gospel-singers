'use client';

import { useTranslations } from 'next-intl';
import { Target, Zap, Heart } from 'lucide-react';
import { FadeIn } from '@/shared/components/magic-ui';

const values = [
  {
    icon: Target,
    key: 'mission',
  },
  {
    icon: Zap,
    key: 'vision',
  },
  {
    icon: Heart,
    key: 'values',
  },
];

export function AboutMission() {
  const t = useTranslations('nosotros.mission');

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((item, index) => (
            <FadeIn key={item.key} delay={index * 0.1}>
              <div className="group relative text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 text-purple-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {t(`${item.key}.title`)}
                  </h3>
                  <p className="text-white/40">
                    {t(`${item.key}.description`)}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
