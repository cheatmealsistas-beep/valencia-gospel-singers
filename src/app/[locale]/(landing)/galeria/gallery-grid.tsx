'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import type { GalleryImage, GalleryCategory } from '@/features/admin/types';

interface GalleryGridProps {
  images: GalleryImage[];
}

type FilterCategory = 'all' | GalleryCategory;

const CATEGORIES: GalleryCategory[] = ['conciertos', 'bodas', 'eventos', 'ensayos', 'otros'];

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const t = useTranslations('galeria');
  const locale = useLocale();
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages = filter === 'all'
    ? images
    : images.filter((img) => img.category === filter);

  // Get localized text
  const getLocalizedText = (item: GalleryImage, field: 'title' | 'description' | 'alt_text') => {
    if (locale === 'en') {
      const enField = `${field}_en` as keyof GalleryImage;
      return (item[enField] as string | null) || item[field];
    }
    return item[field];
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  // Only show categories that have images
  const availableCategories = CATEGORIES.filter((cat) =>
    images.some((img) => img.category === cat)
  );

  const currentItem = filteredImages[currentIndex];

  return (
    <>
      {/* Filters */}
      {availableCategories.length > 1 && (
        <div className="flex justify-center mb-8">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterCategory)}>
            <TabsList className="flex-wrap h-auto bg-surface-elevated border border-hairline">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-neon data-[state=active]:text-on-neon text-on-surface-muted"
              >
                {t('filters.all')}
              </TabsTrigger>
              {availableCategories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="data-[state=active]:bg-neon data-[state=active]:text-on-neon text-on-surface-muted"
                >
                  {t(`filters.${cat}`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-on-surface/5 border border-hairline focus:outline-none focus:ring-2 focus:ring-neon focus:ring-offset-2 focus:ring-offset-surface"
          >
            {(() => {
              const isUploadedVideo = image.media_type === 'video' && !image.youtube_url;
              const thumbnailSrc = image.thumbnail_url || (!isUploadedVideo ? image.image_url : null);
              return thumbnailSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnailSrc}
                  alt={getLocalizedText(image, 'alt_text') || getLocalizedText(image, 'title') || 'Gallery image'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-elevated">
                  <Play className="w-12 h-12 text-on-surface-muted" />
                </div>
              );
            })()}
            {/* Video play icon */}
            {image.media_type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-surface/60 backdrop-blur-sm flex items-center justify-center border border-hairline group-hover:bg-neon/80 group-hover:scale-110 transition-all duration-300">
                  <Play className="w-7 h-7 text-on-surface fill-white ml-1" />
                </div>
              </div>
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Title on hover */}
            {getLocalizedText(image, 'title') && (
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-on-surface text-sm font-medium truncate">
                  {getLocalizedText(image, 'title')}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentItem && (
        <div
          className="fixed inset-0 z-50 bg-surface/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label={currentItem.media_type === 'video' ? 'Video lightbox' : 'Image lightbox'}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-on-surface hover:bg-white/20 z-10"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Previous button */}
          {filteredImages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-on-surface hover:bg-white/20 z-10"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}

          {/* Content */}
          <div
            className="max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video or Image */}
            {currentItem.media_type === 'video' ? (
              currentItem.youtube_url ? (
                <div className="w-full aspect-video max-w-4xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(currentItem.youtube_url)}?autoplay=1`}
                    title={getLocalizedText(currentItem, 'title') || 'Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video max-w-4xl">
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video
                    src={currentItem.image_url}
                    poster={currentItem.thumbnail_url || undefined}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full rounded-lg bg-surface"
                  />
                </div>
              )
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentItem.image_url}
                alt={getLocalizedText(currentItem, 'alt_text') || getLocalizedText(currentItem, 'title') || 'Gallery image'}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}

            {/* Caption */}
            {(getLocalizedText(currentItem, 'title') || getLocalizedText(currentItem, 'description')) && (
              <div className="mt-4 text-center text-on-surface max-w-2xl">
                {getLocalizedText(currentItem, 'title') && (
                  <h3 className="text-lg font-semibold">
                    {getLocalizedText(currentItem, 'title')}
                  </h3>
                )}
                {getLocalizedText(currentItem, 'description') && (
                  <p className="text-sm text-on-surface-muted mt-1">
                    {getLocalizedText(currentItem, 'description')}
                  </p>
                )}
              </div>
            )}
            {/* Counter */}
            <p className="mt-4 text-on-surface-muted text-sm">
              {currentIndex + 1} / {filteredImages.length}
            </p>
          </div>

          {/* Next button */}
          {filteredImages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-on-surface hover:bg-white/20 z-10"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}
        </div>
      )}
    </>
  );
}
