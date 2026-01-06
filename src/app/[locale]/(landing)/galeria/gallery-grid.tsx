'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import type { GalleryImage, GalleryCategory } from '@/features/admin/types';

interface GalleryGridProps {
  images: GalleryImage[];
}

type FilterCategory = 'all' | GalleryCategory;

const CATEGORIES: GalleryCategory[] = ['conciertos', 'bodas', 'eventos', 'ensayos', 'otros'];

export function GalleryGrid({ images }: GalleryGridProps) {
  const t = useTranslations('galeria');
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages = filter === 'all'
    ? images
    : images.filter((img) => img.category === filter);

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

  return (
    <>
      {/* Filters */}
      {availableCategories.length > 1 && (
        <div className="flex justify-center mb-8">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterCategory)}>
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all">
                {t('filters.all')}
              </TabsTrigger>
              {availableCategories.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
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
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.thumbnail_url || image.image_url}
              alt={image.alt_text || image.title || 'Gallery image'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            {/* Title on hover */}
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium truncate">
                  {image.title}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && filteredImages[currentIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Previous button */}
          {filteredImages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-white/20 z-10"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filteredImages[currentIndex].image_url}
              alt={filteredImages[currentIndex].alt_text || filteredImages[currentIndex].title || 'Gallery image'}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {/* Caption */}
            {(filteredImages[currentIndex].title || filteredImages[currentIndex].description) && (
              <div className="mt-4 text-center text-white max-w-2xl">
                {filteredImages[currentIndex].title && (
                  <h3 className="text-lg font-semibold">
                    {filteredImages[currentIndex].title}
                  </h3>
                )}
                {filteredImages[currentIndex].description && (
                  <p className="text-sm text-white/70 mt-1">
                    {filteredImages[currentIndex].description}
                  </p>
                )}
              </div>
            )}
            {/* Counter */}
            <p className="mt-4 text-white/50 text-sm">
              {currentIndex + 1} / {filteredImages.length}
            </p>
          </div>

          {/* Next button */}
          {filteredImages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/20 z-10"
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
