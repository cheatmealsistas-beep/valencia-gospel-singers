import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { getUnreadContactRequestsCount } from '@/features/contact';
import { AdminLayoutClient } from './admin-layout-client';

interface AdminLayoutProps {
  children: ReactNode;
  user: { id: string; email?: string };
}

/**
 * Server Component wrapper for AdminLayout
 * - Fetches unread messages count for badge
 * - Gets translations for navigation
 * - Passes data to client component for interactivity
 */
export async function AdminLayout({ children, user }: AdminLayoutProps) {
  const t = await getTranslations('layouts');
  const unreadCount = await getUnreadContactRequestsCount();

  const navigation = [
    { name: t('admin.nav.dashboard'), href: '/admin', icon: 'LayoutDashboard' as const },
    { name: t('admin.nav.events'), href: '/admin/eventos', icon: 'Calendar' as const },
    { name: t('admin.nav.gallery'), href: '/admin/galeria', icon: 'Images' as const },
    { name: t('admin.nav.team'), href: '/admin/equipo', icon: 'UsersRound' as const },
    { name: t('admin.nav.messages'), href: '/admin/mensajes', icon: 'MessageSquare' as const, badge: unreadCount },
    { name: t('admin.nav.collaborators'), href: '/admin/collaborators', icon: 'Handshake' as const },
  ];

  return (
    <AdminLayoutClient
      navigation={navigation}
      user={user}
      title={t('admin.title')}
      backLabel={t('admin.backToApp')}
    >
      {children}
    </AdminLayoutClient>
  );
}
