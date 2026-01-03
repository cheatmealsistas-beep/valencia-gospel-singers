'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CalendarDays, MapPin, Image, Link2, Users, FileText } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { createEventAction } from '@/features/events/events.actions';
import type { Event } from '@/features/events/types';

interface EventFormProps {
  locale: string;
  event?: Event;
}

export function EventForm({ locale, event }: EventFormProps) {
  const router = useRouter();
  const isEditing = !!event;

  const [state, action, pending] = useActionState(createEventAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(isEditing ? 'Evento actualizado' : 'Evento creado');
      router.push(`/${locale}/dashboard/eventos`);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, isEditing, router, locale]);

  return (
    <form action={action} className="space-y-8 max-w-2xl">
      {/* Información básica */}
      <div className="space-y-4 p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Información básica</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={event?.title}
            placeholder="Product Beers #13"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={event?.slug}
            placeholder="product-beers-13 (se genera automáticamente si está vacío)"
          />
          <p className="text-xs text-muted-foreground">
            Deja vacío para generar automáticamente desde el título
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription">Descripción corta</Label>
          <Input
            id="shortDescription"
            name="shortDescription"
            defaultValue={event?.shortDescription || ''}
            placeholder="Una breve descripción para las cards"
            maxLength={300}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción completa</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={event?.description || ''}
            placeholder="Descripción detallada del evento..."
            rows={5}
          />
        </div>
      </div>

      {/* Fecha y hora */}
      <div className="space-y-4 p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Fecha y hora</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha y hora de inicio *</Label>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              defaultValue={event?.date ? formatDateTimeLocal(event.date) : ''}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Fecha y hora de fin</Label>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              defaultValue={event?.endDate ? formatDateTimeLocal(event.endDate) : ''}
            />
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="space-y-4 p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Ubicación</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="locationName">Nombre del lugar</Label>
            <Input
              id="locationName"
              name="locationName"
              defaultValue={event?.locationName || ''}
              placeholder="WeWork Colón"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationCity">Ciudad</Label>
            <Input
              id="locationCity"
              name="locationCity"
              defaultValue={event?.locationCity || 'Valencia'}
              placeholder="Valencia"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="locationAddress">Dirección</Label>
          <Input
            id="locationAddress"
            name="locationAddress"
            defaultValue={event?.locationAddress || ''}
            placeholder="Calle Colón, 60"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="locationMapsUrl">URL de Google Maps</Label>
          <Input
            id="locationMapsUrl"
            name="locationMapsUrl"
            type="url"
            defaultValue={event?.locationMapsUrl || ''}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>

      {/* Media y enlaces */}
      <div className="space-y-4 p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Image className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Media y enlaces</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL de imagen</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            defaultValue={event?.imageUrl || ''}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="registrationUrl">URL de registro</Label>
            <Input
              id="registrationUrl"
              name="registrationUrl"
              type="url"
              defaultValue={event?.registrationUrl || ''}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAttendees">Aforo máximo</Label>
            <Input
              id="maxAttendees"
              name="maxAttendees"
              type="number"
              min="1"
              defaultValue={event?.maxAttendees || ''}
              placeholder="50"
            />
          </div>
        </div>
      </div>

      {/* Estado y opciones */}
      <div className="space-y-4 p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Estado y opciones</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select name="status" defaultValue={event?.status || 'draft'}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Solo los eventos publicados aparecen en la web
          </p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div>
            <Label htmlFor="featured" className="font-medium">Evento destacado</Label>
            <p className="text-sm text-muted-foreground">
              Aparece con badge especial y prioridad
            </p>
          </div>
          <Switch
            id="featured"
            name="featured"
            defaultChecked={event?.featured}
            value="true"
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear evento'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/dashboard/eventos`)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function formatDateTimeLocal(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
