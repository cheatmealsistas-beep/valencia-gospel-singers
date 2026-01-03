import { requireAdmin } from '@/shared/auth';
import { EventForm } from '../event-form';

interface NuevoEventoPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NuevoEventoPage({ params }: NuevoEventoPageProps) {
  const { locale } = await params;
  await requireAdmin(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo evento</h1>
        <p className="text-muted-foreground">
          Crea un nuevo evento para Product Beers
        </p>
      </div>

      <EventForm locale={locale} />
    </div>
  );
}
