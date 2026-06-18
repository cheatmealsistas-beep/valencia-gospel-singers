import Link from 'next/link';
import { Calendar, Users, MessageSquare, Handshake, Plus } from 'lucide-react';
import { requireAdmin } from '@/shared/auth';
import { getAdminStats } from '@/features/admin';
import { getUnreadContactRequestsCount } from '@/features/contact';

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getAdminStats();
  const unreadMessages = await getUnreadContactRequestsCount();

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Panel de administración de Mediterránea Gospel Singers
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Eventos"
            value={stats.totalEvents}
            description={`${stats.upcomingEvents} próximos`}
            icon={<Calendar className="w-5 h-5" />}
            href="/admin/eventos"
          />
          <StatCard
            title="Miembros del coro"
            value={stats.totalTeamMembers}
            description="Integrantes activos"
            icon={<Users className="w-5 h-5" />}
            href="/admin/equipo"
          />
          <StatCard
            title="Mensajes"
            value={unreadMessages}
            description="Pendientes de leer"
            icon={<MessageSquare className="w-5 h-5" />}
            href="/admin/mensajes"
            highlight={unreadMessages > 0}
          />
          <StatCard
            title="Clientes"
            value={stats.totalSponsors}
            description="Clientes activos"
            icon={<Handshake className="w-5 h-5" />}
            href="/admin/collaborators"
          />
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/eventos"
              className="inline-flex items-center rounded-md bg-neon/10 px-4 py-2.5 text-sm font-medium text-neon-foreground hover:bg-neon/20 transition-colors border border-neon/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo evento
            </Link>
            <Link
              href="/admin/equipo"
              className="inline-flex items-center rounded-md bg-neon/10 px-4 py-2.5 text-sm font-medium text-neon-foreground hover:bg-neon/20 transition-colors border border-neon/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir miembro
            </Link>
            <Link
              href="/admin/mensajes"
              className="inline-flex items-center rounded-md bg-neon/10 px-4 py-2.5 text-sm font-medium text-neon-foreground hover:bg-neon/20 transition-colors border border-neon/20"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Ver mensajes {unreadMessages > 0 && `(${unreadMessages})`}
            </Link>
            <Link
              href="/admin/collaborators"
              className="inline-flex items-center rounded-md bg-neon/10 px-4 py-2.5 text-sm font-medium text-neon-foreground hover:bg-neon/20 transition-colors border border-neon/20"
            >
              <Handshake className="w-4 h-4 mr-2" />
              Gestionar clientes
            </Link>
          </div>
        </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  href,
  highlight,
}: {
  title: string;
  value: number;
  description: string;
  icon?: React.ReactNode;
  href?: string;
  highlight?: boolean;
}) {
  const content = (
    <div className={`rounded-lg border bg-card p-6 transition-all ${href ? 'hover:border-neon/50 cursor-pointer' : ''} ${highlight ? 'border-neon/50 bg-neon/5' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <span className="text-neon-foreground">{icon}</span>}
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
