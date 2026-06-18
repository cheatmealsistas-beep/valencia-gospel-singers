'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft,
  Euro,
  Share2,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Check,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import { FadeIn } from '@/shared/components/magic-ui';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { brand } from '@/shared/config/brand';
import type { Service } from '@/features/services/types';

interface ServiceDetailProps {
  service: Service;
}

export function ServiceDetail({ service }: ServiceDetailProps) {
  const t = useTranslations('servicios-[slug]');
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  // Use locale-appropriate fields
  const title = locale === 'en' && service.titleEn ? service.titleEn : service.title;
  const subtitle = locale === 'en' && service.subtitleEn ? service.subtitleEn : service.subtitle;
  const description = locale === 'en' && service.descriptionEn ? service.descriptionEn : service.description;

  const formatPrice = (price: number | null) => {
    if (price === null) return null;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${title} - ${brand.name}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <FadeIn>
          <Link
            href="/servicios"
            className="inline-flex items-center text-sm text-on-surface-muted hover:text-neon-foreground transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Link>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <FadeIn>
              <div>
                {/* Featured badge */}
                {service.isFeatured && (
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-gradient-to-r from-neon to-neon-secondary text-on-neon border-0">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Destacado
                    </Badge>
                  </div>
                )}

                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-on-surface">{title}</h1>

                {subtitle && <p className="text-lg text-on-surface-muted">{subtitle}</p>}
              </div>
            </FadeIn>

            {/* Image */}
            {service.imageUrl && (
              <FadeIn delay={0.1}>
                <div className="rounded-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.imageUrl}
                    alt={title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </FadeIn>
            )}

            {/* Description */}
            {description && (
              <FadeIn delay={0.2}>
                <Card className="bg-on-surface/[0.02] border-hairline">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4 text-on-surface">{t('description.label')}</h2>
                    <div className="prose prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-on-surface-muted">{description}</p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Service Info Card */}
            <FadeIn delay={0.2}>
              <Card className="sticky top-24 bg-on-surface/[0.02] border-hairline">
                <CardContent className="p-6 space-y-6">
                  {/* Price */}
                  {service.priceFrom !== null && (
                    <div>
                      <h3 className="text-sm font-medium text-on-surface-muted mb-2">{t('priceFrom')}</h3>
                      <div className="flex items-center gap-3 text-on-surface">
                        <Euro className="h-5 w-5 text-neon-foreground" />
                        <span className="text-2xl font-bold">{formatPrice(service.priceFrom)}</span>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-on-surface">{t('cta.title')}</h3>
                    <p className="text-sm text-on-surface-muted">{t('cta.description')}</p>
                    <Button
                      className="w-full bg-gradient-to-r from-neon to-neon-secondary hover:from-neon hover:to-neon-secondary"
                      size="lg"
                      asChild
                    >
                      <Link href={`/${locale}/contacto`}>{t('cta.button')}</Link>
                    </Button>
                  </div>

                  {/* Share */}
                  <div>
                    <h3 className="text-sm font-medium text-on-surface-muted mb-3">{t('share.label')}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={shareOnTwitter}
                        title={t('share.twitter')}
                        className="border-hairline hover:border-neon/50 hover:bg-neon/10"
                      >
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={shareOnLinkedIn}
                        title={t('share.linkedin')}
                        className="border-hairline hover:border-neon/50 hover:bg-neon/10"
                      >
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyLink}
                        title={copied ? t('share.copied') : t('share.copy')}
                        className="border-hairline hover:border-neon/50 hover:bg-neon/10"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <LinkIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
