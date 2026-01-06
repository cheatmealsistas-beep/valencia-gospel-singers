import { MarketingLayout } from '@/shared/components/layouts';

export default function MarketingRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
