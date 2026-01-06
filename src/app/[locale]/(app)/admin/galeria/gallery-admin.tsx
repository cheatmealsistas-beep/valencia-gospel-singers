'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Star,
  StarOff,
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
  createGalleryImageAction,
  updateGalleryImageAction,
  toggleGalleryImageAction,
  toggleGalleryImageFeaturedAction,
  deleteGalleryImageAction,
} from '@/features/admin/admin.actions';
import type { GalleryImage, GalleryImageInput, GalleryCategory } from '@/features/admin/types';

interface GalleryAdminProps {
  images: GalleryImage[];
}

type FilterCategory = 'all' | GalleryCategory;

const CATEGORIES: GalleryCategory[] = ['conciertos', 'bodas', 'eventos', 'ensayos', 'otros'];

export function GalleryAdmin({ images }: GalleryAdminProps) {
  const t = useTranslations('admin-galeria');
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  const filteredImages = filter === 'all'
    ? images
    : images.filter((img) => img.category === filter);

  const handleCreate = async (formData: FormData) => {
    const input: GalleryImageInput = {
      image_url: formData.get('image_url') as string,
      thumbnail_url: (formData.get('thumbnail_url') as string) || null,
      title: (formData.get('title') as string) || null,
      description: (formData.get('description') as string) || null,
      alt_text: (formData.get('alt_text') as string) || null,
      category: (formData.get('category') as GalleryCategory) || 'otros',
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_featured: formData.get('is_featured') === 'on',
      is_active: formData.get('is_active') === 'on',
    };

    startTransition(async () => {
      const result = await createGalleryImageAction(input);
      if (result.success) {
        toast.success(t('toast.created'));
        setDialogOpen(false);
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingImage) return;

    const input: Partial<GalleryImageInput> = {
      image_url: formData.get('image_url') as string,
      thumbnail_url: (formData.get('thumbnail_url') as string) || null,
      title: (formData.get('title') as string) || null,
      description: (formData.get('description') as string) || null,
      alt_text: (formData.get('alt_text') as string) || null,
      category: (formData.get('category') as GalleryCategory) || 'otros',
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_featured: formData.get('is_featured') === 'on',
      is_active: formData.get('is_active') === 'on',
    };

    startTransition(async () => {
      const result = await updateGalleryImageAction(editingImage.id, input);
      if (result.success) {
        toast.success(t('toast.updated'));
        setEditingImage(null);
        setDialogOpen(false);
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    startTransition(async () => {
      const result = await toggleGalleryImageAction(id, !currentActive);
      if (result.success) {
        toast.success(t('toast.toggled'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    startTransition(async () => {
      const result = await toggleGalleryImageFeaturedAction(id, !currentFeatured);
      if (result.success) {
        toast.success(t('toast.featured'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteGalleryImageAction(id);
      if (result.success) {
        toast.success(t('toast.deleted'));
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const openEditDialog = (image: GalleryImage) => {
    setEditingImage(image);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingImage(null);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with filters and add button */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterCategory)}>
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="all">
              {t('tabs.all')} ({images.length})
            </TabsTrigger>
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {t(`tabs.${cat}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (!open) closeDialog();
          else setDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-500">
              <Plus className="w-4 h-4 mr-2" />
              {t('addNew')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? t('form.title.edit') : t('form.title.create')}
              </DialogTitle>
            </DialogHeader>
            <form action={editingImage ? handleUpdate : handleCreate} className="space-y-4">
              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image_url">{t('form.imageUrl.label')}</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  required
                  defaultValue={editingImage?.image_url || ''}
                  placeholder={t('form.imageUrl.placeholder')}
                />
                <p className="text-xs text-muted-foreground">{t('form.imageUrl.help')}</p>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">{t('form.thumbnailUrl.label')}</Label>
                <Input
                  id="thumbnail_url"
                  name="thumbnail_url"
                  type="url"
                  defaultValue={editingImage?.thumbnail_url || ''}
                  placeholder={t('form.thumbnailUrl.placeholder')}
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">{t('form.imageTitle.label')}</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingImage?.title || ''}
                  placeholder={t('form.imageTitle.placeholder')}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t('form.description.label')}</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={2}
                  defaultValue={editingImage?.description || ''}
                  placeholder={t('form.description.placeholder')}
                />
              </div>

              {/* Alt Text */}
              <div className="space-y-2">
                <Label htmlFor="alt_text">{t('form.altText.label')}</Label>
                <Input
                  id="alt_text"
                  name="alt_text"
                  defaultValue={editingImage?.alt_text || ''}
                  placeholder={t('form.altText.placeholder')}
                />
              </div>

              {/* Category & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">{t('form.category.label')}</Label>
                  <Select name="category" defaultValue={editingImage?.category || 'otros'}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.category.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {t(`tabs.${cat}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">{t('form.displayOrder.label')}</Label>
                  <Input
                    id="display_order"
                    name="display_order"
                    type="number"
                    defaultValue={editingImage?.display_order || 0}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Is Featured */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_featured">{t('form.isFeatured.label')}</Label>
                  <p className="text-xs text-muted-foreground">{t('form.isFeatured.description')}</p>
                </div>
                <Switch
                  id="is_featured"
                  name="is_featured"
                  defaultChecked={editingImage?.is_featured ?? false}
                />
              </div>

              {/* Is Active */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_active">{t('form.isActive.label')}</Label>
                  <p className="text-xs text-muted-foreground">{t('form.isActive.description')}</p>
                </div>
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={editingImage?.is_active ?? true}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  {t('form.cancel')}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingImage ? t('form.save') : t('form.save')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Images Grid */}
      {filteredImages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-muted-foreground">{t('empty.title')}</h3>
            <p className="text-muted-foreground/70">{t('empty.description')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Card
              key={image.id}
              className={`group overflow-hidden hover:border-purple-500/50 transition-all ${
                !image.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="relative aspect-square bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.thumbnail_url || image.image_url}
                  alt={image.alt_text || image.title || 'Gallery image'}
                  className="w-full h-full object-cover"
                />
                {/* Overlay with actions on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditDialog(image)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleToggle(image.id, image.is_active)}
                    disabled={isPending}
                  >
                    {image.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleToggleFeatured(image.id, image.is_featured)}
                    disabled={isPending}
                  >
                    {image.is_featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
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
                          onClick={() => handleDelete(image.id)}
                          className="bg-red-600 hover:bg-red-500 text-white"
                        >
                          {t('confirmDelete.confirm')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {image.is_featured && (
                    <Badge className="bg-purple-500/90 text-white border-0">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {t('card.featured')}
                    </Badge>
                  )}
                </div>
                {!image.is_active && (
                  <Badge className="absolute top-2 right-2 bg-gray-500/90 text-white border-0">
                    {t('status.inactive')}
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate text-foreground">
                  {image.title || 'Sin título'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t(`tabs.${image.category}`)} · {t('card.order')}: {image.display_order}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
