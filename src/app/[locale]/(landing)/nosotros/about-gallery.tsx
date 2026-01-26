'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { GalleryImage } from '@/features/admin/types';

interface AboutGalleryProps {
  images: GalleryImage[];
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function AboutGallery({ images }: AboutGalleryProps) {
  const t = useTranslations('nosotros');
  const locale = useLocale();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

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
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  const currentItem = images[currentIndex];

  return (
    <section className="py-20 md:py-28 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('gallery.title')}
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            {t('gallery.description')}
          </p>
        </div>

        {/* Gallery Grid - Masonry style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square overflow-hidden rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.thumbnail_url || image.image_url}
                alt={getLocalizedText(image, 'alt_text') || getLocalizedText(image, 'title') || 'Gallery image'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Video play icon */}
              {image.media_type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-purple-600/80 group-hover:scale-110 transition-all duration-300">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Title on hover */}
              {getLocalizedText(image, 'title') && (
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-medium truncate">
                    {getLocalizedText(image, 'title')}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
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
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Previous button */}
          {images.length > 1 && (
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

          {/* Content */}
          <div
            className="max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video or Image */}
            {currentItem.media_type === 'video' && currentItem.youtube_url ? (
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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentItem.image_url}
                alt={getLocalizedText(currentItem, 'alt_text') || getLocalizedText(currentItem, 'title') || 'Gallery image'}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}

            {/* Caption */}
            {(getLocalizedText(currentItem, 'title') || getLocalizedText(currentItem, 'description')) && (
              <div className="mt-4 text-center text-white max-w-2xl">
                {getLocalizedText(currentItem, 'title') && (
                  <h3 className="text-lg font-semibold">
                    {getLocalizedText(currentItem, 'title')}
                  </h3>
                )}
                {getLocalizedText(currentItem, 'description') && (
                  <p className="text-sm text-white/70 mt-1">
                    {getLocalizedText(currentItem, 'description')}
                  </p>
                )}
              </div>
            )}
            {/* Counter */}
            <p className="mt-4 text-white/50 text-sm">
              {currentIndex + 1} / {images.length}
            </p>
          </div>

          {/* Next button */}
          {images.length > 1 && (
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
    </section>
  );
}
