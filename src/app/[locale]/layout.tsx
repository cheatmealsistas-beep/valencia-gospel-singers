import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { generateRootMetadata } from '@/shared/lib/metadata';
import { GlobalSchemas } from '@/shared/components/seo/json-ld';
import { InfoBar } from '@/shared/components/info-bar';
import { brand } from '@/shared/config/brand';
import type { Locale } from '@/i18n/request';
import './globals.css';

interface MetadataProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  return generateRootMetadata(locale as Locale);
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} data-theme={brand.theme.variant} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <GlobalSchemas />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <InfoBar locale={locale} />
            {children}

            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                classNames: {
                  toast: 'bg-background text-foreground border-border',
                  title: 'font-medium',
                  description: 'text-muted-foreground',
                  success: 'border-green-500/50',
                  error: 'border-destructive/50',
                },
              }}
            />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
