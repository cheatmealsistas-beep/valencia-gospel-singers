import { getTranslations } from 'next-intl/server';
import { getActiveGalleryImages } from '@/features/admin/admin.query';
import { GalleryGrid } from './gallery-grid';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-purple-950/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {images.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
                {t('empty.title')}
              </h2>
              <p className="text-muted-foreground/70">
                {t('empty.description')}
              </p>
            </div>
          ) : (
            <GalleryGrid images={images} />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-t from-purple-950/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            {t('cta.description')}
          </p>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-500">
            <Link href="/contacto">
              {t('cta.button')}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
