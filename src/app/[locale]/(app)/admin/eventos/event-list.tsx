'use client';

import { useState, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Eye,
  EyeOff,
  ExternalLink,
  Star,
  Loader2,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
  publishEventAction,
  unpublishEventAction,
} from '@/features/events/events.actions';
import type { Event, EventStatus } from '@/features/events/types';

interface EventListProps {
  events: Event[];
}

type FilterStatus = 'all' | EventStatus;

export function EventList({ events }: EventListProps) {
  const t = useTranslations('admin-eventos');
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const filteredEvents = filter === 'all'
    ? events
    : events.filter((e) => e.status === filter);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  const handleCreate = async (formData: FormData) => {
    // Convert featured checkbox to 'true'/'false' string as expected by the action
    if (formData.get('featured') === 'on') {
      formData.set('featured', 'true');
    } else if (!formData.get('featured')) {
      formData.set('featured', 'false');
    }

    startTransition(async () => {
      const result = await createEventAction(null, formData);
      if (result.success) {
        toast.success(t('toast.created'));
        setDialogOpen(false);
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingEvent) return;

    // Convert featured checkbox to 'true'/'false' string as expected by the action
    if (formData.get('featured') === 'on') {
      formData.set('featured', 'true');
    } else if (!formData.get('featured')) {
      formData.set('featured', 'false');
    }

    startTransition(async () => {
      const result = await updateEventAction(editingEvent.id, null, formData);
      if (result.success) {
        toast.success(t('toast.updated'));
        setEditingEvent(null);
        setDialogOpen(false);
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handlePublish = async (id: string) => {
    startTransition(async () => {
      const result = await publishEventAction(id);
      if (result.success) {
        toast.success(t('toast.published'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleUnpublish = async (id: string) => {
    startTransition(async () => {
      const result = await unpublishEventAction(id);
      if (result.success) {
        toast.success(t('toast.unpublished'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteEventAction(id);
      if (result.success) {
        toast.success(t('toast.deleted'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingEvent(null);
    setDialogOpen(false);
  };

  const getStatusBadge = (status: EventStatus) => {
    const variants: Record<string, string> = {
      draft: 'bg-neon/20 text-neon-foreground border-neon/30',
      published: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
    };
    return (
      <Badge className={`${variants[status]} border`}>
        {t(`status.${status}`)}
      </Badge>
    );
  };

  const isUpcoming = (date: Date) => new Date(date) > new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
          <TabsList>
            <TabsTrigger value="all">
              {t('filters.all')} ({events.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              {t('filters.published')}
            </TabsTrigger>
            <TabsTrigger value="draft">
              {t('filters.draft')}
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              {t('filters.cancelled')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (!open) closeDialog();
          else setDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('add')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? t('form.title.edit') : t('form.title.create')}
              </DialogTitle>
            </DialogHeader>
            <form action={editingEvent ? handleUpdate : handleCreate} className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">{t('form.eventTitle.label')}</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={editingEvent?.title || ''}
                  placeholder={t('form.eventTitle.placeholder')}
                />
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="shortDescription">{t('form.shortDescription.label')}</Label>
                <Input
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={editingEvent?.shortDescription || ''}
                  placeholder={t('form.shortDescription.placeholder')}
                  maxLength={300}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t('form.description.label')}</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={editingEvent?.description || ''}
                  placeholder={t('form.description.placeholder')}
                />
              </div>

              {/* English Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">{t('form.englishSection')}</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleEn">{t('form.titleEn.label')}</Label>
                    <Input
                      id="titleEn"
                      name="titleEn"
                      defaultValue={editingEvent?.titleEn || ''}
                      placeholder={t('form.titleEn.placeholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescriptionEn">{t('form.shortDescriptionEn.label')}</Label>
                    <Input
                      id="shortDescriptionEn"
                      name="shortDescriptionEn"
                      defaultValue={editingEvent?.shortDescriptionEn || ''}
                      placeholder={t('form.shortDescriptionEn.placeholder')}
                      maxLength={300}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descriptionEn">{t('form.descriptionEn.label')}</Label>
                    <Textarea
                      id="descriptionEn"
                      name="descriptionEn"
                      rows={3}
                      defaultValue={editingEvent?.descriptionEn || ''}
                      placeholder={t('form.descriptionEn.placeholder')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="locationNameEn">{t('form.locationNameEn.label')}</Label>
                      <Input
                        id="locationNameEn"
                        name="locationNameEn"
                        defaultValue={editingEvent?.locationNameEn || ''}
                        placeholder={t('form.locationNameEn.placeholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locationAddressEn">{t('form.locationAddressEn.label')}</Label>
                      <Input
                        id="locationAddressEn"
                        name="locationAddressEn"
                        defaultValue={editingEvent?.locationAddressEn || ''}
                        placeholder={t('form.locationAddressEn.placeholder')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Date / End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">{t('form.date.label')}</Label>
                  <Input
                    id="date"
                    name="date"
                    type="datetime-local"
                    required
                    defaultValue={formatDateForInput(editingEvent?.date || null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">{t('form.endDate.label')}</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    defaultValue={formatDateForInput(editingEvent?.endDate || null)}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="locationName">{t('form.locationName.label')}</Label>
                  <Input
                    id="locationName"
                    name="locationName"
                    defaultValue={editingEvent?.locationName || ''}
                    placeholder={t('form.locationName.placeholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationCity">{t('form.locationCity.label')}</Label>
                  <Input
                    id="locationCity"
                    name="locationCity"
                    defaultValue={editingEvent?.locationCity || 'Valencia'}
                    placeholder={t('form.locationCity.placeholder')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationAddress">{t('form.locationAddress.label')}</Label>
                <Input
                  id="locationAddress"
                  name="locationAddress"
                  defaultValue={editingEvent?.locationAddress || ''}
                  placeholder={t('form.locationAddress.placeholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationMapsUrl">{t('form.locationMapsUrl.label')}</Label>
                <Input
                  id="locationMapsUrl"
                  name="locationMapsUrl"
                  type="url"
                  defaultValue={editingEvent?.locationMapsUrl || ''}
                  placeholder={t('form.locationMapsUrl.placeholder')}
                />
              </div>

              {/* Image & Registration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">{t('form.imageUrl.label')}</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    defaultValue={editingEvent?.imageUrl || ''}
                    placeholder={t('form.imageUrl.placeholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationUrl">{t('form.registrationUrl.label')}</Label>
                  <Input
                    id="registrationUrl"
                    name="registrationUrl"
                    type="url"
                    defaultValue={editingEvent?.registrationUrl || ''}
                    placeholder={t('form.registrationUrl.placeholder')}
                  />
                </div>
              </div>

              {/* Max Attendees & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">{t('form.maxAttendees.label')}</Label>
                  <Input
                    id="maxAttendees"
                    name="maxAttendees"
                    type="number"
                    min="1"
                    defaultValue={editingEvent?.maxAttendees || ''}
                    placeholder={t('form.maxAttendees.placeholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">{t('form.status.label')}</Label>
                  <Select name="status" defaultValue={editingEvent?.status || 'draft'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{t('form.status.options.draft')}</SelectItem>
                      <SelectItem value="published">{t('form.status.options.published')}</SelectItem>
                      <SelectItem value="cancelled">{t('form.status.options.cancelled')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">{t('form.featured.label')}</Label>
                  <p className="text-xs text-muted-foreground">{t('form.featured.description')}</p>
                </div>
                <Switch
                  id="featured"
                  name="featured"
                  defaultChecked={editingEvent?.featured ?? false}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  {t('form.cancel')}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingEvent ? t('form.submit.edit') : t('form.submit.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-muted-foreground">{t('empty.title')}</h3>
            <p className="text-muted-foreground/70">{t('empty.description')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className={`hover:border-neon/50 transition-all ${
                !isUpcoming(event.date) && event.status === 'published' ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Image */}
                  {event.imageUrl && (
                    <div className="flex-shrink-0 w-full md:w-32 h-24 rounded-lg overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold truncate">{event.title}</h3>
                      {getStatusBadge(event.status)}
                      {event.featured && (
                        <Star className="w-4 h-4 text-neon-foreground fill-neon" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(event.date)}
                      </span>
                      {event.locationName && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.locationName}, {event.locationCity}
                        </span>
                      )}
                      {event.maxAttendees && (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.maxAttendees}
                        </span>
                      )}
                    </div>
                    {event.shortDescription && (
                      <p className="text-sm text-muted-foreground/70 mt-2 line-clamp-1">
                        {event.shortDescription}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(event)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      {t('actions.edit')}
                    </Button>

                    {event.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(event.id)}
                        disabled={isPending}
                        className="text-green-600 dark:text-green-400 border-green-500/30 hover:bg-green-500/10"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {t('actions.publish')}
                      </Button>
                    )}

                    {event.status === 'published' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnpublish(event.id)}
                          disabled={isPending}
                          className="text-neon-foreground border-neon/30 hover:bg-neon/10"
                        >
                          <EyeOff className="w-4 h-4 mr-1" />
                          {t('actions.unpublish')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <a
                            href={`/eventos/${event.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            {t('actions.viewPublic')}
                          </a>
                        </Button>
                      </>
                    )}

                    {/* Delete */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('confirmDelete.title')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('confirmDelete.description')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t('confirmDelete.cancel')}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(event.id)}
                            className="bg-red-600 hover:bg-red-500 text-white"
                          >
                            {t('confirmDelete.confirm')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
