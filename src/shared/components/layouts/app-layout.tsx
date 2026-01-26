'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { MobileMenu } from '@/shared/components/ui/mobile-menu';
import { SkipLink } from '@/shared/components/ui/skip-link';
import { LayoutDashboard, LogOut, Calendar, Handshake, MessageSquare, Users, Briefcase, Image } from 'lucide-react';
import { brand } from '@/shared/config';
import { logoutAction } from '@/features/auth/auth.actions';

interface AppLayoutProps {
  children: React.ReactNode;
  user?: {
    email?: string;
    avatar_url?: string;
  };
  unreadMessagesCount?: number;
}

// Helper to get glass classes based on config
const glassClasses = brand.theme.glass
  ? 'glass border-white/10'
  : 'bg-background border-border';

export function AppLayout({ children, user, unreadMessagesCount = 0 }: AppLayoutProps) {
  const t = useTranslations('layouts');
  const locale = useLocale();

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <>
      <SkipLink />
      <div className={`flex min-h-screen ${brand.theme.glass ? 'glass-background' : ''}`}>
        {/* Sidebar */}
      <aside className={`hidden w-64 flex-col border-r md:flex ${glassClasses}`}>
        <div className="flex h-14 items-center border-b px-4">
          <Link href={`/${locale}/admin`} className="flex items-center space-x-2">
            <span className="font-bold">{brand.name}</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link
            href={`/${locale}/admin`}
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-accent"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>{t('dashboard')}</span>
          </Link>
          <Link
            href={`/${locale}/admin/servicios`}
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-accent"
          >
            <Briefcase className="h-4 w-4" />
            <span>Servicios</span>
          </Link>
          <Link
            href={`/${locale}/admin/eventos`}
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-accent"
          >
            <Calendar className="h-4 w-4" />
            <span>Eventos</span>
          </Link>
          <Link
            href={`/${locale}/admin/equipo`}
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-accent"
          >
            <Users className="h-4 w-4" />
            <span>Equipo</span>
          </Link>
          <Link
            href={`/${locale}/admin/collaborators`}
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-accent"
          >
            <Handshake className="h-4 w-4" />
            <span>Clientes</span>
          </Link>
          <Link
            href={`/${locale}/admin/galeria`}
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-accent"
          >
            <Image className="h-4 w-4" />
            <span>Galería</span>
          </Link>
          <Link
            href={`/${locale}/admin/mensajes`}
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-accent"
          >
            <span className="flex items-center space-x-3">
              <MessageSquare className="h-4 w-4" />
              <span>Mensajes</span>
            </span>
            {unreadMessagesCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
              </span>
            )}
          </Link>
        </nav>
        <div className="border-t p-4">
          <form action={logoutAction}>
            <input type="hidden" name="locale" value={locale} />
            <Button variant="ghost" className="w-full justify-start" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              {t('logout')}
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className={`relative flex h-14 items-center justify-between border-b px-4 md:px-6 ${glassClasses}`}>
          <div className="flex items-center gap-2 md:hidden">
            <MobileMenu />
            <span className="font-bold">{brand.name}</span>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main id="main-content" className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
    </>
  );
}
