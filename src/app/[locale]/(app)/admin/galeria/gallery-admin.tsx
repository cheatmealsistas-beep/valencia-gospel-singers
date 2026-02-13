'use client';

import { useState, useRef, useTransition } from 'react';
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
  Upload,
  X,
  FileVideo,
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
  uploadMediaAction,
} from '@/features/admin/admin.actions';
import type { GalleryImage, GalleryImageInput, GalleryCategory, MediaType } from '@/features/admin/types';

interface GalleryAdminProps {
  images: GalleryImage[];
}

type FilterCategory = 'all' | GalleryCategory;
type ContentMode = 'image' | 'video_upload' | 'video_youtube';

const CATEGORIES: GalleryCategory[] = ['conciertos', 'bodas', 'eventos', 'ensayos', 'otros'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function GalleryAdmin({ images }: GalleryAdminProps) {
  const t = useTranslations('admin-galeria');
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [contentMode, setContentMode] = useState<ContentMode>('image');
  const [isUploading, setIsUploading] = useState(false);

  // File upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Refs for hidden file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const filteredImages = filter === 'all'
    ? images
    : images.filter((img) => img.category === filter);

  // Upload a file and return its URL
  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const result = await uploadMediaAction(formData);
    if (!result.success) {
      toast.error(result.error || t('toast.uploadError'));
      return null;
    }
    return result.data!.url;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('JPG, PNG, WebP or GIF only');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Max 5MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('MP4, WebM or MOV only');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Max 100MB');
      return;
    }

    setVideoFile(file);
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('JPG, PNG, WebP or GIF only');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Max 5MB');
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const clearImageFile = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const clearVideoFile = () => {
    setVideoFile(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const clearThumbnailFile = () => {
    setThumbnailFile(null);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      setIsUploading(true);
      try {
        let imageUrl: string | null = null;
        let thumbnailUrl: string | null = null;

        // Upload files based on content mode
        if (contentMode === 'image') {
          if (imageFile) {
            const url = await uploadFile(imageFile, 'gallery');
            if (!url) return;
            imageUrl = url;
          } else if (editingImage) {
            imageUrl = editingImage.image_url;
          }
          if (!imageUrl) {
            toast.error(t('toast.error'));
            return;
          }
        } else if (contentMode === 'video_upload') {
          if (videoFile) {
            const url = await uploadFile(videoFile, 'gallery/videos');
            if (!url) return;
            imageUrl = url;
          } else if (editingImage) {
            imageUrl = editingImage.image_url;
          }
          if (!imageUrl) {
            toast.error(t('toast.error'));
            return;
          }
        } else {
          // video_youtube - image_url comes from the thumbnail URL input or existing
          imageUrl = (formData.get('image_url') as string) || editingImage?.image_url || '';
        }

        // Upload thumbnail if provided
        if (thumbnailFile) {
          const url = await uploadFile(thumbnailFile, 'gallery/thumbnails');
          if (!url) return;
          thumbnailUrl = url;
        } else if (contentMode === 'video_youtube') {
          thumbnailUrl = (formData.get('thumbnail_url') as string) || null;
        } else if (editingImage?.thumbnail_url) {
          thumbnailUrl = editingImage.thumbnail_url;
        }

        const mediaType: MediaType = contentMode === 'image' ? 'image' : 'video';
        const youtubeUrl = contentMode === 'video_youtube'
          ? (formData.get('youtube_url') as string) || null
          : null;

        const input: GalleryImageInput = {
          media_type: mediaType,
          image_url: imageUrl,
          thumbnail_url: thumbnailUrl,
          youtube_url: youtubeUrl,
          title: (formData.get('title') as string) || null,
          description: (formData.get('description') as string) || null,
          alt_text: (formData.get('alt_text') as string) || null,
          title_en: (formData.get('title_en') as string) || null,
          description_en: (formData.get('description_en') as string) || null,
          alt_text_en: (formData.get('alt_text_en') as string) || null,
          category: (formData.get('category') as GalleryCategory) || 'otros',
          display_order: parseInt(formData.get('display_order') as string) || 0,
          is_featured: formData.get('is_featured') === 'on',
          is_active: formData.get('is_active') === 'on',
        };

        const result = editingImage
          ? await updateGalleryImageAction(editingImage.id, input)
          : await createGalleryImageAction(input);

        if (result.success) {
          toast.success(editingImage ? t('toast.updated') : t('toast.created'));
          closeDialog();
        } else {
          toast.error(result.error || t('toast.error'));
        }
      } finally {
        setIsUploading(false);
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
    if (image.media_type === 'image') {
      setContentMode('image');
      setImagePreview(image.image_url);
    } else if (image.youtube_url) {
      setContentMode('video_youtube');
    } else {
      setContentMode('video_upload');
    }
    if (image.thumbnail_url) {
      setThumbnailPreview(image.thumbnail_url);
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingImage(null);
    setContentMode('image');
    clearImageFile();
    clearVideoFile();
    clearThumbnailFile();
    // Clear previews from editing existing items
    setImagePreview(null);
    setThumbnailPreview(null);
    setDialogOpen(false);
  };

  const isBusy = isPending || isUploading;

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
            <form action={handleSubmit} className="space-y-6">
              {/* Content Mode Selection - 3 options */}
              <div className="space-y-2">
                <Label>{t('form.mediaType.label')}</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={contentMode === 'image' ? 'default' : 'outline'}
                    onClick={() => setContentMode('image')}
                    className={contentMode === 'image' ? 'bg-purple-600 hover:bg-purple-500' : ''}
                    size="sm"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {t('form.mediaType.image')}
                  </Button>
                  <Button
                    type="button"
                    variant={contentMode === 'video_upload' ? 'default' : 'outline'}
                    onClick={() => setContentMode('video_upload')}
                    className={contentMode === 'video_upload' ? 'bg-purple-600 hover:bg-purple-500' : ''}
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t('form.mediaType.videoUpload')}
                  </Button>
                  <Button
                    type="button"
                    variant={contentMode === 'video_youtube' ? 'default' : 'outline'}
                    onClick={() => setContentMode('video_youtube')}
                    className={contentMode === 'video_youtube' ? 'bg-purple-600 hover:bg-purple-500' : ''}
                    size="sm"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {t('form.mediaType.videoYoutube')}
                  </Button>
                </div>
              </div>

              {/* === IMAGE UPLOAD === */}
              {contentMode === 'image' && (
                <div className="space-y-3">
                  <Label>{t('form.imageUrl.label')}</Label>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative w-full max-w-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full aspect-square object-cover rounded-lg border"
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => imageInputRef.current?.click()}
                        >
                          {t('form.upload.changeFile')}
                        </Button>
                        {imageFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearImageFile}
                          >
                            <X className="w-4 h-4 mr-1" />
                            {t('form.upload.removeFile')}
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full border-2 border-dashed rounded-lg p-8 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors"
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">{t('form.upload.selectImage')}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t('form.upload.imageHint')}</p>
                    </button>
                  )}
                  {imageFile && (
                    <p className="text-xs text-muted-foreground">
                      {imageFile.name} ({formatFileSize(imageFile.size)})
                    </p>
                  )}
                </div>
              )}

              {/* === VIDEO UPLOAD === */}
              {contentMode === 'video_upload' && (
                <div className="space-y-4">
                  {/* Video file */}
                  <div className="space-y-3">
                    <Label>{t('form.upload.selectVideo')}</Label>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoSelect}
                      className="hidden"
                    />
                    {videoFile ? (
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                        <FileVideo className="w-8 h-8 text-purple-500 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{videoFile.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(videoFile.size)}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => videoInputRef.current?.click()}
                          >
                            {t('form.upload.changeFile')}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearVideoFile}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : editingImage && editingImage.media_type === 'video' && !editingImage.youtube_url ? (
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                        <FileVideo className="w-8 h-8 text-purple-500 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{t('form.upload.currentFile')}</p>
                          <p className="text-xs text-muted-foreground truncate">{editingImage.image_url}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => videoInputRef.current?.click()}
                        >
                          {t('form.upload.changeFile')}
                        </Button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="w-full border-2 border-dashed rounded-lg p-8 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors"
                      >
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">{t('form.upload.selectVideo')}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t('form.upload.videoHint')}</p>
                      </button>
                    )}
                  </div>

                  {/* Thumbnail for uploaded video */}
                  <div className="space-y-3">
                    <Label>{t('form.upload.selectThumbnail')}</Label>
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                    {thumbnailPreview ? (
                      <div className="relative w-full max-w-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full aspect-video object-cover rounded-lg border"
                        />
                        <div className="flex gap-2 mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => thumbnailInputRef.current?.click()}
                          >
                            {t('form.upload.changeFile')}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearThumbnailFile}
                          >
                            <X className="w-4 h-4 mr-1" />
                            {t('form.upload.removeFile')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="w-full border-2 border-dashed rounded-lg p-4 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors"
                      >
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-sm font-medium">{t('form.upload.selectThumbnail')}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t('form.upload.thumbnailHint')}</p>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* === VIDEO YOUTUBE === */}
              {contentMode === 'video_youtube' && (
                <>
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

                  {/* Thumbnail URL for YouTube */}
                  <div className="space-y-2">
                    <Label htmlFor="image_url">{t('form.thumbnailUrl.label')}</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      type="url"
                      required
                      defaultValue={editingImage?.image_url || ''}
                      placeholder={t('form.imageUrl.placeholder')}
                    />
                    <p className="text-xs text-muted-foreground">{t('form.thumbnailUrl.help')}</p>
                  </div>

                  {/* Optional additional thumbnail */}
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
                </>
              )}

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
                <Button type="submit" disabled={isBusy} className="bg-purple-600 hover:bg-purple-500">
                  {isBusy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isUploading ? t('form.upload.uploading') : t('form.save')}
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
          {filteredImages.map((image) => {
            const isUploadedVideo = image.media_type === 'video' && !image.youtube_url;
            const thumbnailSrc = image.thumbnail_url || (!isUploadedVideo ? image.image_url : null);

            return (
              <Card
                key={image.id}
                className={`group overflow-hidden hover:border-purple-500/50 transition-all ${
                  !image.is_active ? 'opacity-60' : ''
                }`}
              >
                <div className="relative aspect-square bg-muted">
                  {thumbnailSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnailSrc}
                      alt={image.alt_text || image.title || 'Gallery image'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <Play className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                  {/* Video play icon overlay */}
                  {image.media_type === 'video' && thumbnailSrc && (
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
            );
          })}
        </div>
      )}
    </div>
  );
}
