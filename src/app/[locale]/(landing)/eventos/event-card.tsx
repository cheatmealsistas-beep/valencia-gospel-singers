'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import type { Event } from '@/features/events/types';

interface EventCardProps {
  event: Event;
  isPast?: boolean;
}

export function EventCard({ event, isPast = false }: EventCardProps) {
  const t = useTranslations('eventos.card');
  const locale = useLocale();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const speakerCount = event.speakers?.length || 0;

  return (
    <div className={`group relative rounded-3xl bg-surface-elevated/[0.02] border border-hairline hover:border-neon/30 transition-all duration-500 overflow-hidden ${isPast ? 'opacity-75' : ''}`}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Event Image */}
      {event.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {event.featured && !isPast && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-neon to-neon-secondary text-on-neon border-0">
              Destacado
            </Badge>
          )}
        </div>
      )}

      <div className={`relative p-5 ${!event.imageUrl ? 'pt-5' : ''}`}>
        {/* Date Badge */}
        <div className="flex items-center gap-2 text-sm text-on-surface-muted/40 mb-3">
          <CalendarDays className="h-4 w-4 text-neon-foreground" />
          <span>{formatDate(event.date)}</span>
          <span className="text-neon-foreground">•</span>
          <span>{formatTime(event.date)}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-on-surface group-hover:text-neon-foreground transition-colors">
          {event.title}
        </h3>

        {/* Short Description */}
        {event.shortDescription && (
          <p className="text-sm text-on-surface-muted/40 mb-4 line-clamp-2">
            {event.shortDescription}
          </p>
        )}

        {/* Location */}
        {event.locationName && (
          <div className="flex items-center gap-2 text-sm text-on-surface-muted/40 mb-3">
            <MapPin className="h-4 w-4 flex-shrink-0 text-neon-foreground/70" />
            <span className="truncate">
              {event.locationName}
              {event.locationCity && `, ${event.locationCity}`}
            </span>
          </div>
        )}

        {/* Speakers */}
        {speakerCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-on-surface-muted/40 mb-4">
            <Users className="h-4 w-4 text-neon-foreground/70" />
            <span>
              {speakerCount} {speakerCount === 1 ? t('speaker') : t('speakers')}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <Button variant="outline" className="flex-1 border-neon/30 bg-neon/10 text-on-neon hover:bg-neon/20 hover:text-on-neon hover:border-neon/50" asChild>
            <Link href={`/eventos/${event.slug}`}>
              {t('viewDetails')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          {!isPast && event.registrationUrl && (
            <Button className="flex-1 bg-gradient-to-r from-neon to-neon-secondary hover:from-neon hover:to-neon-secondary" asChild>
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('register')}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
