'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Euro, Star } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import type { Service } from '@/features/services/types';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const t = useTranslations('servicios.card');
  const locale = useLocale();

  const formatPrice = (price: number | null) => {
    if (price === null) return null;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Use locale-appropriate fields
  const title = locale === 'en' && service.titleEn ? service.titleEn : service.title;
  const subtitle = locale === 'en' && service.subtitleEn ? service.subtitleEn : service.subtitle;

  return (
    <div className="group relative rounded-3xl bg-on-surface/[0.02] border border-hairline hover:border-neon/30 transition-all duration-500 overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Service Image */}
      {service.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={service.imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {service.isFeatured && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-neon to-neon-secondary text-on-neon border-0">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Destacado
            </Badge>
          )}
        </div>
      )}

      <div className={`relative p-5 ${!service.imageUrl ? 'pt-5' : ''}`}>
        {/* Price Badge */}
        {service.priceFrom !== null && (
          <div className="flex items-center gap-2 text-sm text-on-surface-muted mb-3">
            <Euro className="h-4 w-4 text-neon-foreground" />
            <span>{t('priceFrom')} {formatPrice(service.priceFrom)}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-on-surface group-hover:text-neon-foreground transition-colors">
          {title}
        </h3>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-on-surface-muted mb-4 line-clamp-3">
            {subtitle}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1 border-neon/30 bg-neon/10 text-on-neon hover:bg-neon/20 hover:text-on-neon hover:border-neon/50"
            asChild
          >
            <Link href={`/servicios/${service.slug}`}>
              {t('viewDetails')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
