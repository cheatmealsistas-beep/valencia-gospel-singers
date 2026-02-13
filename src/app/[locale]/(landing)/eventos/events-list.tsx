'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { FadeIn } from '@/shared/components/magic-ui';
import { Button } from '@/shared/components/ui/button';
import type { Event } from '@/features/events/types';
import { EventCard } from './event-card';

interface EventsListProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
}

export function EventsList({ upcomingEvents, pastEvents }: EventsListProps) {
  const t = useTranslations('eventos');
  const locale = useLocale();

  return (
    <section className="py-12 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        {/* Upcoming Events */}
        <FadeIn>
          <h2 className="text-2xl font-bold mb-8 text-white">{t('upcoming.title')}</h2>
        </FadeIn>

        {upcomingEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {upcomingEvents.map((event, index) => (
              <FadeIn key={event.id} delay={index * 0.1}>
                <EventCard event={event} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn>
            <div className="text-center py-16 px-4 rounded-3xl bg-white/[0.02] border border-white/5 mb-16">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {t('upcoming.empty.title')}
              </h3>
              <p className="text-white/40 mb-6 max-w-md mx-auto">
                {t('upcoming.empty.description')}
              </p>
              <Button className="rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500" asChild>
                <Link href={`/${locale}/contacto`}>
                  {t('upcoming.empty.cta')}
                </Link>
              </Button>
            </div>
          </FadeIn>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <>
            <FadeIn>
              <h2 className="text-2xl font-bold mb-8 text-white">{t('past.title')}</h2>
            </FadeIn>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event, index) => (
                <FadeIn key={event.id} delay={index * 0.1}>
                  <EventCard event={event} isPast />
                </FadeIn>
              ))}
            </div>

            {pastEvents.length >= 6 && (
              <FadeIn delay={0.3}>
                <div className="text-center mt-8">
                  <Button variant="outline" className="rounded-full border-white/10 hover:border-purple-500/50 hover:bg-white/5" asChild>
                    <Link href="/eventos?filter=past">
                      {t('past.showMore')}
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            )}
          </>
        )}
      </div>
    </section>
  );
}
