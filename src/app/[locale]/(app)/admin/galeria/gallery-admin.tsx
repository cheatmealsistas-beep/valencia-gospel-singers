'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Video,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Loader2,
  Play,
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
import type { GalleryImage, GalleryImageInput, GalleryCategory, MediaType } from '@/features/admin/types';

interface GalleryAdminProps {
  images: GalleryImage[];
}

type FilterCategory = 'all' | GalleryCategory;

const CATEGORIES: GalleryCategory[] = ['conciertos', 'bodas', 'eventos', 'ensayos', 'otros'];
const MEDIA_TYPES: MediaType[] = ['image', 'video'];

export function GalleryAdmin({ images }: GalleryAdminProps) {
  const t = useTranslations('admin-galeria');
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('image');

  const filteredImages = filter === 'all'
    ? images
    : images.filter((img) => img.category === filter);

  const handleCreate = async (formData: FormData) => {
    const input: GalleryImageInput = {
      media_type: formData.get('media_type') as MediaType || 'image',
      image_url: formData.get('image_url') as string,
      thumbnail_url: (formData.get('thumbnail_url') as string) || null,
      youtube_url: (formData.get('youtube_url') as string) || null,
      // Spanish
      title: (formData.get('title') as string) || null,
      description: (formData.get('description') as string) || null,
      alt_text: (formData.get('alt_text') as string) || null,
      // English
      title_en: (formData.get('title_en') as string) || null,
      description_en: (formData.get('description_en') as string) || null,
      alt_text_en: (formData.get('alt_text_en') as string) || null,
      // Common
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
        setMediaType('image');
      } else {
        toast.error(result.error || t('toast.error'));
      }
    });
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingImage) return;

    const input: Partial<GalleryImageInput> = {
      media_type: formData.get('media_type') as MediaType || 'image',
      image_url: formData.get('image_url') as string,
      thumbnail_url: (formData.get('thumbnail_url') as string) || null,
      youtube_url: (formData.get('youtube_url') as string) || null,
      // Spanish
      title: (formData.get('title') as string) || null,
      description: (formData.get('description') as string) || null,
      alt_text: (formData.get('alt_text') as string) || null,
      // English
      title_en: (formData.get('title_en') as string) || null,
      description_en: (formData.get('description_en') as string) || null,
      alt_text_en: (formData.get('alt_text_en') as string) || null,
      // Common
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
        setMediaType('image');
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
    setMediaType(image.media_type || 'image');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingImage(null);
    setMediaType('image');
    setDialogOpen(false);
  };

  const currentMediaType = editingImage ? (editingImage.media_type || 'image') : mediaType;

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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? t('form.title.edit') : t('form.title.create')}
              </DialogTitle>
            </DialogHeader>
            <form action={editingImage ? handleUpdate : handleCreate} className="space-y-6">
              {/* Media Type Selection */}
              <div className="space-y-2">
                <Label>{t('form.mediaType.label')}</Label>
                <div className="flex gap-2">
                  {MEDIA_TYPES.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={currentMediaType === type ? 'default' : 'outline'}
                      onClick={() => setMediaType(type)}
                      className={currentMediaType === type ? 'bg-purple-600 hover:bg-purple-500' : ''}
                    >
                      {type === 'image' ? <ImageIcon className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
                      {type === 'image' ? 'Imagen' : 'Vídeo YouTube'}
                    </Button>
                  ))}
                </div>
                <input type="hidden" name="media_type" value={currentMediaType} />
              </div>

              {/* YouTube URL (only for video) */}
              {currentMediaType === 'video' && (
                <div className="space-y-2">
                  <Label htmlFor="youtube_url">{t('form.youtubeUrl.label')}</Label>
                  <Input
                    id="youtube_url"
                    name="youtube_url"
                    type="url"
                    defaultValue={editingImage?.youtube_url || ''}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground">{t('form.youtubeUrl.help')}</p>
                </div>
              )}

              {/* Image/Thumbnail URL */}
              <div className="space-y-2">
                <Label htmlFor="image_url">
                  {currentMediaType === 'video' ? t('form.thumbnailUrl.label') : t('form.imageUrl.label')}
                </Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  required
                  defaultValue={editingImage?.image_url || ''}
                  placeholder={t('form.imageUrl.placeholder')}
                />
                <p className="text-xs text-muted-foreground">
                  {currentMediaType === 'video' ? t('form.thumbnailUrl.help') : t('form.imageUrl.help')}
                </p>
              </div>

              {/* Spanish Fields */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  🇪🇸 Español
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="title">{t('form.imageTitle.label')}</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingImage?.title || ''}
                    placeholder={t('form.imageTitle.placeholder')}
                  />
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="alt_text">{t('form.altText.label')}</Label>
                  <Input
                    id="alt_text"
                    name="alt_text"
                    defaultValue={editingImage?.alt_text || ''}
                    placeholder={t('form.altText.placeholder')}
                  />
                </div>
              </div>

              {/* English Fields */}
              <div className="space-y-4 p-4 border rounded-lg border-dashed">
                <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                  🇬🇧 English (opcional)
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="title_en">Title</Label>
                  <Input
                    id="title_en"
                    name="title_en"
                    defaultValue={editingImage?.title_en || ''}
                    placeholder="Title in English"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_en">Description</Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    rows={2}
                    defaultValue={editingImage?.description_en || ''}
                    placeholder="Description in English"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alt_text_en">Alt text</Label>
                  <Input
                    id="alt_text_en"
                    name="alt_text_en"
                    defaultValue={editingImage?.alt_text_en || ''}
                    placeholder="Alt text in English"
                  />
                </div>
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
                <Button type="submit" disabled={isPending} className="bg-purple-600 hover:bg-purple-500">
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
                {/* Video play icon overlay */}
                {image.media_type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                )}
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
                  {image.media_type === 'video' && (
                    <Badge className="bg-red-500/90 text-white border-0">
                      <Video className="w-3 h-3 mr-1" />
                      Video
                    </Badge>
                  )}
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
