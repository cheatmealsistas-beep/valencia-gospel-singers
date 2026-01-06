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
      <h3 className="text-lg font-semibold text-white/80">{t('title')}</h3>

      {/* WhatsApp Card */}
      <Card className="bg-white/[0.02] border-white/5 hover:border-green-500/30 transition-all group">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <MessageCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white">{t('whatsapp.title')}</h4>
              <p className="text-sm text-white/50 mb-3">{t('whatsapp.description')}</p>
              <Button
                asChild
                size="sm"
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                <a
                  href={brand.getWhatsAppUrl('Hola, me gustaría información sobre Valencia Gospel Singers para un evento.')}
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
      <Card className="bg-white/[0.02] border-white/5 hover:border-purple-500/30 transition-all group">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Mail className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white">{t('email.title')}</h4>
              <p className="text-sm text-white/50 mb-2">{t('email.description')}</p>
              <a
                href={`mailto:${brand.email}`}
                className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
              >
                {brand.email}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Card */}
      <Card className="bg-white/[0.02] border-white/5 hover:border-fuchsia-500/30 transition-all group">
        <CardContent className="p-6">
          <h4 className="font-semibold text-white mb-1">{t('social.title')}</h4>
          <p className="text-sm text-white/50 mb-4">{t('social.description')}</p>
          <div className="flex gap-3">
            {brand.social.instagram && (
              <a
                href={brand.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
              >
                <Instagram className="w-5 h-5 text-pink-400" />
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
