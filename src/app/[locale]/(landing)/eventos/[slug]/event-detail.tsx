'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  ExternalLink,
  Users,
  Share2,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { useState } from 'react';
import { FadeIn } from '@/shared/components/magic-ui';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { brand } from '@/shared/config/brand';
import type { Event } from '@/features/events/types';
import { isUpcoming, isPast } from '@/features/events/types';

interface EventDetailProps {
  event: Event;
}

export function EventDetail({ event }: EventDetailProps) {
  const t = useTranslations('eventos-[slug]');
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  const upcoming = isUpcoming(event);
  const past = isPast(event);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${event.title} - ${brand.name}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <FadeIn>
        <Link
          href="/eventos"
          className="inline-flex items-center text-sm text-white/50 hover:text-purple-400 transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Link>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <FadeIn>
            <div>
              {/* Status badge */}
              <div className="flex items-center gap-3 mb-4">
                {upcoming && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white border-0">{t('status.upcoming')}</Badge>
                )}
                {past && (
                  <Badge className="bg-white/10 text-white/60 border-0">{t('status.past')}</Badge>
                )}
                {event.status === 'cancelled' && (
                  <Badge variant="destructive">{t('status.cancelled')}</Badge>
                )}
                {event.featured && upcoming && (
                  <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">Destacado</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                {event.title}
              </h1>

              {event.shortDescription && (
                <p className="text-lg text-white/50">
                  {event.shortDescription}
                </p>
              )}
            </div>
          </FadeIn>

          {/* Image */}
          {event.imageUrl && (
            <FadeIn delay={0.1}>
              <div className="rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </FadeIn>
          )}

          {/* Description */}
          {event.description && (
            <FadeIn delay={0.2}>
              <Card className="bg-white/[0.02] border-white/5">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4 text-white">
                    {t('description.label')}
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-white/60">{event.description}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {/* Speakers */}
          {event.speakers && event.speakers.length > 0 && (
            <FadeIn delay={0.3}>
              <Card className="bg-white/[0.02] border-white/5">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-6 text-white">
                    {t('speakers.label')}
                  </h2>
                  <div className="space-y-6">
                    {event.speakers.map((eventSpeaker) => (
                      <div
                        key={eventSpeaker.id}
                        className="flex gap-4"
                      >
                        {eventSpeaker.speaker?.photoUrl && (
                          <div className="flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={eventSpeaker.speaker.photoUrl}
                              alt={eventSpeaker.speaker.name}
                              className="w-16 h-16 rounded-full object-cover border border-white/10"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-white">
                            {eventSpeaker.speaker?.name}
                          </h3>
                          {eventSpeaker.speaker?.role && (
                            <p className="text-sm text-white/50">
                              {eventSpeaker.speaker.role}
                              {eventSpeaker.speaker.company &&
                                ` @ ${eventSpeaker.speaker.company}`}
                            </p>
                          )}
                          {eventSpeaker.talkTitle && (
                            <p className="text-sm text-purple-400 mt-1">
                              {t('speakers.talkTitle')}: {eventSpeaker.talkTitle}
                            </p>
                          )}
                          {eventSpeaker.speaker?.linkedinUrl && (
                            <a
                              href={eventSpeaker.speaker.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-white/40 hover:text-purple-400 mt-2 transition-colors"
                            >
                              <Linkedin className="h-3 w-3 mr-1" />
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {/* Sponsors */}
          {event.sponsors && event.sponsors.length > 0 && (
            <FadeIn delay={0.4}>
              <Card className="bg-white/[0.02] border-white/5">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-6 text-white">
                    {t('sponsors.label')}
                  </h2>
                  <div className="flex flex-wrap gap-6">
                    {event.sponsors.map((eventSponsor) => (
                      <a
                        key={eventSponsor.id}
                        href={eventSponsor.sponsor?.websiteUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 transition-all"
                      >
                        {eventSponsor.sponsor?.logoUrl && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={eventSponsor.sponsor.logoUrl}
                            alt={eventSponsor.sponsor.name}
                            className="h-8 w-auto object-contain"
                          />
                        )}
                        <span className="font-medium text-white">
                          {eventSponsor.sponsor?.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info Card */}
          <FadeIn delay={0.2}>
            <Card className="sticky top-24 bg-white/[0.02] border-white/5">
              <CardContent className="p-6 space-y-6">
                {/* Date & Time */}
                <div>
                  <h3 className="text-sm font-medium text-white/50 mb-2">
                    {t('date.label')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-white">
                      <CalendarDays className="h-5 w-5 text-purple-400" />
                      <span className="capitalize">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <span>
                        {formatTime(event.date)}
                        {event.endDate && ` - ${formatTime(event.endDate)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {event.locationName && (
                  <div>
                    <h3 className="text-sm font-medium text-white/50 mb-2">
                      {t('location.label')}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-white">{event.locationName}</p>
                          {event.locationAddress && (
                            <p className="text-sm text-white/50">
                              {event.locationAddress}
                            </p>
                          )}
                          {event.locationCity && (
                            <p className="text-sm text-white/50">
                              {event.locationCity}
                            </p>
                          )}
                        </div>
                      </div>
                      {event.locationMapsUrl && (
                        <a
                          href={event.locationMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {t('location.viewMap')}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Attendees info */}
                {event.maxAttendees && (
                  <div className="flex items-center gap-3 text-sm text-white/50">
                    <Users className="h-5 w-5" />
                    <span>
                      {event.maxAttendees} {t('registration.spotsLeft')}
                    </span>
                  </div>
                )}

                {/* Register button */}
                {upcoming && event.registrationUrl && (
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500" size="lg" asChild>
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('registration.register')}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}

                {/* Share */}
                <div>
                  <h3 className="text-sm font-medium text-white/50 mb-3">
                    {t('share.label')}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={shareOnTwitter}
                      title={t('share.twitter')}
                      className="border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={shareOnLinkedIn}
                      title={t('share.linkedin')}
                      className="border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                      title={copied ? t('share.copied') : t('share.copy')}
                      className="border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <LinkIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
    </div>
  );
}
