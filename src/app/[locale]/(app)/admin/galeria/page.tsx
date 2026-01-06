import { getTranslations } from 'next-intl/server';
import { requireAdmin } from '@/shared/auth';
import { getAllGalleryImages } from '@/features/admin/admin.query';
import { GalleryAdmin } from './gallery-admin';

export default async function AdminGaleriaPage() {
  await requireAdmin();
  const t = await getTranslations('admin-galeria');
  const images = await getAllGalleryImages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('description')}
        </p>
      </div>

      <GalleryAdmin images={images} />
    </div>
  );
}
