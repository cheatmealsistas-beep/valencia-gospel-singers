import { getTranslations } from 'next-intl/server';
import { FadeIn } from '@/shared/components/magic-ui';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ContactForm } from './contact-form';
import { ContactInfo } from './contact-info';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contacto' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contacto' });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-purple-600/20 to-transparent blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold mb-6 tracking-wide uppercase border border-purple-500/20">
                {t('hero.badge')}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                {t('hero.title')}{' '}
                <span
                  className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]"
                  style={{ WebkitBackgroundClip: 'text' }}
                >
                  {t('hero.titleHighlight')}
                </span>
                {t('hero.titleEnd')}
              </h1>
              <p className="text-lg md:text-xl text-white/50">
                {t('hero.description')}
              </p>
            </div>
          </FadeIn>

          {/* Contact Grid */}
          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Form - takes more space */}
            <FadeIn delay={0.1} className="lg:col-span-3">
              <Card className="bg-white/[0.02] border-white/5">
                <CardContent className="p-6 md:p-8">
                  <ContactForm />
                </CardContent>
              </Card>
            </FadeIn>

            {/* Info sidebar */}
            <FadeIn delay={0.2} className="lg:col-span-2">
              <ContactInfo />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Decorative vinyl grooves at bottom */}
      <div className="relative h-32 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/5"
              style={{
                inset: `${i * 15}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
