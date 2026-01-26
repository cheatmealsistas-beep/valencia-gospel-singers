import { getTranslations } from 'next-intl/server';
import { getActiveGalleryImages } from '@/features/admin/admin.query';
import { GalleryGrid } from './gallery-grid';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Camera, Video } from 'lucide-react';

export async function generateMetadata() {
  const t = await getTranslations('galeria');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function GaleriaPage() {
  const t = await getTranslations('galeria');
  const images = await getActiveGalleryImages();

  // Count videos and images
  const videoCount = images.filter(img => img.media_type === 'video').length;
  const imageCount = images.length - videoCount;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-purple-950/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
              {t('hero.description')}
            </p>

            {/* Stats */}
            {images.length > 0 && (
              <div className="flex items-center justify-center gap-8 mt-8">
                {imageCount > 0 && (
                  <div className="flex items-center gap-2 text-white/40">
                    <Camera className="w-5 h-5" />
                    <span className="text-sm">{imageCount} {imageCount === 1 ? 'foto' : 'fotos'}</span>
                  </div>
                )}
                {videoCount > 0 && (
                  <div className="flex items-center gap-2 text-white/40">
                    <Video className="w-5 h-5" />
                    <span className="text-sm">{videoCount} {videoCount === 1 ? 'vídeo' : 'vídeos'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {images.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Camera className="w-10 h-10 text-white/20" />
              </div>
              <h2 className="text-2xl font-semibold text-white/60 mb-2">
                {t('empty.title')}
              </h2>
              <p className="text-white/40 max-w-md mx-auto">
                {t('empty.description')}
              </p>
            </div>
          ) : (
            <GalleryGrid images={images} />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/30 via-purple-950/10 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-white/50 mb-8">
              {t('cta.description')}
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium hover:from-purple-500 hover:to-fuchsia-500 shadow-lg shadow-purple-500/20"
            >
              <Link href="/contacto">
                {t('cta.button')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
