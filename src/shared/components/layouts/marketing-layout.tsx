'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Instagram, Facebook, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { SkipLink } from '@/shared/components/ui/skip-link';
import { brand } from '@/shared/config';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const t = useTranslations('layouts');
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/servicios`, label: t('services') },
    { href: `/${locale}/eventos`, label: t('events') },
    { href: `/${locale}/nosotros`, label: t('about') },
    { href: `/${locale}/contacto`, label: t('contact') },
  ];

  return (
    <>
      <SkipLink />
      <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
        {/* Header - Estilo Vibrante Moderno */}
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl">
          <div className="container flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center space-x-3 group">
              <span className="font-bold text-white text-xl tracking-tight">
                {brand.name}
              </span>
            </Link>

            {/* Nav Desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Redes sociales */}
              <div className="flex items-center space-x-1">
                {brand.social.instagram && (
                  <a
                    href={brand.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/30 hover:text-purple-400 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {brand.social.facebook && (
                  <a
                    href={brand.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/30 hover:text-purple-400 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
              </div>

              {/* CTA Principal */}
              <Button
                className="rounded-full px-6 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium hover:from-purple-500 hover:to-fuchsia-500 shadow-lg shadow-purple-500/20 transition-all"
                asChild
              >
                <a href={brand.getWhatsAppUrl(t('whatsappMessage'))} target="_blank" rel="noopener noreferrer">
                  {t('contactCta')}
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/5 bg-[#0a0a0a]">
              <nav className="container py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 text-white font-medium hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-white/10">
                  <Button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium" asChild>
                    <a href={brand.getWhatsAppUrl(t('whatsappMessage'))} target="_blank" rel="noopener noreferrer">
                      {t('contactCta')}
                    </a>
                  </Button>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    {brand.social.instagram && (
                      <a
                        href={brand.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 text-white/40 hover:text-purple-400 rounded-lg"
                      >
                        <Instagram className="h-6 w-6" />
                      </a>
                    )}
                    {brand.social.facebook && (
                      <a
                        href={brand.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 text-white/40 hover:text-purple-400 rounded-lg"
                      >
                        <Facebook className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                </div>
              </nav>
            </div>
          )}
        </header>

        <main id="main-content" className="flex-1">{children}</main>

        {/* Footer - Estilo Vibrante Moderno */}
        <footer className="bg-[#0a0a0a] border-t border-white/5">
          <div className="container py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Columna 1: Logo y descripción */}
              <div>
                <span className="font-bold text-white text-lg">{brand.name}</span>
                <p className="text-white/30 text-sm leading-relaxed mt-4 max-w-sm">
                  {brand.description}
                </p>
              </div>

              {/* Columna 2: Enlaces */}
              <div>
                <h3 className="font-medium text-white/50 mb-4 text-sm uppercase tracking-wider">{t('navigation')}</h3>
                <ul className="space-y-3">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/30 hover:text-purple-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Columna 3: Contacto y redes */}
              <div>
                <h3 className="font-medium text-white/50 mb-4 text-sm uppercase tracking-wider">Contacto</h3>
                <ul className="space-y-3 text-sm text-white/30 mb-6">
                  <li>
                    <a
                      href={`mailto:${brand.email}`}
                      className="hover:text-purple-400 transition-colors"
                    >
                      {brand.email}
                    </a>
                  </li>
                  <li>{brand.organization.address.city}</li>
                </ul>
                {/* Redes sociales */}
                <div className="flex items-center space-x-3">
                  {brand.social.instagram && (
                    <a
                      href={brand.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-white/30 hover:text-purple-400 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {brand.social.facebook && (
                    <a
                      href={brand.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-white/30 hover:text-purple-400 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="border-t border-white/5">
            <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-white/20">
                {brand.copyright}
              </p>
              <div className="flex items-center gap-6 text-sm text-white/20">
                <Link
                  href={`/${locale}/privacidad`}
                  className="hover:text-white/40 transition-colors"
                >
                  {t('privacy')}
                </Link>
                <Link
                  href={`/${locale}/terminos`}
                  className="hover:text-white/40 transition-colors"
                >
                  {t('terms')}
                </Link>
                <Link
                  href={`/${locale}/login`}
                  className="hover:text-white/40 transition-colors"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
