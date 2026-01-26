'use client';

import { useState, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Star,
  Loader2,
  Briefcase,
  Euro,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
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
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
  publishServiceAction,
  unpublishServiceAction,
} from '@/features/services/services.actions';
import type { Service } from '@/features/services/types';

interface ServiceListProps {
  services: Service[];
}

type FilterStatus = 'all' | 'published' | 'draft';

export function ServiceList({ services }: ServiceListProps) {
  const t = useTranslations('admin-servicios');
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const filteredServices =
    filter === 'all'
      ? services
      : filter === 'published'
        ? services.filter((s) => s.isPublished)
        : services.filter((s) => !s.isPublished);

  const formatPrice = (price: number | null) => {
    if (price === null) return null;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handleCreate = async (formData: FormData) => {
    // Convert switches to 'true'/'false' strings
    formData.set('isPublished', formData.get('isPublished') === 'on' ? 'true' : 'false');
    formData.set('isFeatured', formData.get('isFeatured') === 'on' ? 'true' : 'false');

    startTransition(async () => {
      const result = await createServiceAction(null, formData);
      if (result.success) {
        toast.success(t('toast.created'));
        setDialogOpen(false);
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingService) return;

    // Convert switches to 'true'/'false' strings
    formData.set('isPublished', formData.get('isPublished') === 'on' ? 'true' : 'false');
    formData.set('isFeatured', formData.get('isFeatured') === 'on' ? 'true' : 'false');

    startTransition(async () => {
      const result = await updateServiceAction(editingService.id, null, formData);
      if (result.success) {
        toast.success(t('toast.updated'));
        setEditingService(null);
        setDialogOpen(false);
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handlePublish = async (id: string) => {
    startTransition(async () => {
      const result = await publishServiceAction(id);
      if (result.success) {
        toast.success(t('toast.published'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleUnpublish = async (id: string) => {
    startTransition(async () => {
      const result = await unpublishServiceAction(id);
      if (result.success) {
        toast.success(t('toast.unpublished'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteServiceAction(id);
      if (result.success) {
        toast.success(t('toast.deleted'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingService(null);
    setDialogOpen(false);
  };

  const getStatusBadge = (isPublished: boolean) => {
    if (isPublished) {
      return (
        <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 border">
          {t('status.published')}
        </Badge>
      );
    }
    return (
      <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30 border">
        {t('status.draft')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
          <TabsList>
            <TabsTrigger value="all">
              {t('filters.all')} ({services.length})
            </TabsTrigger>
            <TabsTrigger value="published">{t('filters.published')}</TabsTrigger>
            <TabsTrigger value="draft">{t('filters.draft')}</TabsTrigger>
          </TabsList>
        </Tabs>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (!open) closeDialog();
            else setDialogOpen(true);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('add')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? t('form.title.edit') : t('form.title.create')}
              </DialogTitle>
            </DialogHeader>
            <form action={editingService ? handleUpdate : handleCreate} className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">{t('form.serviceTitle.label')}</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={editingService?.title || ''}
                  placeholder={t('form.serviceTitle.placeholder')}
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <Label htmlFor="subtitle">{t('form.subtitle.label')}</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  defaultValue={editingService?.subtitle || ''}
                  placeholder={t('form.subtitle.placeholder')}
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
                  defaultValue={editingService?.description || ''}
                  placeholder={t('form.description.placeholder')}
                />
              </div>

              {/* English Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  {t('form.englishSection')}
                </h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleEn">{t('form.titleEn.label')}</Label>
                    <Input
                      id="titleEn"
                      name="titleEn"
                      defaultValue={editingService?.titleEn || ''}
                      placeholder={t('form.titleEn.placeholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitleEn">{t('form.subtitleEn.label')}</Label>
                    <Input
                      id="subtitleEn"
                      name="subtitleEn"
                      defaultValue={editingService?.subtitleEn || ''}
                      placeholder={t('form.subtitleEn.placeholder')}
                      maxLength={300}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descriptionEn">{t('form.descriptionEn.label')}</Label>
                    <Textarea
                      id="descriptionEn"
                      name="descriptionEn"
                      rows={3}
                      defaultValue={editingService?.descriptionEn || ''}
                      placeholder={t('form.descriptionEn.placeholder')}
                    />
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">{t('form.imageUrl.label')}</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  defaultValue={editingService?.imageUrl || ''}
                  placeholder={t('form.imageUrl.placeholder')}
                />
              </div>

              {/* Price & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceFrom">{t('form.priceFrom.label')}</Label>
                  <Input
                    id="priceFrom"
                    name="priceFrom"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingService?.priceFrom || ''}
                    placeholder={t('form.priceFrom.placeholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">{t('form.displayOrder.label')}</Label>
                  <Input
                    id="displayOrder"
                    name="displayOrder"
                    type="number"
                    min="0"
                    defaultValue={editingService?.displayOrder || 0}
                    placeholder={t('form.displayOrder.placeholder')}
                  />
                </div>
              </div>

              {/* Published */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isPublished">{t('form.isPublished.label')}</Label>
                  <p className="text-xs text-muted-foreground">{t('form.isPublished.description')}</p>
                </div>
                <Switch
                  id="isPublished"
                  name="isPublished"
                  defaultChecked={editingService?.isPublished ?? false}
                />
              </div>

              {/* Featured */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isFeatured">{t('form.isFeatured.label')}</Label>
                  <p className="text-xs text-muted-foreground">{t('form.isFeatured.description')}</p>
                </div>
                <Switch
                  id="isFeatured"
                  name="isFeatured"
                  defaultChecked={editingService?.isFeatured ?? false}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  {t('form.cancel')}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingService ? t('form.submit.edit') : t('form.submit.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-muted-foreground">{t('empty.title')}</h3>
            <p className="text-muted-foreground/70">{t('empty.description')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:border-purple-500/50 transition-all">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Image */}
                  {service.imageUrl && (
                    <div className="flex-shrink-0 w-full md:w-32 h-24 rounded-lg overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold truncate">{service.title}</h3>
                      {getStatusBadge(service.isPublished)}
                      {service.isFeatured && (
                        <Star className="w-4 h-4 text-purple-500 fill-purple-500" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {service.priceFrom !== null && (
                        <span className="flex items-center gap-1">
                          <Euro className="w-4 h-4" />
                          {t('card.priceFrom')} {formatPrice(service.priceFrom)}
                        </span>
                      )}
                      <span className="text-muted-foreground/60">
                        {t('card.order')}: {service.displayOrder}
                      </span>
                    </div>
                    {service.subtitle && (
                      <p className="text-sm text-muted-foreground/70 mt-2 line-clamp-1">
                        {service.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(service)}>
                      <Pencil className="w-4 h-4 mr-1" />
                      {t('actions.edit')}
                    </Button>

                    {!service.isPublished && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(service.id)}
                        disabled={isPending}
                        className="text-green-600 dark:text-green-400 border-green-500/30 hover:bg-green-500/10"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {t('actions.publish')}
                      </Button>
                    )}

                    {service.isPublished && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnpublish(service.id)}
                          disabled={isPending}
                          className="text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                        >
                          <EyeOff className="w-4 h-4 mr-1" />
                          {t('actions.unpublish')}
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={`/servicios/${service.slug}`}
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
                          <AlertDialogCancel>{t('confirmDelete.cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(service.id)}
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
