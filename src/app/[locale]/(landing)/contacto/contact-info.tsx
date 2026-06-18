'use client';

import { useTranslations } from 'next-intl';
import { MessageCircle, Mail, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { brand } from '@/shared/config/brand';

export function ContactInfo() {
  const t = useTranslations('contacto.info');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-on-surface-muted">{t('title')}</h3>

      {/* WhatsApp Card */}
      <Card className="bg-surface-elevated/[0.02] border-hairline hover:border-green-500/30 transition-all group">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-on-surface">{t('whatsapp.title')}</h4>
              <p className="text-sm text-on-surface-muted mb-3">{t('whatsapp.description')}</p>
              <Button
                asChild
                size="sm"
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                <a
                  href={brand.getWhatsAppUrl('Hola, me gustaría información sobre Mediterránea Gospel Singers para un evento.')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('whatsapp.cta')}
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Card */}
      <Card className="bg-surface-elevated/[0.02] border-hairline hover:border-neon/30 transition-all group">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center group-hover:bg-neon/20 transition-colors">
              <Mail className="w-6 h-6 text-neon-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-on-surface">{t('email.title')}</h4>
              <p className="text-sm text-on-surface-muted mb-2">{t('email.description')}</p>
              <a
                href={`mailto:${brand.email}`}
                className="text-neon-foreground hover:text-neon-foreground transition-colors text-sm font-medium"
              >
                {brand.email}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Card */}
      <Card className="bg-surface-elevated/[0.02] border-hairline hover:border-neon-secondary/30 transition-all group">
        <CardContent className="p-6">
          <h4 className="font-semibold text-on-surface mb-1">{t('social.title')}</h4>
          <p className="text-sm text-on-surface-muted mb-4">{t('social.description')}</p>
          <div className="flex gap-3">
            {brand.social.instagram && (
              <a
                href={brand.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon/20 to-neon-secondary/20 flex items-center justify-center hover:from-neon/30 hover:to-neon-secondary/30 transition-all"
              >
                <Instagram className="w-5 h-5 text-neon-secondary" />
              </a>
            )}
            {brand.social.facebook && (
              <a
                href={brand.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center hover:bg-blue-500/30 transition-all"
              >
                <Facebook className="w-5 h-5 text-blue-400" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
