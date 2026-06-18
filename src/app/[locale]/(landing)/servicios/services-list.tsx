'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { FadeIn } from '@/shared/components/magic-ui';
import { ServiceCard } from './service-card';
import type { Service } from '@/features/services/types';

interface ServicesListProps {
  services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {
  const t = useTranslations('servicios.list');
  const locale = useLocale();

  return (
    <section className="relative px-4 py-16 md:py-24 bg-surface">
      {/* Background subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section Title */}
        <FadeIn>
          <h2 className="text-2xl font-bold text-on-surface mb-8 md:mb-12">
            {t('title')}
          </h2>
        </FadeIn>

        {services.length === 0 ? (
          /* Empty State */
          <FadeIn>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase className="w-16 h-16 text-on-surface-muted mb-6" />
              <h3 className="text-xl font-semibold text-on-surface mb-2">
                {t('empty.title')}
              </h3>
              <p className="text-on-surface-muted mb-6 max-w-md">
                {t('empty.description')}
              </p>
              <Button
                className="bg-gradient-to-r from-neon to-neon-secondary hover:from-neon hover:to-neon-secondary"
                asChild
              >
                <Link href={`/${locale}/contacto`}>{t('empty.cta')}</Link>
              </Button>
            </div>
          </FadeIn>
        ) : (
          /* Services Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <FadeIn key={service.id} delay={index * 0.1}>
                <ServiceCard service={service} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
